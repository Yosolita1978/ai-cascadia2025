'use client';

import React from 'react';
import { useChat } from 'ai/react';

export default function Session2() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, stop } = useChat({
    api: '/api/chat',
  });

  return (
    <div className="chat-container">
      <div style={{ width: '100%', maxWidth: '1200px', zIndex: 10, position: 'relative' }}>
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="header-icon">🤖</div>
            <h1 className="header-title">DevMate</h1>
          </div>
          <p className="header-subtitle">Your intelligent programming companion</p>
        </div>
        
        {/* Chat Box */}
        <div className="chat-box">
          {/* Messages */}
          <div className="messages-area">
            {messages.length === 0 && (
              <div className="empty-state">
                <div className="empty-content">
                  <div className="empty-icon">💬</div>
                  <h3 className="empty-title">Ready to code together?</h3>
                  <p className="empty-description">
                    Ask me about debugging, best practices, code reviews, or any programming concepts you'd like to explore.
                  </p>
                  <div className="suggestion-buttons">
                    <button className="suggestion-btn">🐛 Debug my code</button>
                    <button className="suggestion-btn">📝 Code review</button>
                    <button className="suggestion-btn">⚡ Best practices</button>
                    <button className="suggestion-btn">🏗️ Architecture</button>
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.role}`}>
                {message.role !== 'user' && (
                  <div className="message-avatar assistant">🤖</div>
                )}
                
                <div className={`message-bubble ${message.role}`}>
                  <div className="message-role">
                    {message.role === 'user' ? 'You' : 'DevMate'}
                  </div>
                  <div className="message-content">{message.content}</div>
                </div>
                
                {message.role === 'user' && (
                  <div className="message-avatar user">👤</div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="loading-message">
                <div className="message-avatar assistant">🤖</div>
                <div className="message-bubble assistant">
                  <div className="message-role">DevMate</div>
                  <div className="loading-dots">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <span style={{ marginLeft: '12px', color: '#6b7280' }}>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="input-area">
            <form onSubmit={handleSubmit} className="input-form">
              <div className="input-wrapper">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask DevMate anything about programming..."
                  className="input-field"
                />
                {input && <div className="input-hint">Enter</div>}
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="send-btn"
              >
                {isLoading ? '⏹️' : '🚀'}
                <span style={{ display: window.innerWidth > 640 ? 'inline' : 'none' }}>
                  {isLoading ? 'Stop' : 'Send'}
                </span>
              </button>
              
              {isLoading && (
                <button type="button" onClick={stop} className="stop-btn">
                  ⏹️
                </button>
              )}
            </form>

            {error && (
              <div className="error-message">
                <div className="error-icon">⚠️</div>
                <div>
                  <div className="error-label">Oops!</div>
                  <div className="error-text">{error.message}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}