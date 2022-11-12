import Link from "next/link";

export default function Notes() {
  return (
    <dl className="list-container">
      <dt className="list-title">
        <div className="md:top-4">
          <h3 className=" text-silver-dark">Notes</h3>
        </div>
      </dt>
      <dd className="list-content">
        <div className="note mb-2 ml-0 sm:-ml-4">
          This is merely a test.
          <time className="time" dateTime="YYYY-MM-DDThh:mm:ssTZD">
            August 20, 2022
          </time>
        </div>
        <Link href="/notes" className="link link-sm mr-3">
          View all
        </Link>
        <a className="link link-sm" href="/rss/notes.xml">
          RSS
        </a>
      </dd>
    </dl>
  );
}
