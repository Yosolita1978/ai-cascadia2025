import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { analyzeCodeTool, searchDocumentationTool, runTestsTool, generateCodeTool } from '@/lib/tools';
import { getOrCreateSession, getContextSummary, rememberContext, rememberDecision } from '@/lib/agent-memory';

export const maxDuration = 90; // Advanced agents may need even more time

export async function POST(req: Request) {
  try {
    const { messages, sessionId }: { messages: UIMessage[], sessionId?: string } = await req.json();

    // TODO: Session 4 - Implement advanced agent with memory and complex reasoning
    
    // Initialize or get session
    const currentSession = getOrCreateSession(sessionId);
    const contextSummary = getContextSummary(currentSession);
    
    // Remember this interaction
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      rememberContext(currentSession, {
        userRequest: lastMessage.content,
        timestamp: new Date().toISOString()
      });
    }

    const result = streamText({
      model: openai('gpt-4o'), // Use most capable model for advanced reasoning
      system: `You are DevMate Advanced Agent, a sophisticated AI programming assistant with memory and advanced reasoning capabilities.

🧠 MEMORY CONTEXT:
${contextSummary}

🎯 ADVANCED CAPABILITIES:
- Multi-step reasoning and planning
- Context awareness across conversations  
- Error recovery and adaptive strategies
- Complex task orchestration
- Learning from previous interactions

🔧 AVAILABLE TOOLS:
- analyzeCode: Deep code analysis with multiple focus areas
- searchDocumentation: Comprehensive documentation search
- runTests: Execute and interpret test results
- generateCode: Create sophisticated code examples

🚀 ADVANCED REASONING PROCESS:
1. UNDERSTAND: Analyze the request in context of previous interactions
2. PLAN: Create a detailed step-by-step approach
3. EXECUTE: Use tools in optimal sequence, adapting as needed
4. SYNTHESIZE: Combine results into comprehensive insights
5. LEARN: Update understanding for future interactions

💡 KEY BEHAVIORS:
- Always explain your reasoning process
- Use context from previous interactions when relevant
- Adapt your approach based on what you learn from tool results
- If a tool fails, explain why and try alternative approaches
- Provide comprehensive, actionable recommendations
- Show confidence levels in your assessments

When handling complex requests:
- Break them into logical sub-tasks
- Execute tools in parallel when possible
- Cross-reference results from different tools
- Provide progress updates during long operations
- Summarize findings with clear next steps

Remember: You're not just using tools, you're orchestrating them intelligently to solve complex development challenges.`,
      
      messages: convertToModelMessages(messages),
      tools: {
        analyzeCode: analyzeCodeTool,
        searchDocumentation: searchDocumentationTool,  
        runTests: runTestsTool,
        generateCode: generateCodeTool,
      },
      toolChoice: 'auto',
      maxTokens: 2000, // More tokens for complex reasoning
      temperature: 0.1, // Lower temperature for more focused reasoning
    });

    // Note: In a real implementation, you'd stream the response and save decisions to memory
    // For this workshop, we're keeping it simple but showing the pattern

    return result.toUIMessageStreamResponse({
      headers: {
        'X-Session-ID': currentSession, // Return session ID for client
      }
    });
  } catch (error) {
    console.error('Advanced agent error:', error);
    return Response.json(
      { error: 'Advanced agent request failed' },
      { status: 500 }
    );
  }
}