#!/usr/bin/env tsx
import { mkdir, writeFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";

const baseUrl = "https://fabianschultz.com";
const photoFeedSlug = "feed";
const siteSettingsId = "4VjpvaxnxzRE0XPfQjwHQK";
const outputDirectory = new URL("../public/photo", import.meta.url);
const outputPath = new URL("./feed.json", outputDirectory);

type Photo = {
  sys: {
    id: string;
    firstPublishedAt?: string | null;
  };
  asset: {
    url: string;
  };
  exif?: ParsedExif | null;
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

function formatPublishedDate(value: string | null | undefined): string {
  if (!value) throw new Error("Photo has no first publication date");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid photo publication date: ${value}`);
  }
  return date.toISOString();
}

function buildItem(photo: Photo) {
  const permalink = `${baseUrl}/photos/${photo.sys.id}`;
  const formattedExif = photo.exif ? formatExif(photo.exif) : undefined;

  return {
    id: permalink,
    url: permalink,
    image: getOriginalUrl(photo.asset.url),
    date_published: formatPublishedDate(photo.sys.firstPublishedAt),
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
                      firstPublishedAt
                    }
                    asset {
                      url
                    }
                    exif
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

  const items = photos.map(buildItem);
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
