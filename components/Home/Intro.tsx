import { Link } from "@tanstack/react-router";
import HomeSection from "./Section";

interface IntroProps {
  introHtml: string;
}

export default function Intro({ introHtml }: IntroProps) {
  return (
    <HomeSection
      title={
        <>
          <h1 className="flex items-center gap-1 text-neutral-800 dark:text-white">
            <Link to="/" className="[font-variation-settings:'wght'_550]">
              Fabian Schultz
            </Link>
          </h1>
          <h2 className="text-neutral-500 dark:text-silver-dark">
            Product Designer
          </h2>
        </>
      }
      dtClassName="border-none pb-4 pt-0 leading-relaxed sm:pb-0"
      ddClassName="border-none pt-0"
    >
      <div
        className="prose-custom [&>p:first-child]:mt-0"
        dangerouslySetInnerHTML={{ __html: introHtml }}
      />
    </HomeSection>
  );
}
