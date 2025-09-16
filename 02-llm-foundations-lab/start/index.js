import dotenv from 'dotenv';
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function jobInterview(developerType = "React") {
  try {
    // Debug: Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "system",
        content: "You are a helpful assistant that generates technical interview questions for a developer in the style of Agatha Christie."
      },
        { 
          role: "user", 
          content: `Generate exactly 3 technical interview questions for a ${developerType} developer. Focus on practical skills, best practices, and real-world scenarios specific to ${developerType}. Format each question on a new line with a number.` 
        }
      ],
    });

    // Debug: Log full response structure
    console.log("Full response:", JSON.stringify(response, null, 2));

    // Check if response has expected structure
    if (!response.choices || !response.choices[0]) {
      throw new Error("Unexpected API response structure");
    }

    console.log(`\n=== ${developerType.toUpperCase()} DEVELOPER INTERVIEW QUESTIONS ===`);
    console.log(response.choices[0].message.content);

  } catch (error) {
    console.error("Error:", error.message);
    
    // If it's an API error, show more details
    if (error.response) {
      console.error("API Error Status:", error.response.status);
      console.error("API Error Data:", error.response.data);
    }
  }
}

// jobInterview("Python");
jobInterview("React");