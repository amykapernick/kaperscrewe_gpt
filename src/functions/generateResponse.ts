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

	// Fetch tasks to check
	const tasksResponse = await fetch(`${process.env.FUNCTION_BASE_URL}/api/fetchTasks`);
	const { tasks } = await tasksResponse.json();
	const existingMemory = await memoryClient.loadMemory?.() || ''

	const fullPrompt = `
		Tasks:
		${tasks.map((t: any) => `- ${t.title} [due ${t.due}]`).join('\n')}

		Memory:
		${existingMemory || '[none]'}

		User asked: "${prompt}"
	`


	let response = await askPrimary(fullPrompt);
	let responseSource = `primary`;

	if (looksUseless(response)) {
		response = await askFallbackGPT(prompt);
		responseSource = `fallback`;
	}

	await memoryClient.saveMemory?.(response);

	return {
		status: 200,
		body: JSON.stringify({
			source: responseSource,
			response: response,
		}),
	};
}

app.http(`generateResponse`, {
	methods: [`POST`],
	authLevel: `anonymous`,
	handler: generateResponse,
});
