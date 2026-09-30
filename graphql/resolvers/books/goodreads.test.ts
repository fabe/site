import assert from "node:assert/strict";
import { test } from "node:test";
import { getCache } from "@vercel/functions";
import Parser from "rss-parser";
import { getReadingFromGoodreads } from "./goodreads";

const bookXml = `<?xml version="1.0"?>
<rss version="2.0"><channel><title>Reading</title><item>
  <title>Example: A Subtitle</title>
  <book_id>123</book_id>
  <author_name>Author</author_name>
  <book_large_image_url>https://example.com/cover.jpg</book_large_image_url>
</item></channel></rss>`;
const emptyXml = `<?xml version="1.0"?>
<rss version="2.0"><channel><title>Reading</title></channel></rss>`;

function useGoodreadsUser(id: string) {
  const previous = process.env.GOODREADS_USER_ID;
  process.env.GOODREADS_USER_ID = id;
  return () => {
    if (previous === undefined) delete process.env.GOODREADS_USER_ID;
    else process.env.GOODREADS_USER_ID = previous;
  };
}

test("caches Goodreads books across sequential requests", async (t) => {
  const restore = useGoodreadsUser("cache-test-books");
  t.after(restore);
  let calls = 0;
  t.mock.method(Parser.prototype, "parseURL", async function () {
    calls++;
    return this.parseString(bookXml);
  });

  const first = await getReadingFromGoodreads();
  const second = await getReadingFromGoodreads();
  assert.equal(calls, 1);
  assert.deepEqual(second, first);
  assert.equal(first[0]?.title, "Example");
  assert.equal(first[0]?.author, "Author");
});

test("refreshes the Goodreads feed after five minutes", async (t) => {
  const restore = useGoodreadsUser("cache-test-expiry");
  t.after(restore);
  const start = Date.now();
  let elapsed = 0;
  t.mock.method(Date, "now", () => start + elapsed);
  let calls = 0;
  t.mock.method(Parser.prototype, "parseURL", async function () {
    calls++;
    return this.parseString(bookXml);
  });

  await getReadingFromGoodreads();
  elapsed = 299_000;
  await getReadingFromGoodreads();
  assert.equal(calls, 1);

  elapsed = 301_000;
  await getReadingFromGoodreads();
  assert.equal(calls, 2);
});

test("caches an empty Goodreads shelf", async (t) => {
  const restore = useGoodreadsUser("cache-test-empty");
  t.after(restore);
  let calls = 0;
  t.mock.method(Parser.prototype, "parseURL", async function () {
    calls++;
    return this.parseString(emptyXml);
  });

  assert.deepEqual(await getReadingFromGoodreads(), []);
  assert.deepEqual(await getReadingFromGoodreads(), []);
  assert.equal(calls, 1);
});

test("does not cache Goodreads fetch failures", async (t) => {
  const restore = useGoodreadsUser("cache-test-error");
  t.after(restore);
  t.mock.method(console, "error", () => {});
  let calls = 0;
  t.mock.method(Parser.prototype, "parseURL", async function () {
    if (++calls === 1) throw new Error("upstream unavailable");
    return this.parseString(bookXml);
  });

  assert.deepEqual(await getReadingFromGoodreads(), []);
  assert.equal((await getReadingFromGoodreads()).length, 1);
  assert.equal(calls, 2);
});

test("shares a refresh among concurrent requests", async (t) => {
  const restore = useGoodreadsUser("cache-test-concurrent");
  t.after(restore);
  let calls = 0;
  t.mock.method(Parser.prototype, "parseURL", async function () {
    calls++;
    return this.parseString(bookXml);
  });

  const [first, second] = await Promise.all([
    getReadingFromGoodreads(),
    getReadingFromGoodreads(),
  ]);
  assert.equal(calls, 1);
  assert.deepEqual(first, second);
});

test("ignores invalid cache entries and refreshes Goodreads", async (t) => {
  const id = "cache-test-invalid";
  const restore = useGoodreadsUser(id);
  t.after(restore);
  const url = `https://www.goodreads.com/review/list_rss/${id}?shelf=currently-reading`;
  await getCache({ namespace: "goodreads" }).set(
    url,
    { invalid: true },
    { ttl: 300 },
  );
  t.mock.method(console, "error", () => {});
  let calls = 0;
  t.mock.method(Parser.prototype, "parseURL", async function () {
    calls++;
    return this.parseString(bookXml);
  });

  assert.equal((await getReadingFromGoodreads()).length, 1);
  assert.equal(calls, 1);
});
