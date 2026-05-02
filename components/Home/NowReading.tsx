import type { PageHomeQueryQuery } from "../../graphql/types/types.generated";
import MediaCard, { MediaCardImageRadius } from "../MediaCard";
import HomeSection from "./Section";

type HomeBook = NonNullable<PageHomeQueryQuery["books"][number]>;

interface NowReadingProps {
  books: HomeBook[];
}

export default function NowReading({ books }: NowReadingProps) {
  if (!books.length) {
    return null;
  }

  return (
    <HomeSection title="Reading" ddClassName="grid gap-4 sm:gap-6">
      {books.map(({ title, author, coverUrl, url }) => {
        const hrefLabel = url.includes("goodreads.com")
          ? "View on Goodreads"
          : "View on Literal";

        return (
          <MediaCard
            key={url}
            title={title}
            subtitle={author}
            image={{
              alt: title && author ? `${title} by ${author}` : "Book cover",
              title: title && author ? `${title} by ${author}` : undefined,
              src: coverUrl ? coverUrl : "",
              width: 56,
              height: 80,
              radius: MediaCardImageRadius.Book,
            }}
            href={url}
            hrefLabel={hrefLabel}
          />
        );
      })}
    </HomeSection>
  );
}
