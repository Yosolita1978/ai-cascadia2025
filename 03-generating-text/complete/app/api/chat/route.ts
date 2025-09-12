import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // TODO: Session 2 - Implement streaming chat
    // Hint: Use streamText with convertToModelMessages
    
    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: `You are DevMate, an AI programming assistant. You help developers with:
- Code review and suggestions
- Debugging and troubleshooting
- Best practices and architecture
- Learning new technologies

Be helpful, concise, and provide practical examples when appropriate.`,
      messages: convertToModelMessages(messages),
      maxTokens: 1000,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat error:', error);
    return Response.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}