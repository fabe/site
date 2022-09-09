import { LinkExternal } from "../Links";

export default function Writing() {
  return (
    <dl className="list-container">
      <dt className="list-title">
        <h3 className="dark:text-silver-dark text-neutral-500">Writing</h3>
      </dt>
      <dd className="list-content">
        <div>
          <div>
            <LinkExternal href="//contentful.com/blog/2021/08/20/forma36-design-system-color-update">
              Creating an accessible color palette for Forma 36
            </LinkExternal>
          </div>
          <time className="time" dateTime="2021-08-20">
            August 20, 2021
          </time>
        </div>
      </dd>
    </dl>
  );
}
