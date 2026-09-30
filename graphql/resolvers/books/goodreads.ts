import { getCache } from "@vercel/functions";
import Parser from "rss-parser";
import { proxiedImageUrl } from "../../../lib/imageProxy";
import type { Book } from "../../types/types.generated";

const GOODREADS_CACHE_TTL = 5 * 60;
const goodreadsRequests = new Map<string, Promise<Book[]>>();

type GoodreadsItem = {
  title?: string;
  authorName?: string;
  bookId?: string;
  bookLargeImageUrl?: string;
  pubDate?: string;
};

function cleanGoodreadsTitle(title: string): string {
  if (!title) return title;

  let cleaned = title;
  cleaned = cleaned.replace(/\s*\([^)]*#\d+[^)]*\)$/, "");
  cleaned = cleaned.replace(/\s*\([^)]*\)$/, "");
  cleaned = cleaned.split(":")[0];
  return cleaned.trim();
}

export async function getReadingFromGoodreads(): Promise<Book[]> {
  const goodreadsUserId = process.env.GOODREADS_USER_ID;
  if (!goodreadsUserId) {
    console.error("GOODREADS_USER_ID environment variable not set");
    return [];
  }

  const rssUrl = `https://www.goodreads.com/review/list_rss/${goodreadsUserId}?shelf=currently-reading`;
  const pending = goodreadsRequests.get(rssUrl);
  if (pending) return pending;

  const request = fetchGoodreadsBooks(rssUrl);
  goodreadsRequests.set(rssUrl, request);
  try {
    return await request;
  } finally {
    goodreadsRequests.delete(rssUrl);
  }
}

async function fetchGoodreadsBooks(rssUrl: string): Promise<Book[]> {
  const cache = getCache({ namespace: "goodreads" });
  try {
    const cached = await cache.get(rssUrl);
    if (isCachedGoodreadsBooks(cached)) return cached;
    if (cached != null) console.error("Invalid Goodreads cache entry");
  } catch (error) {
    console.error("Error reading Goodreads cache:", error);
  }

  const parser = new Parser({
    customFields: {
      item: [
        ["book_id", "bookId"],
        ["book_large_image_url", "bookLargeImageUrl"],
        ["author_name", "authorName"],
      ],
    },
  });

  try {
    const feed = await parser.parseURL(rssUrl);
    const books: Book[] = (feed.items || []).map((item: GoodreadsItem) => ({
      title: cleanGoodreadsTitle(item.title || ""),
      author: item.authorName || "",
      url: `https://www.goodreads.com/book/show/${item.bookId}`,
      coverUrl: proxiedImageUrl(item.bookLargeImageUrl || ""),
      readingDate: item.pubDate || null,
      fallbackColors: null,
    }));

    try {
      await cache.set(rssUrl, books, { ttl: GOODREADS_CACHE_TTL });
    } catch (error) {
      console.error("Error writing Goodreads cache:", error);
    }

    return books;
  } catch (error) {
    console.error("Error fetching Goodreads RSS feed:", error);
    return [];
  }
}

function isCachedGoodreadsBooks(value: unknown): value is Book[] {
  return (
    Array.isArray(value) &&
    value.every(
      (book) =>
        book !== null &&
        typeof book === "object" &&
        typeof book.title === "string" &&
        typeof book.author === "string" &&
        typeof book.url === "string" &&
        (book.coverUrl == null || typeof book.coverUrl === "string") &&
        (book.readingDate == null || typeof book.readingDate === "string") &&
        (book.fallbackColors == null ||
          (Array.isArray(book.fallbackColors) &&
            book.fallbackColors.every(
              (color: unknown) => color == null || typeof color === "string",
            ))),
    )
  );
}
