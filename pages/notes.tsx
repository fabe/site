import { Main } from "../components/Layouts";
import { LinkBack } from "../components/Links";
import Note from "../components/Note";
import { SEO } from "../components/SEO";
import { fetchGraphQL } from "../lib/api";
import { serialize } from "next-mdx-remote/serialize";
import { generateNotesFeed } from "../lib/generateFeeds";

export default function Notes({ notes }) {
  return (
    <>
      <SEO seo={{ title: "Notes" }} />
      <Main>
        <dl className="grid sm:mb-20 mb-10 grid-cols-12 gap-4">
          <dt className="sm:col-span-4 col-span-12">
            <div className="md:sticky md:top-4">
              <h1 className="flex [font-variation-settings:'wght'_480] text-white">
                <LinkBack href="/">Fabian Schultz</LinkBack>
              </h1>
              <h2 className="text-silver-dark">Notes</h2>
            </div>
          </dt>
          <dd className="sm:col-span-8 col-span-12">
            {notes.map((note) => (
              <Note key={note.sys.id} note={note} />
            ))}
          </dd>
        </dl>
      </Main>
    </>
  );
}

export async function getStaticProps(context) {
  let notes = await fetchGraphQL(`
    query {
      noteCollection {
        items {
          sys {
            id
          }
          date
          body
        }
      }
    }
  `).catch((err) => console.log(err));

  notes = await Promise.all(
    notes.data.noteCollection.items.map(async (note) => {
      const serializedBody = await serialize(note.body);
      return { ...note, serializedBody };
    })
  );

  generateNotesFeed(notes);

  return {
    props: { notes },
  };
}
