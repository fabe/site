import { Book } from "../../graphql/types/types.generated";
import MediaCard from "../MediaCard";

interface NowReadingProps {
  books: Book[];
}

export default function NowReading({ books }: NowReadingProps) {
  if (!books.length) {
    return null;
  }

  return (
    <dl className="list-container">
      <dt className="list-title">
        <h3 className="text-neutral-500 dark:text-silver-dark">Reading</h3>
      </dt>

      <dd className="list-content grid gap-4 sm:gap-6">
        {books.map(({ title, author, coverUrl, url }) => (
          <MediaCard
            key={url}
            title={title}
            subtitle={author}
            image={{
              alt: title && author ? `${title} by ${author}` : "Book cover",
              title: title && author ? `${title} by ${author}` : null,
              src: coverUrl ? coverUrl : "",
              width: 56,
              height: 80,
            }}
            href={url}
            hrefLabel="View on Literal"
          />
        ))}
      </dd>
    </dl>
  );
}
