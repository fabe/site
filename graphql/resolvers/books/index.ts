import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
} from "@apollo/client";
// import { setContext } from "@apollo/client/link/context";
import {
  Book,
  CollectionType,
  QueryBooksArgs,
} from "../../types/types.generated";
import Parser from "rss-parser";

const LITERAL_BASE_URL = "https://api.literal.club/";

// No need for auth at the moment
//
// const authLink = setContext(async (_, { headers }) => {
//   const token = await getLiteralToken(LITERAL_EMAIL, LITERAL_PASSWORD);
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : "",
//     },
//   };
// });

let _literalClient: ApolloClient<any> | null = null;

function getLiteralClient() {
  if (!_literalClient) {
    _literalClient = new ApolloClient({
      ssrMode: true,
      link: createHttpLink({
        uri: LITERAL_BASE_URL,
        credentials: "same-origin",
      }),
      cache: new InMemoryCache(),
    });
  }
  return _literalClient;
}

const getLiteralToken = async (email: String, password: String) => {
  if (process.env.LITERAL_TOKEN) return process.env.LITERAL_TOKEN;

  const query = JSON.stringify({
    query: `
        mutation {
          login(email: "${process.env.LITERAL_EMAIL}", password: "${process.env.LITERAL_PASSWORD}") {
            token
            email
            languages
            profile {
              id
              handle
              name
              bio
              image
            }
          }
        }
    `,
  });

  const response = await fetch(LITERAL_BASE_URL, {
    headers: { "content-type": "application/json" },
    method: "POST",
    body: query,
  });

  const json = await response.json();
  console.log(json.data.login.profile);

  return json.data.login.token;
};

export async function getBooks(_: any, args: QueryBooksArgs): Promise<Book[]> {
  const { limit, source } = args;
  let books = [];

  // Default to GOODREADS if no source specified
  const bookSource = source || "GOODREADS";

  switch (args.collection) {
    case CollectionType.Reading:
      if (bookSource === "LITERAL") {
        books = await getReadingFromLiteral();
      } else {
        books = await getReadingFromGoodreads();
      }
      break;
    default:
      if (bookSource === "LITERAL") {
        books = await getReadingFromLiteral();
      } else {
        books = await getReadingFromGoodreads();
      }
      break;
  }

  if (books.length > limit) {
    books = books.slice(0, limit);
  }

  return books;
}

async function getReadingFromLiteral(): Promise<Book[]> {
  const response = await getLiteralClient().query({
    query: gql`
      query booksByReadingStateAndProfile($profileId: String!) {
        booksByReadingStateAndProfile(
          limit: 3
          offset: 0
          readingStatus: IS_READING
          profileId: $profileId
        ) {
          slug
          title
          publishedDate
          cover
          authors {
            id
            name
          }
          gradientColors
        }
      }
    `,
    variables: {
      profileId: process.env.LITERAL_USER_ID,
    },
  });

  const isReading = response.data.booksByReadingStateAndProfile;

  if (!isReading) return [];

  const books = isReading.map((book) => ({
    title: book.title,
    author: book.authors
      .map((a) => {
        return a.name;
      })
      .join(", "),
    url: `https://literal.club/${process.env.LITERAL_USER_HANDLE}/book/${book.slug}`,
    coverUrl: book.cover,
    readingDate: book.publishedDate,
    fallbackColors: book.gradientColors,
  }));

  return books;
}

/**
 * Cleans Goodreads book titles by removing common patterns:
 * - Series info in parentheses: "(Series Name #1)"
 * - Subtitles after colons: "Title: Subtitle"
 * - Extra whitespace
 */
function cleanGoodreadsTitle(title: string): string {
  if (!title) return title;

  let cleaned = title;

  // Remove series info in parentheses at the end (e.g., "(Harry Potter #1)")
  cleaned = cleaned.replace(/\s*\([^)]*#\d+[^)]*\)$/, "");

  // Remove any remaining parenthetical info at the end
  cleaned = cleaned.replace(/\s*\([^)]*\)$/, "");

  // Remove subtitle (everything after colon)
  cleaned = cleaned.split(":")[0];

  // Remove extra whitespace
  cleaned = cleaned.trim();

  return cleaned;
}

async function getReadingFromGoodreads(): Promise<Book[]> {
  const parser = new Parser({
    customFields: {
      item: [
        ["book_id", "bookId"],
        ["book_large_image_url", "bookLargeImageUrl"],
        ["author_name", "authorName"],
      ],
    },
  });

  const goodreadsUserId = process.env.GOODREADS_USER_ID;
  if (!goodreadsUserId) {
    console.error("GOODREADS_USER_ID environment variable not set");
    return [];
  }

  const rssUrl = `https://www.goodreads.com/review/list_rss/${goodreadsUserId}?shelf=currently-reading`;

  try {
    const feed = await parser.parseURL(rssUrl);

    if (!feed.items || feed.items.length === 0) return [];

    const books = feed.items.map((item: any) => ({
      title: cleanGoodreadsTitle(item.title || ""),
      author: item.authorName || "",
      url: `https://www.goodreads.com/book/show/${item.bookId}`,
      coverUrl: item.bookLargeImageUrl || "",
      readingDate: item.pubDate || null,
      fallbackColors: null,
    }));

    return books;
  } catch (error) {
    console.error("Error fetching Goodreads RSS feed:", error);
    return [];
  }
}
