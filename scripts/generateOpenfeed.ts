#!/usr/bin/env tsx
import { mkdir, writeFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import exifr from "exifr";

const baseUrl = "https://fabianschultz.com";
const photoFeedSlug = "feed";
const siteSettingsId = "4VjpvaxnxzRE0XPfQjwHQK";
const outputDirectory = new URL("../public/photo", import.meta.url);
const outputPath = new URL("./feed.json", outputDirectory);
const exifFields = [
  "Make",
  "Model",
  "LensModel",
  "ExposureTime",
  "FNumber",
  "ISO",
  "ISOSpeedRatings",
  "FocalLength",
  "DateTimeOriginal",
] as const;

type Photo = {
  sys: {
    id: string;
    publishedAt?: string | null;
  };
  asset: {
    sys: {
      publishedAt?: string | null;
    };
    url: string;
  };
};

type ContentfulResponse = {
  data?: {
    siteSettings?: {
      avatar?: {
        url?: string | null;
      } | null;
    } | null;
    photoSetCollection?: {
      items: Array<{
        photosCollection?: {
          items: Photo[];
        } | null;
      }>;
    } | null;
  };
  errors?: Array<{ message: string }>;
};

type ParsedExif = {
  Make?: string;
  Model?: string;
  LensModel?: string;
  ExposureTime?: number;
  FNumber?: number;
  ISO?: number;
  ISOSpeedRatings?: number;
  FocalLength?: number;
  DateTimeOriginal?: Date | string;
};

type OpenfeedExif = Partial<
  Record<"camera" | "lens" | "shutter" | "aperture" | "iso" | "focal", string>
>;

function loadLocalEnvironment() {
  for (const path of [".env.local", ".env"]) {
    try {
      loadEnvFile(path);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
}

function formatCamera(exif: ParsedExif): string | undefined {
  const make = exif.Make?.trim();
  const model = exif.Model?.trim();
  if (!make) return model;
  if (!model) return make;
  return model.toLowerCase().startsWith(make.toLowerCase())
    ? model
    : `${make} ${model}`;
}

function formatShutter(value: number | undefined): string | undefined {
  if (!value || value <= 0) return undefined;
  if (value < 1) return `1/${Math.round(1 / value)}`;
  return `${Number(value.toFixed(2))}s`;
}

function formatExif(exif: ParsedExif): OpenfeedExif | undefined {
  const iso = exif.ISO ?? exif.ISOSpeedRatings;
  const formatted: OpenfeedExif = {
    camera: formatCamera(exif),
    lens: exif.LensModel?.trim() || undefined,
    shutter: formatShutter(exif.ExposureTime),
    aperture: exif.FNumber ? `ƒ/${Number(exif.FNumber.toFixed(1))}` : undefined,
    iso: iso ? String(iso) : undefined,
    focal: exif.FocalLength
      ? `${Number(exif.FocalLength.toFixed(1))}mm`
      : undefined,
  };

  const entries = Object.entries(formatted).filter(([, value]) => value);
  return entries.length ? Object.fromEntries(entries) : undefined;
}

function formatPublishedDate(
  value: ParsedExif["DateTimeOriginal"],
  fallback: string | null | undefined,
): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    const normalized = value.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3");
    const date = new Date(normalized);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }

  if (!fallback) throw new Error("Photo has no EXIF or file publication date");
  const date = new Date(fallback);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid photo publication date: ${fallback}`);
  }
  return date.toISOString();
}

async function readOriginalExif(photo: Photo): Promise<ParsedExif> {
  const response = await fetch(getOriginalUrl(photo.asset.url));
  if (!response.ok) {
    throw new Error(
      `Failed to fetch original image ${photo.sys.id}: ${response.status}`,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return (
    (await exifr.parse(buffer, {
      pick: [...exifFields],
      translateValues: true,
      reviveValues: true,
    })) ?? {}
  );
}

async function buildItem(photo: Photo) {
  const exif = await readOriginalExif(photo);
  const permalink = `${baseUrl}/photos/${photo.sys.id}`;
  const formattedExif = formatExif(exif);

  return {
    id: permalink,
    url: permalink,
    image: getOriginalUrl(photo.asset.url),
    date_published: formatPublishedDate(
      exif.DateTimeOriginal,
      photo.asset.sys.publishedAt ?? photo.sys.publishedAt,
    ),
    ...(formattedExif && { _photoring: { exif: formattedExif } }),
  };
}

function getOriginalUrl(url: string): string {
  return (url.startsWith("//") ? `https:${url}` : url).replace(
    /^http:/,
    "https:",
  );
}

async function fetchPhotoFeed() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_DELIVERY;
  if (!spaceId || !accessToken) {
    throw new Error("CONTENTFUL_SPACE_ID and CONTENTFUL_DELIVERY are required");
  }

  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${spaceId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query Openfeed($slug: String!, $siteSettingsId: String!) {
            siteSettings(id: $siteSettingsId) {
              avatar {
                url
              }
            }
            photoSetCollection(where: { slug: $slug }, limit: 1) {
              items {
                photosCollection(limit: 1000) {
                  items {
                    sys {
                      id
                      publishedAt
                    }
                    asset {
                      sys {
                        publishedAt
                      }
                      url
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          slug: photoFeedSlug,
          siteSettingsId,
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Contentful request failed: ${response.status}`);
  }

  const result = (await response.json()) as ContentfulResponse;
  if (result.errors?.length) {
    throw new Error(
      `Contentful request failed: ${result.errors.map(({ message }) => message).join("; ")}`,
    );
  }
  return result.data;
}

async function main() {
  loadLocalEnvironment();
  const data = await fetchPhotoFeed();
  const avatar = data?.siteSettings?.avatar?.url;
  const photos =
    data?.photoSetCollection?.items[0]?.photosCollection?.items ?? [];
  if (!photos.length) throw new Error("Photo feed not found or empty");
  if (!avatar) throw new Error("Site avatar not found");

  const items = [];
  const concurrency = 4;
  for (let index = 0; index < photos.length; index += concurrency) {
    items.push(
      ...(await Promise.all(
        photos.slice(index, index + concurrency).map(buildItem),
      )),
    );
  }
  items.sort(
    (a, b) =>
      new Date(b.date_published).getTime() -
      new Date(a.date_published).getTime(),
  );

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "Fabian Schultz — Photos",
    home_page_url: `${baseUrl}/photos/`,
    feed_url: `${baseUrl}/photo/feed.json`,
    authors: [
      {
        name: "Fabian Schultz",
        url: baseUrl,
        avatar: getOriginalUrl(avatar),
      },
    ],
    _photoring: {
      ring: "openfeed-demo",
      creator: "supfabian",
    },
    items,
  };

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(feed, null, 2)}\n`);
  console.log(`Generated Openfeed photo feed with ${items.length} items`);
}

main().catch((error) => {
  console.error("Openfeed generation failed:", error);
  process.exitCode = 1;
});
