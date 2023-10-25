import Badge from "../Badge";
import { LinkExternal } from "../Links";

export default function Resume() {
  return (
    <dl className="list-container">
      <dt className="list-title">
        <h3 className="text-neutral-500 dark:text-silver-dark">
          <div className="flex items-center gap-2">
            2023
            <Badge>Present</Badge>
          </div>
        </h3>
      </dt>
      <dd className="list-content">
        <div>Sr. Product Designer, Collaboration & AI</div>
        <div>
          <LinkExternal href="//contentful.com">Contentful</LinkExternal>
        </div>
        <div className="pt-1 text-sm text-neutral-500 [font-variation-settings:'opsz'_14] dark:text-silver-dark">
          London, UK
        </div>
      </dd>

      <dt className="list-title mt-4 border-none pt-0 sm:mt-0">
        <h3 className="text-neutral-500 dark:text-silver-dark">2019</h3>
      </dt>
      <dd className="list-content border-none pt-0">
        <div>Product Designer, Extensibility & Core Experience</div>
        <div>
          <LinkExternal href="//contentful.com">Contentful</LinkExternal>
        </div>
        <div className="pt-1 text-sm text-neutral-500 [font-variation-settings:'opsz'_14] dark:text-silver-dark">
          Berlin, Germany
        </div>
      </dd>

      <dt className="list-title mt-4 border-none pt-0 sm:mt-0">
        <h3 className="text-neutral-500 dark:text-silver-dark">2018</h3>
      </dt>
      <dd className="list-content border-none pt-0">
        <div>Technology Intern</div>
        <div>
          <LinkExternal href="//stinkstudios.com">Stink Studios</LinkExternal>
        </div>
        <div className="pt-1 text-sm text-neutral-500 [font-variation-settings:'opsz'_14] dark:text-silver-dark">
          Brooklyn, NY
        </div>
      </dd>
    </dl>
  );
}
