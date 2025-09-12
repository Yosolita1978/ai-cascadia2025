# AI SDK v5 Cheat Sheet

Quick reference for the most important patterns and functions.

## Core Functions

### generateText
```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const result = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: 'Your prompt here',
  system: 'You are a helpful assistant',
  maxTokens: 500,
});

console.log(result.text);
console.log(result.usage); // Token usage
```

### streamText
```ts
import { streamText, convertToModelMessages } from 'ai';

const result = streamText({
  model: openai('gpt-4o-mini'),
  messages: convertToModelMessages(messages),
  system: 'You are helpful',
  maxTokens: 1000,
});

return result.toUIMessageStreamResponse();
```

### generateObject
```ts
import { generateObject } from 'ai';
import { z } from 'zod';

const result = await generateObject({
  model: openai('gpt-4o-mini'),
  prompt: 'Generate a user profile',
  schema: z.object({
    name: z.string(),
    age: z.number(),
    skills: z.array(z.string()),
  }),
});

console.log(result.object); // Typed object
```

## UI Hooks

### useChat
```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const { messages, sendMessage, status, error, stop } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    headers: { Authorization: 'Bearer token' },
    body: { temperature: 0.7 },
  }),
});

// Send message
sendMessage({ text: 'Hello' });

// Render messages
{messages.map(message => (
  <div key={message.id}>
    {message.parts.map((part, index) =>
      part.type === 'text' ? (
        <span key={index}>{part.text}</span>
      ) : null
    )}
  </div>
))}
```

### useCompletion
```tsx
import { useCompletion } from '@ai-sdk/react';

const { completion, complete, isLoading } = useCompletion({
  api: '/api/completion',
});

// Trigger completion
complete('Complete this: The weather today is...');
```

### useObject
```tsx
import { useObject } from '@ai-sdk/react';

const { object, submit, isLoading } = useObject({
  api: '/api/generate-object',
  schema: yourZodSchema,
});

// Generate object
submit('Generate a user profile');
```

## Tools & Agents

### Define Tools
```ts
import { tool } from 'ai';
import { z } from 'zod';

const weatherTool = tool({
  description: 'Get weather information',
  parameters: z.object({
    location: z.string().describe('City name'),
  }),
  execute: async ({ location }) => {
    // Your tool logic here
    return { temperature: 72, condition: 'sunny' };
  },
});
```

### Use Tools in Agents
```ts
const result = streamText({
  model: openai('gpt-4o'),
  tools: {
    weather: weatherTool,
    search: searchTool,
  },
  toolChoice: 'auto', // Let model decide when to use tools
  system: 'You are a helpful assistant with access to tools.',
  messages: convertToModelMessages(messages),
});
```

## Message Types

### Simple Messages
```ts
const messages = [
  { role: 'system', content: 'You are helpful' },
  { role: 'user', content: 'Hello' },
  { role: 'assistant', content: 'Hi there!' },
];
```

### Multi-modal Messages
```ts
const messages = [
  {
    role: 'user',
    content: [
      { type: 'text', text: 'Describe this image' },
      { type: 'image', image: buffer }, // Buffer, base64, or URL
      { type: 'file', file: pdfBuffer, mimeType: 'application/pdf' },
    ],
  },
];
```

## Provider Patterns

### Import Providers
```ts
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

// Use in functions
generateText({ model: openai('gpt-4o-mini') });
generateText({ model: anthropic('claude-3-5-sonnet-latest') });
generateText({ model: google('gemini-1.5-flash') });
```

### Provider Options
```ts
// Function level
generateText({
  model: openai('gpt-4o'),
  providerOptions: {
    openai: {
      reasoningEffort: 'low',
    },
  },
});

// Message level
const messages = [{
  role: 'user',
  content: 'Hello',
  providerOptions: {
    anthropic: { cacheControl: { type: 'ephemeral' } },
  },
}];
```

## Error Handling

### Basic Error Handling
```ts
try {
  const result = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: 'Hello',
  });
  return result.text;
} catch (error) {
  console.error('AI request failed:', error);
  return 'Sorry, something went wrong.';
}
```

### UI Error Handling
```tsx
const { messages, error, reload } = useChat();

{error && (
  <div className="error">
    Something went wrong.
    <button onClick={reload}>Retry</button>
  </div>
)}
```

## Status Management

### Chat Status
```tsx
const { status, stop, regenerate } = useChat();

// Status values: 'ready', 'submitted', 'streaming', 'error'

{status === 'streaming' && (
  <button onClick={stop}>Stop</button>
)}

{status === 'error' && (
  <button onClick={regenerate}>Regenerate</button>
)}
```

## Common Patterns

### API Route Template
```ts
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: convertToModelMessages(messages),
    system: 'You are helpful',
  });
  
  return result.toUIMessageStreamResponse();
}
```

### Chat Component Template
```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function Chat() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  const [input, setInput] = useState('');

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.parts.map(part => 
            part.type === 'text' && part.text
          )}
        </div>
      ))}
      
      <form onSubmit={e => {
        e.preventDefault();
        sendMessage({ text: input });
        setInput('');
      }}>
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={status !== 'ready'}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

## Model Selection Guide

### Speed vs Quality
- **Fastest**: `gpt-4o-mini`, `claude-3-5-haiku-latest`
- **Balanced**: `gpt-4o`, `claude-3-5-sonnet-latest` 
- **Best**: `gpt-5`, `claude-opus-4-latest` (when available)

### Cost Optimization
- Use `gpt-4o-mini` for development and testing
- Set `maxTokens` limits
- Use caching for repeated requests
- Consider prompt compression techniques
