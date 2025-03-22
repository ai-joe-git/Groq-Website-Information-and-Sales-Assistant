export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history = [], systemPrompt = '', model = 'llama-3.1-8b-instant' } = req.body;
  
  // Use provided system prompt or default one
  const finalSystemPrompt = systemPrompt || `
  You are a helpful assistant for a website. Answer questions about the company, products, or services.
  Keep your responses concise and well-formatted with appropriate paragraph breaks.
  `;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model, // Using the specified model
        messages: [
          { role: 'system', content: finalSystemPrompt },
          ...history,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json({ 
      response: data.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to get response from Groq API' 
    });
  }
}
