import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Main } from "@/components/Layouts";
import { LinkExternal } from "@/components/Links";
import { PageTitle } from "@/components/Typography";
import { baseUrl } from "./__root";

const PATENTS = [
  { id: "US11809918B1", title: "App actions in a content management system" },
  {
    id: "US12664357B1",
    title:
      "Incorporating artificial intelligence actions in workflows implemented in a content management system",
  },
];

export const Route = createFileRoute("/patents")({
  head: () => ({
    meta: [
      { title: "Patents — Fabian Schultz" },
      { property: "og:title", content: "Patents — Fabian Schultz" },
      { property: "og:url", content: `${baseUrl}/patents` },
    ],
    links: [{ rel: "canonical", href: `${baseUrl}/patents` }],
  }),
  component: PatentsComponent,
});

function PatentsComponent() {
  return (
    <Main>
      <PageTitle>Patents</PageTitle>
      <dl className="list-container items-top gap-4">
        {PATENTS.map((patent) => (
          <React.Fragment key={patent.id}>
            <dt className="list-title border-none pt-0">
              <div className="time time-lg tabular-nums">{patent.id}</div>
            </dt>
            <dd className="list-content border-none pb-4 pt-0 sm:pb-0">
              <div>
                <LinkExternal
                  href={`https://patents.google.com/patent/${patent.id}`}
                >
                  {patent.title}
                </LinkExternal>
              </div>
            </dd>
          </React.Fragment>
        ))}
      </dl>
    </Main>
  );
}
