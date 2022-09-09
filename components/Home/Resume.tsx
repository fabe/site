import Badge from "../Badge";
import { LinkExternal } from "../Links";

export default function Resume() {
  return (
    <dl className="list-container">
      <dt className="list-title">
        <h3 className="dark:text-silver-dark text-neutral-500">
          <div className="flex items-center gap-2">
            2022
            <Badge>Present</Badge>
          </div>
        </h3>
      </dt>
      <dd className="list-content">
        <div>Sr. Product Designer, Core Experience</div>
        <div>
          <LinkExternal href="//contentful.com">Contentful</LinkExternal>
        </div>
        <div className="text-sm tracking-sm dark:text-silver-dark text-neutral-500 pt-1">
          Berlin, Germany
        </div>
      </dd>

      <dt className="list-title sm:mt-0 mt-6">
        <h3 className="dark:text-silver-dark text-neutral-500">2019</h3>
      </dt>
      <dd className="list-content">
        <div>Product Designer, Extensibility</div>
        <div>
          <LinkExternal href="//contentful.com">Contentful</LinkExternal>
        </div>
        <div className="text-sm tracking-sm dark:text-silver-dark text-neutral-500 pt-1">
          Berlin, Germany
        </div>
      </dd>

      <dt className="list-title sm:mt-0 mt-6">
        <h3 className="dark:text-silver-dark text-neutral-500">2018</h3>
      </dt>
      <dd className="list-content">
        <div>Technology Intern</div>
        <div>
          <LinkExternal href="//stinkstudios.com">Stink Studios</LinkExternal>
        </div>
        <div className="text-sm tracking-sm dark:text-silver-dark text-neutral-500 pt-1">
          Brooklyn, NY
        </div>
      </dd>
    </dl>
  );
}
