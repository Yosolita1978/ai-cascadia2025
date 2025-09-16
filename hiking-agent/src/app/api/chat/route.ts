//use the streamText function to handle a response from the openai api
import { convertToModelMessages, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful hikingassistant that can help with hiking plans.',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}