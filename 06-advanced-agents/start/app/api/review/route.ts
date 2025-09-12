import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextRequest } from 'next/server';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    // TODO: Session 1 - Implement code review
    // Hint: Use generateText with openai('gpt-4o-mini')
    // Structure your prompt for code review
    
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `Review this ${language} code and provide helpful feedback:

${code}

Focus on:
1. Bugs or potential issues
2. Performance improvements
3. Code style and best practices
4. Security considerations

Provide specific, actionable suggestions.`,
      maxTokens: 500,
    });

    return Response.json({
      review: result.text,
      usage: {
        promptTokens: result.usage.promptTokens,
        completionTokens: result.usage.completionTokens,
        totalTokens: result.usage.totalTokens,
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