#!/usr/bin/env tsx
import { existsSync, readFileSync } from "node:fs";
import { createClient } from "contentful-management";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

type CloudinaryResource = {
  public_id: string;
  resource_type: string;
  type: string;
  format: string;
  version: number;
  url: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  duration?: number | null;
  tags?: string[];
  metadata?: Record<string, unknown>;
};

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const force = args.has("--force");
const skipPublish = args.has("--skip-publish");
const limit = getArgValue("--limit");
const entryId = getArgValue("--entry-id");

loadEnvFile(".env.local");
loadEnvFile(".env");

const locale = process.env.CONTENTFUL_DEFAULT_LOCALE ?? "en-US";
const contentTypeId = "photo";
const assetFieldId = "asset";
const cloudinaryFieldId = "cloudinaryImage";
const cloudinaryFolder = "photos";
const cloudinaryUploadLimitBytes = 10 * 1024 * 1024;
const maxUploadDimension = 5000;

const requiredEnv = [
  "CONTENTFUL_SPACE_ID",
  "CONTENTFUL_MANAGEMENT_TOKEN",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getArgValue(name: string): string | undefined {
  const prefix = `${name}=`;
  return process.argv
    .slice(2)
    .find((arg) => arg.startsWith(prefix))
    ?.slice(prefix.length);
}

function loadEnvFile(path: string) {
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    if (!key || process.env[key]) continue;

    process.env[key] = valueParts.join("=").replace(/^['\"]|['\"]$/g, "");
  }
}

function getExistingCloudinaryPublicId(entry: any): string | undefined {
  const value = entry.fields[cloudinaryFieldId]?.[locale];
  const asset = Array.isArray(value) ? value[0] : value;
  return asset?.public_id;
}

function getAssetId(entry: any): string | undefined {
  return entry.fields[assetFieldId]?.[locale]?.sys?.id;
}

function getPublicId(entry: any): string {
  return `${cloudinaryFolder}/${entry.sys.id}`;
}

function asHttpsContentfulUrl(url: string): string {
  if (url.startsWith("//")) return `https:${url}`;
  return url.replace(/^http:/, "https:");
}

function withAutoTransform(url: string): string {
  return url.replace("/image/upload/", "/image/upload/f_auto/q_auto/");
}

function buildCloudinaryFieldValue(resource: CloudinaryResource) {
  const originalUrl = resource.url.replace("/f_auto/q_auto/", "/");
  const originalSecureUrl = resource.secure_url.replace("/f_auto/q_auto/", "/");

  return [
    {
      url: withAutoTransform(originalUrl),
      tags: resource.tags ?? [],
      type: resource.type,
      bytes: resource.bytes,
      width: resource.width,
      format: resource.format,
      height: resource.height,
      version: resource.version,
      duration: resource.duration ?? null,
      metadata: resource.metadata ?? {},
      public_id: resource.public_id,
      created_at: resource.created_at,
      secure_url: withAutoTransform(originalSecureUrl),
      resource_type: resource.resource_type,
      original_url: originalUrl,
      original_secure_url: originalSecureUrl,
      original_transformed_url: withAutoTransform(originalUrl),
      raw_transformation: "f_auto/q_auto",
    },
  ];
}

async function getCloudinaryResource(publicId: string): Promise<CloudinaryResource | null> {
  try {
    return (await cloudinary.api.resource(publicId, {
      resource_type: "image",
    })) as CloudinaryResource;
  } catch (error: any) {
    if (error?.http_code === 404 || error?.error?.http_code === 404) return null;
    throw error;
  }
}

async function uploadBufferToCloudinary(
  buffer: Buffer,
  publicId: string,
): Promise<CloudinaryResource> {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        overwrite: false,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result as CloudinaryResource);
      },
    );

    upload.end(buffer);
  });
}

async function fetchImageBuffer(sourceUrl: string): Promise<Buffer> {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch source image: ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function optimizeForCloudinaryUpload(sourceUrl: string): Promise<Buffer> {
  const original = await fetchImageBuffer(sourceUrl);
  if (original.byteLength <= cloudinaryUploadLimitBytes) return original;

  const metadata = await sharp(original).metadata();
  const largestDimension = Math.max(metadata.width ?? 0, metadata.height ?? 0);
  let dimension = Math.min(largestDimension || maxUploadDimension, maxUploadDimension);

  while (dimension >= 1600) {
    let best: Buffer | null = null;
    let low = 60;
    let high = 95;

    while (low <= high) {
      const quality = Math.floor((low + high) / 2);
      const candidate = await sharp(original)
        .rotate()
        .resize(dimension, dimension, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();

      if (candidate.byteLength <= cloudinaryUploadLimitBytes) {
        best = candidate;
        low = quality + 1;
      } else {
        high = quality - 1;
      }
    }

    if (best) return best;
    dimension = Math.floor(dimension * 0.9);
  }

  throw new Error("Could not optimize image below Cloudinary upload limit");
}

async function ensureCloudinaryResource(publicId: string, sourceUrl: string) {
  const existing = await getCloudinaryResource(publicId);
  if (existing) return { resource: existing, uploaded: false };

  const buffer = await optimizeForCloudinaryUpload(sourceUrl);
  const resource = await uploadBufferToCloudinary(buffer, publicId);

  return { resource, uploaded: true };
}

async function main() {
  const client = createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
  });
  const spaceId = process.env.CONTENTFUL_SPACE_ID!;
  const environmentId = process.env.CONTENTFUL_ENVIRONMENT ?? "master";

  const entries = entryId
    ? [await client.entry.get({ spaceId, environmentId, entryId })]
    : (
        await client.entry.getMany({
          spaceId,
          environmentId,
          query: {
            content_type: contentTypeId,
            limit: limit ? Number(limit) : 1000,
          },
        })
      ).items;

  let migrated = 0;
  let skipped = 0;
  let repaired = 0;
  let errors = 0;

  for (const entry of entries) {
    try {
      const title = entry.fields.description?.[locale] ?? entry.sys.id;
      const existingPublicId = getExistingCloudinaryPublicId(entry);

      if (existingPublicId && !force) {
        console.log(`skip ${entry.sys.id}: already has ${existingPublicId}`);
        skipped++;
        continue;
      }

      const assetId = getAssetId(entry);
      if (!assetId) {
        console.log(`skip ${entry.sys.id}: no asset field`);
        skipped++;
        continue;
      }

      const asset = await client.asset.get({ spaceId, environmentId, assetId });
      const assetFile = asset.fields.file?.[locale];
      const sourceUrl = assetFile?.url
        ? asHttpsContentfulUrl(assetFile.url)
        : null;

      if (!sourceUrl) {
        console.log(`skip ${entry.sys.id}: asset has no URL`);
        skipped++;
        continue;
      }

      const publicId = getPublicId(entry);
      console.log(
        `${dryRun ? "would migrate" : "migrate"} ${entry.sys.id}: ${title}`,
      );
      console.log(`  ${sourceUrl}`);
      console.log(`  -> ${publicId}`);

      if (dryRun) {
        migrated++;
        continue;
      }

      const { resource, uploaded } = await ensureCloudinaryResource(
        publicId,
        sourceUrl,
      );

      entry.fields[cloudinaryFieldId] = {
        ...(entry.fields[cloudinaryFieldId] ?? {}),
        [locale]: buildCloudinaryFieldValue(resource),
      };

      const updatedEntry = await client.entry.update(
        { spaceId, environmentId, entryId: entry.sys.id },
        entry,
      );
      if (!skipPublish) {
        await client.entry.publish(
          { spaceId, environmentId, entryId: updatedEntry.sys.id },
          updatedEntry,
        );
      }

      if (uploaded) migrated++;
      else repaired++;

      console.log(
        `  ${uploaded ? "uploaded" : "reused existing Cloudinary asset"}${
          skipPublish ? " and updated draft" : " and published"
        }`,
      );
    } catch (error: any) {
      errors++;
      console.error(`error ${entry.sys.id}: ${error?.message ?? error}`);
    }
  }

  console.log("\nDone");
  console.log(`  migrated: ${migrated}`);
  console.log(`  repaired: ${repaired}`);
  console.log(`  skipped: ${skipped}`);
  console.log(`  errors: ${errors}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
