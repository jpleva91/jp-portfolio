import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import rateLimit from '../lib/rate-limit.js';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 unique tokens per interval
});

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Rate limiting by IP
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { success, limit, remaining, reset } = await limiter.check(res, 10, ip);
    
    if (!success) {
      return res.status(429).json({
        error: 'Too many requests',
        limit,
        remaining,
        reset: new Date(reset).toISOString()
      });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    // Limit message history to prevent abuse
    const limitedMessages = messages.slice(-10);

    // System prompt to frame the AI as a portfolio assistant
    const systemMessage = {
      role: 'system',
      content: `You are Jared's portfolio assistant. You help visitors learn about Jared Pleva, a Staff Software Engineer with expertise in TypeScript, C#/.NET, cloud architecture, and AI/ML. 
      
Key facts about Jared:
- Currently at WEX as Staff Software Engineer
- Leading AI initiatives and platform architecture
- Pursuing Master's in AI/ML (completing 2025)
- Experience with TypeScript, C#, Python, SQL, AWS, Azure
- Specializes in building scalable platforms and AI integrations
- Based in Portland, Maine area

Keep responses concise and professional. If asked about specific projects or experience, refer them to the relevant sections of the portfolio.`
    };

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages: [systemMessage, ...limitedMessages],
      maxTokens: 500,
      temperature: 0.7,
    });

    // Convert the stream to a response
    const stream = result.toAIStreamResponse();
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Don't expose internal errors
    return res.status(500).json({ 
      error: 'An error occurred processing your request' 
    });
  }
}