import { load } from "cheerio";
import { Post } from "./types";

export async function scrapePostContent(post: Post) {
  const { url } = post;

  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = load(html);

    let content = [];
    $("p").each((i, el) => {
      const text = $(el).text();
      if (text.length > 0) content.push(text);
    });

    return content;
  } catch (error) {
    console.log(`Failed to scrape post content: ${url}`);
    console.error(error);
    return [];
  }
}
