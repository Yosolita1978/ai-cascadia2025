"use client";
import { useState } from "react";
import { UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIDataTypes, UIMessagePart, UITools } from "ai";

export default function Home() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  const isLoading = status === 'streaming';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setError(null);
    
    try {
      await sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] });
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-lg font-medium text-white">Hiking Assistant</h1>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Start a conversation</h3>
              <p className="text-gray-400">Ask me anything about hiking, trails, or outdoor adventures.</p>
            </div>
          )}
          
          <div className="space-y-6">
            {messages.map((message: UIMessage) => (
              <div key={message.id} className="group">
                <div className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 border border-gray-700'
                  }`}>
                    {message.role === 'user' ? 'U' : 'AI'}
                  </div>
                  
                  {/* Message Content */}
                  <div className={`flex-1 min-w-0 ${message.role === 'user' ? 'max-w-[80%]' : 'max-w-[85%]'}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-900 text-gray-100 border border-gray-800'
                    }`}>
                      <div className="prose prose-sm max-w-none space-y-2">
                        {message.parts.map((part: UIMessagePart<UIDataTypes, UITools>, index: number) => {
                          if (part.type === 'text') {
                            return (
                              <span key={index} className="leading-relaxed block">
                                {part.text as string}
                              </span>
                            );
                          }
                          
                          // Handle step-start
                          if (part.type === 'step-start') {
                            return (
                              <div key={index} className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-3 my-2">
                                <div className="flex items-center text-blue-400 text-sm font-medium">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  Starting tool execution...
                                </div>
                              </div>
                            );
                          }
                          
                          // Handle tool calls (tool-getWeather, tool-getGearRecommendations, etc.)
                          if (part.type.startsWith('tool-')) {
                            const toolName = part.type.replace('tool-', '');
                            return (
                              <div key={index} className="bg-green-900/20 border border-green-800/50 rounded-lg p-3 my-2">
                                <div className="flex items-center text-green-400 text-sm font-medium mb-2">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {toolName} Result
                                </div>
                                <div className="text-gray-100 whitespace-pre-line font-mono text-sm">
                                  {(part as { output?: any; text?: string }).output?.toString() || 
                                   (part as { output?: any; text?: string }).text as string || 
                                   'Tool executed'}
                                </div>
                              </div>
                            );
                          }
                          
                          // Handle traditional tool-call and tool-result (fallback)
                          if (part.type === 'tool-call') {
                            return (
                              <div key={index} className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-3 my-2">
                                <div className="flex items-center text-blue-400 text-sm font-medium mb-1">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  Using tool: {(part as any).toolName || 'Unknown'}
                                </div>
                                <div className="text-gray-300 text-sm font-mono">
                                  {JSON.stringify((part as any).args || {}, null, 2)}
                                </div>
                              </div>
                            );
                          }
                          
                          if (part.type === 'tool-result') {
                            return (
                              <div key={index} className="bg-green-900/20 border border-green-800/50 rounded-lg p-3 my-2">
                                <div className="flex items-center text-green-400 text-sm font-medium mb-2">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Tool Result
                                </div>
                                <div className="text-gray-100 whitespace-pre-line font-mono text-sm">
                                  {(part as any).result || 'No result'}
                                </div>
                              </div>
                            );
                          }
                          
                          // Debug: Show unknown part types (you can remove this later)
                          console.log('Unknown part:', part);
                          return (
                            <div key={index} className="text-gray-400 text-sm bg-gray-800/20 p-2 rounded">
                              Unknown part type: {part.type}
                              {(part as any).text && <div className="mt-1 text-xs">{(part as any).text}</div>}
                              {(part as any).result && <div className="mt-1 text-xs">{(part as any).result}</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="group">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 text-gray-300 border border-gray-700 flex items-center justify-center text-xs font-medium">
                    AI
                  </div>
                  <div className="flex-1 min-w-0 max-w-[85%]">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-gray-400">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-400">Error</h4>
                  <p className="text-sm text-red-300 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="border-t border-gray-800 bg-black/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <form onSubmit={handleSubmit}>
            <div className="relative flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about hiking trails, gear, or outdoor tips..."
                  disabled={isLoading}
                  rows={1}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  style={{
                    minHeight: '52px',
                    maxHeight: '200px',
                    resize: 'none',
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                    }
                  }}
                  maxLength={1000}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl transition-all duration-200 group"
              >
                {isLoading ? (
                  <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg 
                    className="w-5 h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            
            <div className="flex justify-between items-center mt-3 px-1">
              <div className="text-xs text-gray-500">
                Press Enter to send, Shift+Enter for new line
              </div>
              <div className="text-xs text-gray-500">
                {input.length}/1000
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}