import { app } from '@azure/functions';
import { generateResponse as askPrimary } from '../api/openai';
import { askFallbackGPT } from '../api/gptFallback';
import type { HttpRequest, HttpResponseInit } from '@azure/functions';
import memoryClient from '../utils/contextManager'
import { promptSetup } from '../_data/setup';

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
	const now = new Date().toISOString();

	// Fetch tasks to check
	const tasksResponse = await fetch(`${process.env.FUNCTION_BASE_URL}/api/fetchTasks`);
	const { tasks } = await tasksResponse.json() as { tasks: any[] };
	const existingMemory = await memoryClient.loadMemory?.() || ''

	const fullPrompt = `
		${promptSetup}
	
		The current date is ${now}.

		Below is a list of tasks, each task has a title, a due date and a status. If I'm asking you something about due dates, ignore any tasks that don't have a due date.

		Tasks (Full list of tasks formatted as a markdown list that includes the title, and extra parameters):
		${tasks.map((t: any) => `- ${t.title} [due: ${t.due}] [status: ${t.status}]`).join('\n')}

		Memory (JSON data stringified):
		${JSON.stringify(existingMemory) || '[none]'}

		User asked: "${prompt}"
	`

	let response = await askPrimary(fullPrompt);
	let responseSource = `primary`;

	if (looksUseless(response)) {
		response = await askFallbackGPT(fullPrompt);
		responseSource = `fallback`;
	}

	await memoryClient.saveMemory?.(response, fullPrompt);

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
