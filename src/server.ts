import * as dotenv from "dotenv";
dotenv.config();

import { Post } from "./types";
import { handleNewPost } from "./firebaseHandler";
import { getPost, getPosts } from "./hackernewsHandler";
import { summarizePosts, summarizeSummaries } from "./openaiHandler";
import { scrapePostContent } from "./contentScraper";

const NUM_POSTS_TO_PROCESS = 10;

getPosts().then((posts: any) => {
  posts.slice(0, NUM_POSTS_TO_PROCESS).forEach((postId: number) => {
    getPost(postId).then(async (post) => {
      const { id, type, by, time, text, url, score, title } = post;
      // TODO: only accept stories for now
      if (type !== "story") return;

      // Parse post
      const postParsed: Post = {
        id,
        type,
        by: by || "unknown",
        time: time * 1000,
        text: text || "",
        url: url || "",
        score: score || 0,
        title: title || "",
        createdAt: new Date().getTime(),
        summary: "",
      };

      // Get the content of the post URL (usually a website, or blog post)
      const scrapedContent = await scrapePostContent(postParsed);

      // Summarize the content
      const summaries = await summarizePosts(scrapedContent);
      //   const summary = await summarizeSummaries(summaries);
      //   postParsed.summary = summary;
      postParsed.summary = summaries.join("\n\n");

      //   Upload post with summary to Firebase
      const uploaded = await handleNewPost(postParsed);
      uploaded
        ? console.log(`Uploaded post ${id}`)
        : console.log(`Failed to upload post ${id}`);
    });
  });
});
