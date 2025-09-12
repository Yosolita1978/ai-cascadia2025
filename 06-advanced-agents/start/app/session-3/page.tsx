'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Session3() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, stop } = useChat({
    api: '/api/hiking-agent',
  });
  
  const quickActions = [
    "Should I hike Angels Landing tomorrow?",
    "I'm a beginner - recommend something easy near Yosemite this weekend",
    "Planning Half Dome next Saturday - is it safe with current conditions?",
    "What gear do I need for a hard day hike in rainy weather?"
  ];

  const handleQuickAction = (action: string) => {
    if (!isLoading) {
      handleSubmit(undefined, { data: { message: action } });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🏔️ Session 3: Hiking Concierge Agent</h1>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow h-96 overflow-y-auto p-4 mb-4">
            {messages.length === 0 && (
              <div className="text-gray-500 text-center py-8">
                🏔️ <strong>Hiking Guide</strong> ready to help!<br/>
                I can check weather, trail conditions, safety alerts, and recommend gear.
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.role === 'user' 
                    ? 'text-right' 
                    : 'text-left'
                }`}
              >
                <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.toolInvocations?.map((toolInvocation) => {
                    const { toolName, args, result } = toolInvocation;
                    
                    return (
                      <div key={toolInvocation.toolCallId} className="mb-2">
                        {result ? (
                          <div className="bg-green-50 border border-green-200 rounded p-2 my-2">
                            <div className="text-green-800 font-semibold text-sm">
                              ✅ {toolName === 'checkWeather' && '🌤️ Weather Check'}
                              {toolName === 'checkTrailConditions' && '🥾 Trail Conditions'}
                              {toolName === 'getSafetyAlerts' && '⚠️ Safety Alerts'}
                              {toolName === 'recommendGear' && '🎒 Gear Recommendations'}
                            </div>
                            <div className="text-green-700 text-xs mt-1">
                              {toolName === 'checkWeather' && `${args.location} on ${args.date}`}
                              {toolName === 'checkTrailConditions' && `${args.trail_name}${args.park ? ` in ${args.park}` : ''}`}
                              {toolName === 'getSafetyAlerts' && `${args.location} area`}
                              {toolName === 'recommendGear' && `${args.difficulty} hike${args.duration ? ` (${args.duration})` : ''}`}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-blue-50 border border-blue-200 rounded p-2 my-2">
                            <div className="text-blue-800 font-semibold text-sm">
                              🔍 Checking {toolName}...
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="text-gray-500">🧠 Guide is thinking...</div>
                <button
                  onClick={stop}
                  className="text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
                >
                  Stop
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
              Guide encountered an error. Please try again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about hiking conditions, trail recommendations, gear advice..."
              disabled={isLoading}
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Ask Guide
            </button>
          </form>
        </div>

        {/* Tools & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-3">🔧 Available Tools</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-gray-50 rounded">
                <strong>🌤️ Weather:</strong> Detailed forecasts for hiking locations
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <strong>🥾 Trail Conditions:</strong> Current status and difficulty
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <strong>⚠️ Safety Alerts:</strong> Warnings and emergency info
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <strong>🎒 Gear Recommendations:</strong> Equipment for conditions
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-3">⚡ Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  disabled={isLoading}
                  className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">🏔️ Session 3 Goals</h3>
            <ul className="text-green-700 text-sm mt-2 space-y-1">
              <li>• Understanding agent vs. chatbot</li>
              <li>• Tool calling and selection</li>
              <li>• Multi-step reasoning</li>
              <li>• Real-world tool integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}