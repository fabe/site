import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Main } from "@/components/Layouts";
import { PageTitle, SectionTitle } from "@/components/Typography";
import { baseUrl } from "./__root";

export const Route = createFileRoute("/colophon")({
  head: () => ({
    meta: [
      { title: "Colophon — Fabian Schultz" },
      { property: "og:title", content: "Colophon — Fabian Schultz" },
      { property: "og:url", content: `${baseUrl}/colophon` },
    ],
    links: [{ rel: "canonical", href: `${baseUrl}/colophon` }],
  }),
  component: ColophonComponent,
});

function ColophonComponent() {
  return (
    <Main>
      <PageTitle>Colophon</PageTitle>
      <dl className="list-container">
        <dt className="list-title">
          <SectionTitle>Typography</SectionTitle>
        </dt>
        <dd className="list-content">
          <p>
            The site is set in{" "}
            <a
              className="link"
              target="_blank"
              href="https://github.com/fabe/FS-UI"
            >
              FS UI
            </a>
            , a custom derivative of GitHub&apos;s{" "}
            <a
              className="link"
              target="_blank"
              href="https://github.com/github/mona-sans"
            >
              Mona Sans
            </a>
            , tuned for small text.
          </p>
          <p>
            It keeps Mona&apos;s character, with larger lowercase letters,
            reinforced thin joins, and clearer separation between weights.
            Simpler letterforms and more open spacing at small optical sizes give
            it a quieter feel for interfaces.
          </p>
        </dd>
      </dl>
      <dl className="list-container">
        <dt className="list-title">
          <SectionTitle>Technology</SectionTitle>
        </dt>
        <dd className="list-content">
          <p>
            Built with{" "}
            <a
              className="link"
              target="_blank"
              href="https://tanstack.com/start"
            >
              TanStack Start
            </a>
            ,{" "}
            <a className="link" target="_blank" href="https://contentful.com">
              Contentful
            </a>
            , and{" "}
            <a className="link" target="_blank" href="https://tailwindcss.com">
              Tailwind
            </a>
            . Hosted on{" "}
            <a className="link" target="_blank" href="https://vercel.com">
              Vercel
            </a>
            .
          </p>
          <p>
            The custom{" "}
            <a className="link" href="/api/graphql">
              GraphQL API
            </a>{" "}
            used to fetch content and live data is built with{" "}
            <a
              className="link"
              target="_blank"
              href="https://apollographql.com"
            >
              Apollo
            </a>{" "}
            and cached at the edge by Vercel.
          </p>
          <p>
            The interactive globe runs on{" "}
            <a className="link" target="_blank" href="https://mapbox.com">
              Mapbox
            </a>
            . The command-K functionality is powered by the great{" "}
            <a className="link" target="_blank" href="https://cmdk.paco.me">
              cmdk
            </a>{" "}
            library from{" "}
            <a className="link" target="_blank" href="https://paco.me">
              Paco
            </a>
            .
          </p>
        </dd>
      </dl>
      <dl className="list-container">
        <dt className="list-title">
          <SectionTitle>Open Source</SectionTitle>
        </dt>
        <dd className="list-content">
          <p>
            This site is open source and available on{" "}
            <a
              className="link"
              target="_blank"
              href="https://github.com/fabe/site"
            >
              GitHub
            </a>
            .
          </p>
        </dd>
      </dl>
    </Main>
  );
}
