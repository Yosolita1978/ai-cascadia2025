import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextRequest } from 'next/server';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    // TODO: Session 1 - Implement code review using AI SDK
    // 1. Use generateText from 'ai' package
    // 2. Use openai('gpt-4o-mini') as the model
    // 3. Create a prompt that asks the AI to review the code
    // 4. Include the code and language in your prompt
    // 5. Set maxTokens to 500
    // 6. Return the result with review text and usage stats
    
    // HINT: The structure should be:
    // const result = await generateText({
    //   model: openai('gpt-4o-mini'),
    //   prompt: `Your prompt here with ${language} and ${code}`,
    //   maxTokens: 500,
    // });
    
    // PLACEHOLDER - Replace this with actual AI call
    return Response.json({
      review: "TODO: Implement AI code review using generateText()",
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
    });
  } catch (error) {
    console.error('Code review error:', error);
    return Response.json(
      { error: 'Failed to review code' },
      { status: 500 }
    );
  }
}