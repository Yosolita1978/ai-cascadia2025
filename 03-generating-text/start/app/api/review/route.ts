import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextRequest } from 'next/server';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    const result = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `Please review this ${language} code and provide feedback on:
- Code quality and best practices
- Potential bugs or issues
- Performance considerations
- Readability and maintainability
- Security concerns (if any)

Code to review:
\`\`\`${language}
${code}
\`\`\`

Provide constructive feedback in a clear, organized format.`,
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