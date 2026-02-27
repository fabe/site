import { Link } from "@tanstack/react-router";
import formatDate from "../../lib/formatDate";
import { FeedIcon, NoteIcon } from "../Icons";
import HomeSection from "./Section";

export default function Posts({ posts }: { posts: any[] }) {
  return (
    <HomeSection title="Posts">
      {posts.map((post) => (
        <div key={post.slug} className="pb-2 last-of-type:pb-0">
          <div>
            <Link
              to={`/posts/${post.slug}`}
              className="link inline-flex items-center gap-1"
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
        <Link to="/posts" className="link link-sm inline-flex items-center">
          View all
        </Link>
        <a
          href="/posts/atom"
          className="link link-sm inline-flex items-center gap-1"
        >
          <FeedIcon size={12} />
          RSS
        </a>
      </div>
    </HomeSection>
  );
}
