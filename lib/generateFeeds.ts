import fs from "fs";
import { marked } from "marked";
import { DATE_FORMAT } from "../constants";
const MAX = 10;

export function generateNotesFeed(notes) {
  const feed = `<?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>Fabian Schultz</title>
      <subtitle>Notes</subtitle>
      <link href="https://fabianschultz.com/rss/notes" rel="self"/>
      <link href="https://fabianschultz.com/"/>
      <updated>${notes[0].date}</updated>
      <id>https://fabianschultz.com/</id>
      <author>
        <name>Fabian Schultz</name>
        <email>desk@fabianschultz.com</email>
      </author>
      ${notes.slice(0, MAX).reduce((acc, note) => {
        return `${acc}
          <entry>
            <id>${note.sys.id}</id>
            <title>${new Date(note.date).toLocaleDateString(
              "en-US",
              DATE_FORMAT
            )}</title>
            <description>${marked.parse(note.body, {
              xhtml: true,
            })}</description>
            <link href="https://fabianschultz.com/notes#${note.sys.id}" />
            <updated>${note.date}</updated>
            <guid isPermaLink="true">https://fabianschultz.com/notes#${
              note.sys.id
            }</guid>
          </entry>`;
      }, "")}
    </feed>
  `;

  fs.mkdirSync("./public/rss", { recursive: true });
  fs.writeFileSync("./public/rss/notes.xml", feed);
}
