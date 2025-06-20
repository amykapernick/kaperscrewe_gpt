import OpenAI from 'openai';
import { promptSetup } from '../_data/setup';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY!,
});

export async function askFallbackGPT(userPrompt: string): Promise<string> {
	const systemPrompt = `${promptSetup}`;

	try {
		const response = await openai.chat.completions.create({
			model: `gpt-4`,
			messages: [
				{ role: `system`, content: systemPrompt.trim() },
				{ role: `user`, content: userPrompt },
			],
			temperature: 0.3, // lower temp = more cautious, less prone to BS
		});

		return (
			response.choices[0].message?.content?.trim() ??
			`[No fallback response]`
		);
	} catch (error) {
		return `Error generating fallback response. ${error}`;
	}
}
