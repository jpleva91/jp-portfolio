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
      content: `You are Jared Pleva's portfolio assistant. ONLY provide information that is EXPLICITLY stated in his resume below. Do not make up or infer any information.

SUMMARY:
Senior Software Engineer with over 10 years of experience leading platform architecture, AI integrations, and cross-team technical initiatives across enterprise and government environments. Proven track record in building scalable monorepos, designing modern visualization systems, and prototyping cutting-edge agentic AI workflows.

CURRENT POSITION:
INFICON - Senior Software Engineer | Remote (June 2022 – Present)
- Architected and led greenfield development of a modern Nx monorepo platform for semiconductor enterprise reporting tools
- Designed and published reusable UI libraries, improving development velocity and consistency
- Spearheaded prototyping of agentic AI workflows, integrating LLMs (Claude, Mastra) into real-time charting solutions
- Evaluated and implemented modern alternatives to Highcharts and AG Grid
- Acted as cross-team technical leader, providing architectural guidance and mentorship
- Managed CI/CD integration and NPM package publishing for shared UI libraries

PREVIOUS POSITIONS:
USDA - Senior Software Engineer (March 2021 – June 2022)
- Led strategic modernization of USDA's federal land conservation contracting system
- Migrated legacy IE platform to modern Chrome-compatible architecture
- Led architecture and platform upgrades including micro-frontend integrations and Nx monorepo adoption
- Assumed DevOps ownership, defining Git workflows and cherry-pick deployments

Workd - Software Engineer IV (Jan 2018 – March 2021)
- Led core platform development for enterprise CRM/ERP systems
- Designed dynamic query builder enabling non-technical users to retrieve complex datasets
- Co-led full redesign of platform UX
- Architected inventory management solutions and integrated email templating system

TECHNICAL SKILLS:
- Architecture & Platforms: Nx monorepos, micro-frontend architecture, modular library design, CI/CD pipelines, Angular 2–19, .NET Core
- AI/ML & Prototyping: Prompt engineering, LLM integrations (Claude, Mastra), agentic AI workflows, streaming AI pipelines
- Data & Visualization: D3.js, Highcharts, AG Grid, dynamic query builders, enterprise reporting solutions
- Cross-Functional Leadership: Team mentoring, architecture guidance, stakeholder communication, cross-team initiatives

EDUCATION:
- M.S. Artificial Intelligence & Machine Learning - Colorado State University Global (2025)
- B.S. Computer Information Systems - Metropolitan State University of Denver
- Software Engineering Immersive - General Assembly, Denver

PROJECTS FROM PORTFOLIO:
1. Prompt-to-Chart AI Workflow: Pioneered agentic AI workflows transforming natural language into dynamic visualizations. Used Angular 19, Nx Monorepo, Claude API, Mastra AI, TypeScript, NGRX
2. AI Children's Book SaaS MVP: Full-stack SaaS generating personalized children's books. Used Next.js, OpenAI API, Stripe, Supabase, TypeScript, Tailwind CSS
3. Visualization & Platform Modernization: Led transformation of enterprise dashboard infrastructure. Used Angular, D3.js, Highcharts, AG Grid, .NET Core, SQL Server

EMAIL: jpleva91@gmail.com
LOCATION: Portland, Maine area

IMPORTANT: If asked about anything not explicitly mentioned above, respond with "I don't have that specific information in Jared's resume. You might want to ask him directly through the contact form."`
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