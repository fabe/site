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

const {
  LITERAL_EMAIL,
  LITERAL_PASSWORD,
  LITERAL_TOKEN,
  LITERAL_USER_ID,
  LITERAL_USER_HANDLE,
} = process.env;

const LITERAL_BASE_URL = "https://literal.club/graphql/";

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

export const literalClient = new ApolloClient({
  ssrMode: true,
  link: createHttpLink({
    uri: LITERAL_BASE_URL,
    credentials: "same-origin",
  }),
  cache: new InMemoryCache(),
});

const getLiteralToken = async (email: String, password: String) => {
  if (LITERAL_TOKEN) return LITERAL_TOKEN;

  const query = JSON.stringify({
    query: `
        mutation {
          login(email: "${LITERAL_EMAIL}", password: "${LITERAL_PASSWORD}") {
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
  const { limit } = args;
  let books = [];

  switch (args.collection) {
    case CollectionType.Reading:
      books = await getReading();
      break;
    default:
      books = await getReading();
      break;
  }

  if (books.length > limit) {
    books = books.slice(0, limit);
  }

  return books;
}

async function getReading(): Promise<Book[]> {
  const response = await literalClient.query({
    query: gql`
      query booksByReadingStateAndProfile($profileId: String!) {
        booksByReadingStateAndProfile(
          limit: 1
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
      profileId: LITERAL_USER_ID,
    },
  });

  const isReading = response.data.booksByReadingStateAndProfile[0];

  if (!isReading) return [];

  return [
    {
      title: isReading.title,
      author: isReading.authors
        .map((a) => {
          return a.name;
        })
        .join(", "),
      url: `https://literal.club/${LITERAL_USER_HANDLE}/book/${isReading.slug}`,
      coverUrl: isReading.cover,
      readingDate: isReading.publishedDate,
      fallbackColors: isReading.gradientColors,
    },
  ];
}
