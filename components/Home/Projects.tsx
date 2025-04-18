import formatDate from "../../lib/formatDate";
import Badge from "../Badge";
import { LinkExternal } from "../Links";

export default function Projects() {
  return (
    <dl className="list-container">
      <dt className="list-title">
        <h3 className="text-neutral-500 dark:text-silver-dark">Projects</h3>
      </dt>
      <dd className="list-content">
        <div>
          <div className="flex items-center gap-2">
            <Badge isFeatured>New</Badge>
            <LinkExternal href="https://globe.cv">Globe.cv</LinkExternal>
          </div>
          <p className="pt-1 text-sm text-neutral-500 [font-variation-settings:'opsz'_14] dark:text-silver-dark">
            Your travels, at a glance.
          </p>
        </div>
      </dd>
    </dl>
  );
}
