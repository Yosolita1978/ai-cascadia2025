'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function Session2() {
  const { messages, sendMessage, status, error, stop, regenerate, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });
  
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status === 'ready') {
      sendMessage({ text: input });
      setInput('');
    }
  };

  const handleDelete = (messageId: string) => {
    setMessages(messages.filter(m => m.id !== messageId));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Session 2: DevMate Chat</h1>
      
      {/* Chat Messages */}
      <div className="bg-white rounded-lg shadow h-96 overflow-y-auto p-4 mb-4">
        {messages.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            👋 Hi! I'm DevMate, your AI programming assistant. How can I help you today?
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${
              message.role === 'user' ? 'chat-user' : 'chat-assistant'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {message.parts.map((part, index) => 
                  part.type === 'text' ? (
                    <span key={index}>{part.text}</span>
                  ) : null
                )}
              </div>
              
              <button
                onClick={() => handleDelete(message.id)}
                className="ml-2 text-gray-400 hover:text-red-500 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        
        {/* Status Indicators */}
        {status === 'submitted' && (
          <div className="status-indicator">🤖 DevMate is thinking...</div>
        )}
        
        {status === 'streaming' && (
          <div className="flex items-center gap-2">
            <div className="status-indicator">✨ DevMate is responding...</div>
            <button
              onClick={stop}
              className="text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
            >
              Stop
            </button>
          </div>
        )}
      </div>

      {/* Error Handling */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
          <div>Something went wrong. Please try again.</div>
          <button
            onClick={regenerate}
            className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
          >
            Retry Last Message
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask DevMate about coding, debugging, or best practices..."
          disabled={status !== 'ready'}
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={status !== 'ready' || !input.trim()}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </form>

      {/* Status Info */}
      <div className="mt-4 text-xs text-gray-500">
        Status: <span className="font-mono">{status}</span>
        {messages.length > 0 && (
          <span className="ml-4">Messages: {messages.length}</span>
        )}
      </div>

      {/* Learning Goals */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-semibold text-green-800">Session 2 Goals</h3>
        <ul className="text-green-700 text-sm mt-2 space-y-1">
          <li>• Master useChat hook patterns</li>
          <li>• Implement streaming responses</li>
          <li>• Handle status and error states</li>
          <li>• Build interactive chat features</li>
        </ul>
      </div>
    </div>
  );
}