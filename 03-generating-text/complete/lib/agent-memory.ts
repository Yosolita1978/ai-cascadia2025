// Simple in-memory storage for the workshop
// In production, you'd use a database or persistent storage

interface MemoryEntry {
  id: string;
  timestamp: Date;
  type: 'context' | 'analysis' | 'decision' | 'result';
  content: any;
  metadata?: Record<string, any>;
}

interface AgentSession {
  sessionId: string;
  entries: MemoryEntry[];
  created: Date;
  lastAccessed: Date;
}

class AgentMemory {
  private sessions: Map<string, AgentSession> = new Map();
  private maxEntries = 100; // Limit memory to prevent overflow
  private maxAge = 24 * 60 * 60 * 1000; // 24 hours

  createSession(sessionId?: string): string {
    const id = sessionId || this.generateSessionId();
    const session: AgentSession = {
      sessionId: id,
      entries: [],
      created: new Date(),
      lastAccessed: new Date()
    };
    this.sessions.set(id, session);
    return id;
  }

  addMemory(sessionId: string, type: MemoryEntry['type'], content: any, metadata?: Record<string, any>) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const entry: MemoryEntry = {
      id: this.generateEntryId(),
      timestamp: new Date(),
      type,
      content,
      metadata
    };

    session.entries.push(entry);
    session.lastAccessed = new Date();

    // Trim old entries if we exceed the limit
    if (session.entries.length > this.maxEntries) {
      session.entries = session.entries.slice(-this.maxEntries);
    }
  }

  getRecentMemories(sessionId: string, limit = 10): MemoryEntry[] {
    const session = this.sessions.get(sessionId);
    if (!session) return [];

    session.lastAccessed = new Date();
    return session.entries.slice(-limit);
  }

  getMemoriesByType(sessionId: string, type: MemoryEntry['type'], limit = 5): MemoryEntry[] {
    const session = this.sessions.get(sessionId);
    if (!session) return [];

    return session.entries
      .filter(entry => entry.type === type)
      .slice(-limit);
  }

  getContextSummary(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session || session.entries.length === 0) {
      return "No previous context available.";
    }

    const recentEntries = this.getRecentMemories(sessionId, 5);
    const analyses = recentEntries.filter(e => e.type === 'analysis');
    const decisions = recentEntries.filter(e => e.type === 'decision');

    let summary = "Recent context:\n";
    
    if (analyses.length > 0) {
      summary += `- Code analyses: ${analyses.length} files/snippets reviewed\n`;
    }
    
    if (decisions.length > 0) {
      summary += `- Recent decisions: ${decisions.map(d => d.content.decision || 'Unknown').join(', ')}\n`;
    }

    return summary;
  }

  cleanupOldSessions() {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastAccessed.getTime() > this.maxAge) {
        this.sessions.delete(sessionId);
      }
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEntryId(): string {
    return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance for the workshop
export const agentMemory = new AgentMemory();

// Helper function to get or create session
export function getOrCreateSession(sessionId?: string): string {
  if (sessionId && agentMemory.getRecentMemories(sessionId, 1).length > 0) {
    return sessionId;
  }
  return agentMemory.createSession(sessionId);
}

// Helper function to add context to memory
export function rememberContext(sessionId: string, context: any, metadata?: Record<string, any>) {
  agentMemory.addMemory(sessionId, 'context', context, metadata);
}

// Helper function to add analysis results
export function rememberAnalysis(sessionId: string, analysis: any, metadata?: Record<string, any>) {
  agentMemory.addMemory(sessionId, 'analysis', analysis, metadata);
}

// Helper function to add decisions
export function rememberDecision(sessionId: string, decision: any, metadata?: Record<string, any>) {
  agentMemory.addMemory(sessionId, 'decision', decision, metadata);
}

// Helper function to get context summary
export function getContextSummary(sessionId: string): string {
  return agentMemory.getContextSummary(sessionId);
}