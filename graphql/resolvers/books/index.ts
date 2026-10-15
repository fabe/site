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
import { proxiedImageUrl } from "../../../lib/imageProxy";
import { getReadingFromGoodreads } from "./goodreads";

const LITERAL_BASE_URL = "https://api.literal.club/";

type LiteralBook = {
  slug: string;
  title: string;
  publishedDate?: string | null;
  cover?: string | null;
  authors: Array<{ name: string }>;
  gradientColors?: Array<string | null> | null;
};

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

let _literalClient: ApolloClient | null = null;

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

export async function getBooks(
  _: unknown,
  args: QueryBooksArgs,
): Promise<Book[]> {
  const { limit, source } = args;
  let books: Book[] = [];

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

  if (limit != null && books.length > limit) {
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

  const isReading = response.data.booksByReadingStateAndProfile as
    | LiteralBook[]
    | undefined;

  if (!isReading) return [];

  const books = isReading.map((book) => ({
    title: book.title,
    author: book.authors
      .map((a) => {
        return a.name;
      })
      .join(", "),
    url: `https://literal.club/${process.env.LITERAL_USER_HANDLE}/book/${book.slug}`,
    coverUrl: proxiedImageUrl(book.cover),
    readingDate: book.publishedDate,
    fallbackColors: book.gradientColors,
  }));

  return books;
}
