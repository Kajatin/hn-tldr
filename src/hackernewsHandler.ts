import fetch from "node-fetch";

const BASE_URL = "https://hacker-news.firebaseio.com/v0";

export async function getPosts() {
  const response = await fetch(`${BASE_URL}/topstories.json`);
  const posts = await response.json();
  return posts;
}

export async function getPost(postId: number) {
  const response = await fetch(`${BASE_URL}/item/${postId}.json`);
  const post = await response.json();
  return post;
}
