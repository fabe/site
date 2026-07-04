import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Filter } from "@/components/Filter";
import { Main } from "@/components/Layouts";
import { PageTitle } from "@/components/Typography";
import { baseUrl } from "../__root";

export const Route = createFileRoute("/photos/feed")({
  head: () => ({
    meta: [
      { title: "Photos — Fabian Schultz" },
      { name: "description", content: "Photo feed." },
      { property: "og:title", content: "Photos — Fabian Schultz" },
      { property: "og:description", content: "Photo feed." },
      { property: "og:url", content: `${baseUrl}/photos/feed` },
    ],
    links: [{ rel: "canonical", href: `${baseUrl}/photos/feed` }],
  }),
  component: PhotosComponent,
});

function PhotosComponent() {
  const navigate = useNavigate();

  return (
    <Main>
      <div className="mb-6 flex items-center justify-between gap-2 sm:mb-12">
        <PageTitle className="pb-0 sm:pb-0">Photos</PageTitle>
        <Filter
          label="Photo view"
          value="feed"
          onChange={(value) => {
            if (value === "sets") navigate({ to: "/photos/sets" });
          }}
          items={[
            { value: "feed", label: "Feed" },
            { value: "sets", label: "Sets" },
          ]}
        />
      </div>
      <div className="rounded-lg border border-line/10 bg-surface/40 px-6 py-12 text-center dark:border-line/5">
        <p className="m-0 text-sm text-muted font-ui-sm">No photos yet.</p>
      </div>
    </Main>
  );
}
