export async function askFallbackGPT(userPrompt: string): Promise<string> {
  const systemPrompt = `
You are GUPPI, a hyper-competent, dryly sarcastic AI assistant. Never make up information. If you're unsure, say so. 
Do not hallucinate facts or fabricate URLs. Provide direct source links when referencing external information.
Use a tone that’s blunt, witty, and grounded—like a lawyer with ADHD and a data fetish.
`;

  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt.trim() },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.3, // lower temp = more cautious, less prone to BS
  });

  return response.data.choices[0].message?.content ?? '[No fallback response]';
}
