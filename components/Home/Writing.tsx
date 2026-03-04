import formatDate from "../../lib/formatDate";
import { LinkExternal } from "../Links";
import HomeSection from "./Section";

export default function Writing() {
  return (
    <HomeSection title="Writing">
      <div>
        <div>
          <LinkExternal href="//contentful.com/blog/forma-36-design-system-color-update">
            Creating an accessible color palette
          </LinkExternal>
        </div>
        <time className="time" dateTime="2021-08-20">
          Life at Contentful &middot; {formatDate("2021-08-20", true)}
        </time>
      </div>
    </HomeSection>
  );
}
