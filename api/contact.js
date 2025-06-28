export const config = {
  runtime: 'edge',
};

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Sanitize input
    const sanitizedData = {
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase(),
      message: message.trim().slice(0, 5000),
    };

    // SendGrid API call
    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: 'jpleva91@gmail.com' }],
        }],
        from: { 
          email: 'contact@jpleva91.github.io', // You'll need to verify this sender
          name: 'Portfolio Contact Form'
        },
        reply_to: {
          email: sanitizedData.email,
          name: sanitizedData.name
        },
        subject: `Portfolio Contact: ${sanitizedData.name}`,
        content: [
          {
            type: 'text/plain',
            value: `
Name: ${sanitizedData.name}
Email: ${sanitizedData.email}
Message:
${sanitizedData.message}

--
Sent from jp-portfolio contact form
            `,
          },
          {
            type: 'text/html',
            value: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">New Contact Form Submission</h2>
  
  <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 10px 0;"><strong>Name:</strong> ${sanitizedData.name}</p>
    <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${sanitizedData.email}">${sanitizedData.email}</a></p>
  </div>
  
  <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h3 style="color: #555; margin-top: 0;">Message:</h3>
    <p style="white-space: pre-wrap; color: #333;">${sanitizedData.message}</p>
  </div>
  
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
  <p style="color: #999; font-size: 12px; text-align: center;">
    Sent from jp-portfolio contact form
  </p>
</div>
            `,
          },
        ],
      }),
    });

    if (!sendGridResponse.ok) {
      const error = await sendGridResponse.text();
      console.error('SendGrid error:', error);
      throw new Error('Failed to send email');
    }

    // Send confirmation email
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: sanitizedData.email }],
        }],
        from: { 
          email: 'contact@jpleva91.github.io',
          name: 'Jared Pleva'
        },
        subject: 'Thank you for reaching out!',
        content: [
          {
            type: 'text/html',
            value: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">Thank you for reaching out!</h2>
  
  <p>Hi ${sanitizedData.name},</p>
  
  <p>Thank you for getting in touch! I've received your message and will get back to you as soon as possible.</p>
  
  <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 5px 0; color: #666;"><strong>Your message:</strong></p>
    <p style="white-space: pre-wrap; color: #333;">${sanitizedData.message}</p>
  </div>
  
  <p>Best regards,<br>
  <strong>Jared Pleva</strong></p>
  
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
  <p style="color: #999; font-size: 12px; text-align: center;">
    This is an automated response from jp-portfolio
  </p>
</div>
            `,
          },
        ],
      }),
    });

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Thank you for your message! I\'ll get back to you soon.' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to send message. Please try again or email directly.' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}