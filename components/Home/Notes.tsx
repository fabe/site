import { Link } from "@tanstack/react-router";
import HomeSection from "./Section";

export default function Notes() {
  return (
    <HomeSection title="Notes">
      <div className="note mb-2 ml-0 sm:-ml-4">
        This is merely a test.
        <time className="time" dateTime="YYYY-MM-DDThh:mm:ssTZD">
          August 20, 2022
        </time>
      </div>
      <Link to="/notes" className="link link-sm mr-3">
        View all
      </Link>
      <a className="link link-sm" href="/rss/notes.xml">
        RSS
      </a>
    </HomeSection>
  );
}
