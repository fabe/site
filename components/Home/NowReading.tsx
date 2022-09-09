import Image from "next/image";
import { Book } from "../../graphql/types/types.generated";
import MediaCard from "../MediaCard";

interface NowReadingProps {
  book: Book;
}

export default function NowReading({ book }: NowReadingProps) {
  const { coverUrl, title, author, okuUrl } = book;

  return (
    <dl className="list-container">
      <dt className="list-title">
        <h3 className=" text-silver-dark">Reading</h3>
      </dt>

      <dd className="list-content">
        <MediaCard
          title={title}
          subtitle={author}
          image={{
            alt: title && author ? `${title} by ${author}` : "Book cover",
            title: title && author ? `${title} by ${author}` : null,
            src: coverUrl ? coverUrl : "",
            width: 56,
            height: 80,
          }}
          href={okuUrl}
          hrefLabel="View on Oku"
        />
      </dd>
    </dl>
  );
}
