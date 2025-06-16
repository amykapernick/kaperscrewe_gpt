import OpenAI from 'openai';

export const openai = new OpenAI({
	apiKey: process.env.AZURE_OPENAI_KEY!,
	baseURL: `${process.env.AZURE_OPENAI_ENDPOINT!}/openai/deployments/gpt-4`,
	defaultQuery: { 'api-version': `2024-04-01-preview` },
	defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_KEY! },
});

export async function generateResponse(prompt: string) {
	const response = await openai.chat.completions.create({
		model: `gpt-4`, // still required for type compliance
		messages: [{ role: `user`, content: prompt }],
	});

	return response.choices[0]?.message?.content?.trim() ?? ``;
}
