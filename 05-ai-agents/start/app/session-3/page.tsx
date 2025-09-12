'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Session3() {
  // TODO: Implement useChat hook
  // const { messages, input, handleInputChange, handleSubmit, isLoading, error, stop } = useChat({
  //   api: '/api/hiking-agent',
  // });
  
  const quickActions = [
    "Should I hike Angels Landing tomorrow?",
    "I'm a beginner - recommend something easy near Yosemite this weekend",
    "Planning Half Dome next Saturday - is it safe with current conditions?",
    "What gear do I need for a hard day hike in rainy weather?"
  ];

  const handleQuickAction = (action: string) => {
    // TODO: Implement quick action handler
    console.log('Quick action:', action);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🏔️ Session 3: Hiking Concierge Agent</h1>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow h-96 overflow-y-auto p-4 mb-4">
            <div className="text-gray-500 text-center py-8">
              🏔️ <strong>Hiking Guide</strong> ready to help!<br/>
              I can check weather, trail conditions, safety alerts, and recommend gear.
              <br/><br/>
              <em>TODO: Implement chat functionality</em>
            </div>
            
            {/* TODO: Add message display logic */}
            
            {/* TODO: Add loading indicator */}
          </div>

          {/* TODO: Add error display */}

          <form className="flex gap-2">
            <input
              placeholder="Ask about hiking conditions, trail recommendations, gear advice..."
              disabled={true}
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
            />
            <button
              type="submit"
              disabled={true}
              className="bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed"
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
                  className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">🏔️ Session 3 Goals</h3>
            <ul className="text-blue-700 text-sm mt-2 space-y-1">
              <li>• Understanding agent vs. chatbot</li>
              <li>• Tool calling and selection</li>
              <li>• Multi-step reasoning</li>
              <li>• Real-world tool integration</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800">📝 Workshop Tasks</h3>
            <ul className="text-yellow-700 text-sm mt-2 space-y-1">
              <li>• Create hiking tool functions</li>
              <li>• Set up agent API endpoint</li>
              <li>• Connect useChat hook</li>
              <li>• Test tool calling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}