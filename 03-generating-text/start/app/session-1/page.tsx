'use client';

import { useState } from 'react';

export default function Session1() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState('');
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');
    setReview('');

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to review code');
      }

      setReview(data.review);
      setUsage(data.usage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Session 1: AI Code Reviewer</h1>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Side */}
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="typescript">TypeScript</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Code to Review</label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 p-3 font-mono text-sm border rounded-lg"
                placeholder="Paste your code here for AI review..."
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Reviewing...' : 'Review Code'}
            </button>
          </form>
        </div>

        {/* Results Side */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">AI Review</h2>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {loading && (
            <div className="text-gray-500 italic">
              🤖 AI is reviewing your code...
            </div>
          )}
          
          {review && (
            <>
              <div className="bg-gray-50 p-4 rounded-lg mb-4 whitespace-pre-wrap">
                {review}
              </div>
              
              {usage && (
                <div className="text-xs text-gray-500 border-t pt-2">
                  <strong>Token Usage:</strong> {usage.totalTokens} total 
                  ({usage.promptTokens} prompt + {usage.completionTokens} completion)
                </div>
              )}
            </>
          )}
          
          {!loading && !review && !error && (
            <div className="text-gray-400 italic">
              Enter code above and click "Review Code" to get AI feedback.
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800">Learning Goals</h3>
        <ul className="text-blue-700 text-sm mt-2 space-y-1">
          <li>• Understand generateText() basics</li>
          <li>• Practice prompt engineering</li>
          <li>• Handle API errors gracefully</li>
          <li>• Monitor token usage and costs</li>
        </ul>
      </div>
    </div>
  );
}