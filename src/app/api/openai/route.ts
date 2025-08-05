// app/api/openai/route.ts
import { streamText } from "ai";

import { createOpenAI } from '@ai-sdk/openai';
import axios from "axios";

export const runtime = "edge";


async function webSearch(query: string) {
  try {
    const res = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
        cx: process.env.NEXT_PUBLIC_GOOGLE_CX,
        q: query,
        num: 3
      },
    });

    const results = res.data.items || [];

    return results
      .map((item: any) => `Title: ${item.title}\nURL: ${item.link}\nSnippet: ${item.snippet}`)
      .join("\n\n---\n\n") || "No results from Google.";
  } catch (err: any) {
    console.log('Search error', err.message)
    return "[Search failed]";
  }
}

async function fetchImageUrl(query: string): Promise<string | null> {
  try {
    const { data } = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
        cx: process.env.NEXT_PUBLIC_GOOGLE_CX,
        searchType: 'image',
        q: query,
        num: 1
      }
    });
    return data.items?.[0]?.link || null;
  } catch (err) {
    console.error('Image Search Error:', err);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const openai = createOpenAI({
      compatibility: 'strict', // strict mode, enable when using the OpenAI API
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
    });
    const { messages }: { messages: { role: string; content: string }[] } =
      await req.json();
    
    const seoMessages = [];
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].role === "user" || messages[i].role === "system") {
        const webResult = await webSearch(messages[i].content + " in RebelCars or other if so where");
        const imageUrl = await fetchImageUrl(messages[i].content + " in RebelCars cars or other if so where");
        seoMessages.push({
          role: messages[i].role as "system" | "user",
          content: messages[i].role === "user" ? `Answer the following question in detail. Use the search results provided. If relevant, include context, background info, and real-world examples. if there is a url or image link, it must be displayed. ${imageUrl && imageUrl?.length > 0 ? `here is the image link so you need to explain about it too. Link:${imageUrl}` : ``}.\n Output should be html tag format but don't include head or body tags.User asked: ${messages[i].content}\n\nHere’s what web search says:\n${webResult}\n\nIf available, include an image in the response.` : "You are a helpful assistant that answers using web search and includes relevant images.",
        })
      }
    }



    console.log('aaa => ', seoMessages)

    const result = await streamText({
      model: openai("gpt-4"),
      messages: [
        ...seoMessages
      ],
      temperature: 0.7,
    });

    // console.log('result => ', result)

    return  result.toDataStreamResponse();

    // const response = await openai.chat.completions.create({
    //   model: 'gpt-4',
    //   messages,
    //   temperature: 0.7
    // });

    // const reply = response.choices[0].message.content;
    // res.json({ reply, imageUrl });
  } catch (error) {
    console.error("Error in OpenAI API route:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process the request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}