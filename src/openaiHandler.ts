import { encode, decode } from "gpt-3-encoder";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function summarizePosts(content: string[]) {
  if (content.length === 0) {
    return null;
  }

  const encoded = encode(content.join("\n\n"));
  // TODO: start using number of tokens to determine max_tokens and to split up the content
  const numTokens = encoded.length;
  console.log(`Number of tokens: ${numTokens}`);

  const promises = content.map(async (paragraph) => {
    const prompt = `${paragraph.trim()}\n\nTl;dr`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 2048,
      temperature: 0.6,
    });

    return response.data.choices[0].text;
  });

  const summaries = await Promise.all(promises);
  return summaries;
}

export async function summarizeSummaries(summaries: string[]) {
  if (summaries.length === 0) {
    return null;
  }

  const summariesCombined = summaries.join("\n\n");
  const prompt = `${summariesCombined.trim()}\n\nTl;dr`;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 1,
  });

  return response.data.choices[0].text;
}

export default openai;
