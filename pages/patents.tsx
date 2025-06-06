import React from "react";
import { Main } from "../components/Layouts";
import { SEO } from "../components/SEO";
import { LinkExternal } from "../components/Links";
import { title } from "process";

// TODO: Fetch from CMS
const PATENTS = [
  { id: "US11809918B1", title: "App actions in a content management system" },
  {
    id: "Pending",
    title:
      "Trakvopniz ulfretapoz zqplxermt jskdqpwz in vrmpwglux qmalpwnzox in a frlqvext znuxqetvnt jxqplor",
    pending: true,
  },
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
        <h1 className="pb-6 text-2xl text-neutral-800 [font-variation-settings:'opsz'_32,_'wght'_500] dark:text-white sm:pb-12 sm:text-3xl">
          Patents
        </h1>
        <dl className="list-container items-top gap-4">
          {PATENTS.map((patent) => (
            <React.Fragment key={patent.id}>
              <dt className="list-title border-none pt-0">
                <div className="time time-lg tabular-nums">{patent.id}</div>
              </dt>
              <dd className="list-content border-none pb-4 pt-0 sm:pb-0">
                <div>
                  {patent.pending ? (
                    <div>
                      <span className="sr-only">Confidential patent title</span>
                      <span className="blur-sm select-none" aria-hidden="true">
                        {patent.title}
                      </span>
                    </div>
                  ) : (
                    <LinkExternal
                      href={`//patents.google.com/patent/${patent.id}`}
                      aria-label={`View patent ${patent.id}: ${patent.title}`}
                    >
                      {patent.title}
                    </LinkExternal>
                  )}
                </div>
              </dd>
            </React.Fragment>
          ))}
        </dl>
      </Main>
    </>
  );
}
