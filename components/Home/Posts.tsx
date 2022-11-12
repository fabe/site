import Link from "next/link";
import formatDate from "../../lib/formatDate";
import { NoteIcon } from "../Icons";

export default function Posts({ posts }) {
  return (
    <dl className="list-container">
      <dt className="list-title">
        <h3 className="text-neutral-500 dark:text-silver-dark">Posts</h3>
      </dt>
      <dd className="list-content">
        {posts.map((post) => (
          <div className="pb-2 last-of-type:pb-0">
            <div>
              <Link href={`/posts/${post.slug}`}>
                <a className="link inline-flex items-center gap-1 sm:-ml-5">
                  <div className="opacity-20 dark:opacity-30">
                    <NoteIcon size={16} />
                  </div>
                  {post.title}
                </a>
              </Link>
            </div>
            <time className="time hidden" dateTime={post.publishedDate}>
              {formatDate(post.publishedDate, true)}
            </time>
          </div>
        ))}
        <Link href="/posts">
          <a className="link link-sm mt-4 inline-flex">View all</a>
        </Link>
      </dd>
    </dl>
  );
}
