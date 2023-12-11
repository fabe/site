import React from "react";
import { Main } from "../components/Layouts";
import { SEO } from "../components/SEO";
import { LinkExternal } from "../components/Links";

// TODO: Fetch from CMS
const PATENTS = [
  { id: "US11809918B1", title: "App actions in a content management system" },
];

export default function Patents() {
  return (
    <>
      <SEO
        seo={{
          title: "Patents",
          path: "/patents",
        }}
      />
      <Main>
        <dl className="list-container items-center gap-2">
          {PATENTS.map((patent) => (
            <React.Fragment key={patent.id}>
              <dt className="list-title border-none pt-0">
                <div className="time time-lg">{patent.id}</div>
              </dt>
              <dd className="list-content border-none pb-4 pt-0 sm:pb-0">
                <div>
                  <LinkExternal
                    href={`//patents.google.com/patent/${patent.id}`}
                  >
                    {patent.title}
                  </LinkExternal>
                </div>
              </dd>
            </React.Fragment>
          ))}
        </dl>
      </Main>
    </>
  );
}
