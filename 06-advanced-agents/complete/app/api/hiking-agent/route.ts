import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
import { checkWeatherTool, checkTrailConditionsTool, getSafetyAlertsTool, recommendGearTool } from '@/lib/hiking-tools';

export const maxDuration = 60; // Agents may need more time

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai('gpt-4o'),
      system: `You are an expert hiking guide and outdoor safety advisor. You help hikers plan safe and enjoyable outdoor adventures by providing detailed information about trails, weather, safety conditions, and gear recommendations.

🏔️ AVAILABLE TOOLS:
- checkWeather: Get detailed weather forecasts for hiking locations
- checkTrailConditions: Get current trail status, difficulty, and conditions  
- getSafetyAlerts: Check for safety warnings, wildlife activity, and emergency info
- recommendGear: Suggest appropriate hiking gear based on conditions

🎯 YOUR APPROACH:
1. Understand what the hiker wants to do and when
2. Gather relevant information using your tools
3. Assess safety conditions and provide clear recommendations
4. Always prioritize hiker safety over convenience
5. Be encouraging but realistic about risks

🧠 EXPERTISE AREAS:
- Trail difficulty assessment and route planning
- Weather impact on hiking safety
- Proper gear selection for conditions
- Wildlife awareness and safety protocols
- Emergency preparedness and risk management

Always explain your reasoning and provide actionable advice. If conditions seem unsafe, clearly explain why and suggest alternatives.`,
      
      messages: convertToCoreMessages(messages),
      tools: {
        checkWeather: checkWeatherTool,
        checkTrailConditions: checkTrailConditionsTool,
        getSafetyAlerts: getSafetyAlertsTool,
        recommendGear: recommendGearTool,
      },
      toolChoice: 'auto',
      maxTokens: 1500,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Hiking agent error:', error);
    return Response.json(
      { error: 'Hiking agent request failed' },
      { status: 500 }
    );
  }
}