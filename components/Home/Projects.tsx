import Badge from "../Badge";
import { LinkExternal } from "../Links";
import { smallMutedTextClass } from "../Typography";
import HomeSection from "./Section";

export default function Projects() {
  return (
    <HomeSection title="Projects">
      <div>
        <div className="flex items-center gap-2">
          <Badge isFeatured>New</Badge>
          <LinkExternal href="https://globe.cv">Globe.cv</LinkExternal>
        </div>
        <p className={`pt-1 ${smallMutedTextClass}`}>
          Your travels, at a glance.
        </p>
      </div>
    </HomeSection>
  );
}
