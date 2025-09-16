import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const response = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Write a short story about a cat',
});

console.log(response.text); 