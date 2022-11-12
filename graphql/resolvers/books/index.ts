import { gql } from "@apollo/client";
import Parser from "rss-parser";
import {
  Book,
  CollectionType,
  QueryBooksArgs,
} from "../../types/types.generated";
import { contentfulClient } from "../content";

const parser = new Parser({
  customFields: {
    item: ["oku:cover"],
  },
});

const { OKU_CURRENTLY_READING, OKU_RECENTLY_READ } = process.env;

export async function getBooks(_: any, args: QueryBooksArgs): Promise<Book[]> {
  const { limit } = args;
  let books = [];

  switch (args.collection) {
    case CollectionType.Favourites:
      books = await getFavourites(limit);
      break;
    case CollectionType.Reading:
      books = await getReading();
      break;
    default:
      books = await getRead();
      break;
  }

  if (books.length > limit) {
    books = books.slice(0, limit);
  }

  return books;
}

async function getReading(): Promise<Book[]> {
  if (!OKU_CURRENTLY_READING) {
    return [];
  }

  const currentlyReading = await parser.parseURL(OKU_CURRENTLY_READING);

  const books = currentlyReading.items.map((book): Book => {
    return {
      title: book.title!,
      author: book.creator!,
      readingDate: book.pubDate!,
      okuUrl: book.link!,
      coverUrl: book["oku:cover"] || null,
    };
  });

  return books;
}

async function getRead(): Promise<Book[]> {
  if (!OKU_RECENTLY_READ) {
    return [];
  }

  const recentlyRead = await parser.parseURL(OKU_RECENTLY_READ);
  let books = recentlyRead.items.map((book): Book => {
    return {
      title: book.title!,
      author: book.creator!,
      readingDate: book.pubDate,
      okuUrl: book.link!,
      coverUrl: book["oku:cover"] || null,
    };
  });

  return books || [];
}

async function getFavourites(limit = 10): Promise<Book[]> {
  const response = await contentfulClient.query({
    query: gql`
      query getAllFavouriteBooks($limit: Int) {
        bookCollection(limit: $limit) {
          items {
            title
            authors
            cover {
              url
            }
            okuUrl
          }
        }
      }
    `,
    variables: {
      limit,
    },
  });

  if (!response.data) {
    return [];
  }

  return response.data.bookCollection.items.map(
    (book: {
      title: string;
      cover?: { url: string };
      authors?: string[];
      okuUrl?: string;
      description?: string;
    }) => ({
      author: book.authors?.join(", "),
      title: book.title,
      coverUrl: book.cover?.url,
      okuUrl: book.okuUrl,
    })
  );
}
