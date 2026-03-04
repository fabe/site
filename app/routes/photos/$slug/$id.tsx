import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import React from "react";
import { QUERY_PHOTO_SET } from "@/graphql/queries";
import LightboxPhoto from "@/components/Lightbox/Photo";
import Footer from "@/components/Footer";
import { baseUrl } from "../../__root";
import { withImageParams } from "@/lib/imageProxy";

const fetchPhotoDetail = createServerFn()
  .inputValidator((d: { slug: string; id: string }) => d)
  .handler(async ({ data: { slug, id } }) => {
    const { initializeApollo } = await import("@/graphql/client");
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: QUERY_PHOTO_SET,
      variables: { slug },
    });

    const photo = data.photoSet.photos.find((p: any) => p.id === id);

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
    const { photo, photoSet } = loaderData;
    const title = photo.description || "A photo";
    return {
      meta: [
        { title: `${title} — Fabian Schultz` },
        {
          property: "og:title",
          content: `${title} — Fabian Schultz`,
        },
        {
          property: "og:image",
          content: withImageParams(photo.url, { w: 1024, h: 1024, fit: "fill" }),
        },
        { property: "og:image:alt", content: title },
      ],
    };
  },
  component: PhotoDetailComponent,
});

function PhotoDetailComponent() {
  const { photo, photoSet } = Route.useLoaderData();

  return (
    <>
      <div className="h-screen">
        <LightboxPhoto photo={photo} />
      </div>

      <Footer />
    </>
  );
}
