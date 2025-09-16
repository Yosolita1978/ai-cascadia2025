//use the streamText function to handle a response from the openai api
import { convertToModelMessages, generateText, streamText, tool} from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export const weatherTool = tool({
    description: 'Get the weather for a given hiking location',
    inputSchema: z.object({
      location: z.string().describe("The location of the hiking trail"),
      date: z.string().describe("The date of the hiking trail"),
    }),
    execute: async ({ location, date }) => {
      console.log('Weather tool called with:', { location, date });
      
      try {
        const result = await generateText({
          model: openai('gpt-4o'),
          prompt: `What would be realistic weather conditions for hiking at ${location} on ${date}? Include temperature range, conditions, precipitation chance, wind speed, visibility, UV index, and a hiking recommendation. Format it clearly for a hiker.`,
        });
        
        console.log('Weather tool returning:', result.text);
        return result.text;
      } catch (error) {
        console.error('Error calling OpenAI:', error);
        return `Unable to get weather data for ${location} on ${date}. Please check conditions locally before hiking.`;
      }
    },
  });

export const gearTool = tool({
  description: 'Recommend hiking gear based on weather conditions and trip details',
  inputSchema: z.object({
    temperature_high: z.number().describe("High temperature in Fahrenheit"),
    temperature_low: z.number().describe("Low temperature in Fahrenheit"),
    conditions: z.string().describe("Weather conditions (sunny, rainy, snowy, cloudy, etc.)"),
    precipitation_chance: z.number().describe("Chance of precipitation as decimal (0.0 to 1.0)"),
    wind_speed: z.number().describe("Wind speed in mph"),
    uv_index: z.number().describe("UV index"),
    hike_duration: z.string().describe("Duration of hike (day hike, overnight, multi-day)"),
    season: z.string().describe("Season (spring, summer, fall, winter)"),
  }),
  execute: async ({ temperature_high, temperature_low, conditions, precipitation_chance, wind_speed, uv_index, hike_duration, season }) => {
    console.log('Gear tool called with:', { temperature_high, temperature_low, conditions, precipitation_chance, wind_speed, uv_index, hike_duration, season });
    
    // Generate gear recommendations based on conditions
    const gearRecommendations = {
      clothing: [] as string[],
      safety: [] as string[],
      protection: [] as string[],
      navigation: [] as string[],
      hydration: [] as string[],
      special: [] as string[]
    };

    // Clothing recommendations based on temperature
    if (temperature_low < 32) {
      gearRecommendations.clothing.push("Insulated jacket", "Thermal base layers", "Insulated pants", "Winter hiking boots", "Warm hat and gloves");
    } else if (temperature_low < 50) {
      gearRecommendations.clothing.push("Fleece or insulating layer", "Long-sleeve base layer", "Hiking pants", "Warm hat");
    } else if (temperature_high > 80) {
      gearRecommendations.clothing.push("Lightweight, breathable shirt", "Hiking shorts", "Sun hat", "Lightweight hiking shoes");
    } else {
      gearRecommendations.clothing.push("Moisture-wicking shirt", "Hiking pants or shorts", "Light jacket for layering");
    }

    // Weather-specific gear
    if (conditions.includes("rain") || precipitation_chance > 0.3) {
      gearRecommendations.protection.push("Waterproof rain jacket", "Rain pants", "Pack cover", "Waterproof stuff sacks");
    }
    
    if (conditions.includes("snow")) {
      gearRecommendations.special.push("Microspikes or crampons", "Gaiters", "Snow shovel (if backcountry)", "Avalanche safety gear (if applicable)");
    }

    if (wind_speed > 15) {
      gearRecommendations.protection.push("Windproof jacket", "Wind-resistant outer layer");
    }

    if (uv_index > 6) {
      gearRecommendations.protection.push("Sunglasses", "Sunscreen (SPF 30+)", "Wide-brimmed hat", "UV-protective clothing");
    }

    // Duration-specific gear
    if (hike_duration === "overnight" || hike_duration === "multi-day") {
      gearRecommendations.special.push("Backpacking tent", "Sleeping bag", "Sleeping pad", "Cooking system", "Food storage");
    }

    // Essential safety gear
    gearRecommendations.safety.push("First aid kit", "Emergency whistle", "Headlamp with extra batteries", "Emergency shelter");
    gearRecommendations.navigation.push("Map and compass", "GPS device or smartphone with offline maps");
    gearRecommendations.hydration.push("Water bottles or hydration system", "Water purification method");

    const formatGearList = (category: string, items: string[]) => {
      if (items.length === 0) return "";
      return `\n${category.toUpperCase()}:\n${items.map(item => `  • ${item}`).join('\n')}`;
    };

    const result = `Gear recommendations for ${conditions} conditions (${temperature_low}°F - ${temperature_high}°F):
${formatGearList("Clothing", gearRecommendations.clothing)}
${formatGearList("Weather Protection", gearRecommendations.protection)}
${formatGearList("Safety Equipment", gearRecommendations.safety)}
${formatGearList("Navigation", gearRecommendations.navigation)}
${formatGearList("Hydration & Nutrition", gearRecommendations.hydration)}
${formatGearList("Special Conditions", gearRecommendations.special)}

💡 Pro Tips:
- Layer clothing for temperature regulation
- Check gear condition before departure
- Pack 10% extra food and water
- Inform someone of your hiking plans
- Check current trail conditions and closures`;

    console.log('Gear tool returning gear recommendations');
    return Promise.resolve(result);
  },
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log('Received messages:', messages?.length || 0, 'messages');
    
    const result = streamText({
      model: openai('gpt-4o'),
      system: `You are an expert hiking and outdoor adventure assistant with extensive knowledge of trails, gear, safety, and outdoor recreation. Your mission is to help users plan safe, enjoyable, and memorable hiking experiences.

## Available Tools - USE THEM ACTIVELY:
You have access to these tools and should USE THEM when relevant:
- getWeather: ALWAYS use this when users ask about weather, conditions, or mention a specific location and date
- getGearRecommendations: ALWAYS use this when users ask about gear, equipment, or what to bring

## When to Use Tools:
- If user mentions a location and date → use getWeather immediately
- If user asks "what should I bring", "what gear", or "what to pack" → use getGearRecommendations
- If user asks about weather conditions → use getWeather
- For comprehensive trip planning → use BOTH tools
- If user asks about hiking preparation → use both tools

## Core Expertise Areas:
- Trail recommendations and route planning for all skill levels
- Hiking gear selection and recommendations (use gearTool for this!)
- Weather assessment and seasonal considerations (use weatherTool for this!)
- Safety protocols and emergency preparedness
- Physical fitness and training advice
- Leave No Trace principles and environmental ethics
- Permit requirements and regulations
- Photography and wildlife observation tips

## Safety-First Approach:
Always prioritize safety in your recommendations. When discussing potentially dangerous activities:
- Emphasize proper preparation and risk assessment
- Recommend appropriate gear and emergency supplies
- Suggest starting with easier trails for beginners
- Advise checking weather conditions and trail status
- Encourage hiking with others when appropriate
- Mention when professional guides or training may be needed

## Response Style:
- Be enthusiastic but practical
- Provide specific, actionable advice
- Include relevant details about difficulty levels, distances, and time requirements
- Ask clarifying questions when needed (experience level, location, goals)
- Suggest alternatives when plans seem unsafe or unrealistic
- Use a friendly, encouraging tone that builds confidence
- ALWAYS use available tools when questions relate to weather or gear

## Key Considerations:
- Always ask about the user's experience level and fitness
- Consider seasonal conditions and weather patterns
- Recommend checking current trail conditions and closures
- Emphasize the importance of telling someone about hiking plans
- Suggest appropriate gear based on trip length and conditions
- Promote environmental stewardship and responsible hiking

Remember: When in doubt about safety, err on the side of caution and recommend consulting local rangers, guides, or experienced hikers. USE YOUR TOOLS - they provide valuable specific information!`,
      messages: convertToModelMessages(messages),
      tools: {
        getWeather: weatherTool,
        getGearRecommendations: gearTool,
      },

    });
    
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}