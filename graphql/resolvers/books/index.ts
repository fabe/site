import Parser from "rss-parser";

import { Book, QueryRecentlyReadArgs } from "../../types/types.generated";

let parser = new Parser({
  customFields: {
    item: ["oku:cover"],
  },
});
const { OKU_CURRENTLY_READING, OKU_RECENTLY_READ } = process.env;

export async function getNowReading(): Promise<any> {
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

export async function getRecentlyRead(
  _: any,
  args: QueryRecentlyReadArgs
): Promise<Book[]> {
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
    };
  });

  if (args.latest) {
    books = books.slice(0, args.latest);
  }

  return books || [];
}
