export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages array required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
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

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...limitedMessages],
        max_tokens: 500,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API error');
    }

    // Return the streaming response with CORS headers
    return new Response(openaiResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'An error occurred processing your request' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}