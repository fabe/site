import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import React from "react";
import { QUERY_PHOTO_SET } from "@/graphql/queries";
import type { PhotoSetQueryQuery } from "@/graphql/types/types.generated";
import LightboxPhoto from "@/components/Lightbox/Photo";
import Footer from "@/components/Footer";
import { baseUrl } from "../../__root";
import photoImageLoader from "@/lib/photoImageLoader";

const fetchPhotoDetail = createServerFn()
  .inputValidator((d: { slug: string; id: string }) => d)
  .handler(async ({ data: { slug, id } }) => {
    const { initializeApollo } = await import("@/graphql/client");
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query<PhotoSetQueryQuery>({
      query: QUERY_PHOTO_SET,
      variables: { slug },
    });

    if (!data.photoSet) {
      throw new Error("Photo set not found");
    }

    const photo = data.photoSet.photos?.find((p) => p?.id === id);

    if (!photo) {
      throw new Error("Photo not found");
    }

    return {
      photoSet: data.photoSet,
      photo,
      siteSettings: data.siteSettings,
    };
  });

export const Route = createFileRoute("/photos/$slug/$id")({
  loader: async ({ params }) => {
    return await fetchPhotoDetail({
      data: { slug: params.slug, id: params.id },
    });
  },
  head: ({ loaderData }) => {
    if (!loaderData?.photo) return {};
    const { photo } = loaderData;
    const title = photo.description || "A photo";
    const image = photoImageLoader({
      src: photo.url,
      width: 1200,
      quality: 90,
      custom: ["h=630", "fit=fill"],
    });
    return {
      meta: [
        { title: `${title} — Fabian Schultz` },
        {
          property: "og:title",
          content: `${title} — Fabian Schultz`,
        },
        { property: "og:image", content: image },
        { property: "og:image:secure_url", content: image },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: title },
        { name: "twitter:title", content: `${title} — Fabian Schultz` },
        { name: "twitter:image", content: image },
        { name: "twitter:image:alt", content: title },
      ],
    };
  },
  component: PhotoDetailComponent,
});

function PhotoDetailComponent() {
  const { photo } = Route.useLoaderData();

  return (
    <>
      <div className="h-screen">
        <LightboxPhoto photo={photo} />
      </div>

      <Footer />
    </>
  );
}
