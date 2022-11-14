import Link from "next/link";
import formatDate from "../../lib/formatDate";
import { FeedIcon, NoteIcon } from "../Icons";

export default function Posts({ posts }) {
  return (
    <dl className="list-container">
      <dt className="list-title">
        <h3 className="text-neutral-500 dark:text-silver-dark">Posts</h3>
      </dt>
      <dd className="list-content">
        {posts.map((post) => (
          <div key={post.slug} className="pb-2 last-of-type:pb-0">
            <div>
              <Link
                href={`/posts/${post.slug}`}
                className="link inline-flex items-center gap-1 sm:-ml-5"
              >
                <div className="opacity-20 dark:opacity-30">
                  <NoteIcon size={16} />
                </div>
                {post.title}
              </Link>
            </div>
            <time className="time hidden" dateTime={post.publishedDate}>
              {formatDate(post.publishedDate, true)}
            </time>
          </div>
        ))}
        <div className="mt-2 flex items-center gap-3">
          <Link href="/posts" className="link link-sm inline-flex items-center">
            View all
          </Link>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/posts/atom"
            className="link link-sm inline-flex items-center gap-0.5"
          >
            <FeedIcon size={12} />
            RSS
          </a>
        </div>
      </dd>
    </dl>
  );
}
