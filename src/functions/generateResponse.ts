import { app } from '@azure/functions';
import { generateResponse as askPrimary } from '../api/openai';
import { askFallbackGPT } from '../api/gptFallback';
import type { HttpRequest, HttpResponseInit } from '@azure/functions';

function looksUseless(response: string): boolean {
	const fallbackTriggers = [
		`I'm not sure`,
		`I don't know`,
		`unable to`,
		`cannot find`,
		`insufficient information`,
	];
	return fallbackTriggers.some((phrase) =>
		response.toLowerCase().includes(phrase)
	);
}

export async function generateResponse(
	req: HttpRequest
): Promise<HttpResponseInit> {
	const body = (await req.json()) as { prompt?: string };
	const prompt = body?.prompt || `What is my current task status?`;
	const primaryResponse = await askPrimary(prompt);

	if (looksUseless(primaryResponse)) {
		const fallbackResponse = await askFallbackGPT(prompt);
		return {
			status: 200,
			body: JSON.stringify({
				source: `fallback`,
				original: primaryResponse,
				fallback: fallbackResponse,
			}),
			headers: {
				'Content-Type': `application/json`,
			},
		};
	}

	return {
		status: 200,
		body: JSON.stringify({
			source: `primary`,
			response: primaryResponse,
		}),
	};
}

app.http(`generateResponse`, {
	methods: [`POST`],
	authLevel: `anonymous`,
	handler: generateResponse,
});
