import Parser from 'rss-parser';
let parser = new Parser();

const { OKU_CURRENTLY_READING } = process.env;

export async function getNowReading(): Promise<any> {
  if (!OKU_CURRENTLY_READING) {
    return [];
  }

  const currentlyReading = await parser.parseURL(OKU_CURRENTLY_READING);
  const books = currentlyReading.items.map((book) => {
    return {
      title: book.title,
      author: book.creator,
      startedReadingDate: book.pubDate,
      okuUrl: book.link,
    };
  });

  return books;
}
