import Badge from "../Badge";
import { LinkExternal } from "../Links";
import { SectionTitle, smallMutedTextClass } from "../Typography";

export default function Resume() {
  return (
    <dl className="list-container">
      <dt className="list-title">
        <SectionTitle>
          <div className="flex items-center gap-2">
            2026
            <Badge>Present</Badge>
          </div>
        </SectionTitle>
      </dt>
      <dd className="list-content">
        <div>Senior Product Designer</div>
        <div>
          <LinkExternal href="//github.com">GitHub</LinkExternal>
        </div>
        <div className={`pt-1 ${smallMutedTextClass}`}>
          London, UK
        </div>
      </dd>

      <dt className="list-title mt-4 border-none pt-0 sm:mt-0">
        <SectionTitle>2025</SectionTitle>
      </dt>
      <dd className="list-content border-none pt-0">
        <div>Senior &rarr; Staff Product Designer</div>
        <div>
          <LinkExternal href="//contentful.com">Contentful</LinkExternal>
        </div>
        <div className={`pt-1 ${smallMutedTextClass}`}>
          London, UK
        </div>
      </dd>

      <dt className="list-title mt-4 border-none pt-0 sm:mt-0">
        <SectionTitle>2018</SectionTitle>
      </dt>
      <dd className="list-content border-none pt-0">
        <div>Technology Intern</div>
        <div>
          <LinkExternal href="//stinkstudios.com">Stink Studios</LinkExternal>
        </div>
        <div className={`pt-1 ${smallMutedTextClass}`}>
          Brooklyn, NY
        </div>
      </dd>
    </dl>
  );
}
