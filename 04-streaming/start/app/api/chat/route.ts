import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText, type Message } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: `You are DevMate, an AI programming assistant. You help developers with:
- Code review and suggestions
- Debugging and troubleshooting
- Best practices and architecture
- Learning new technologies

Be helpful, concise, and provide practical examples when appropriate.`,
      messages: convertToCoreMessages(messages),
      maxTokens: 1000,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat error:', error);
    return Response.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}