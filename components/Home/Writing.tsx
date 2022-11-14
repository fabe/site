import formatDate from "../../lib/formatDate";
import { LinkExternal } from "../Links";

export default function Writing() {
  return (
    <dl className="list-container">
      <dt className="list-title">
        <h3 className="text-neutral-500 dark:text-silver-dark">Writing</h3>
      </dt>
      <dd className="list-content">
        <div>
          <div>
            <LinkExternal href="//contentful.com/blog/2021/08/20/forma36-design-system-color-update">
              Creating an accessible color palette
            </LinkExternal>
          </div>
          <time className="time" dateTime="2021-08-20">
            Life at Contentful &middot; {formatDate("2021-08-20", true)}
          </time>
        </div>
      </dd>
    </dl>
  );
}
