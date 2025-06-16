import { generateResponse as askPrimary } from '../api/openai';
import { askFallbackGPT } from '../api/gptFallback';
import type { AzureFunction, Context, HttpRequest } from '@azure/functions';

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

const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<void> {
	const prompt = req.body?.prompt || `What is my current task status?`;
	const primaryResponse = await askPrimary(prompt);

	if (looksUseless(primaryResponse)) {
		const fallbackResponse = await askFallbackGPT(prompt);
		context.res = {
			status: 200,
			body: {
				source: `fallback`,
				original: primaryResponse,
				fallback: fallbackResponse,
			},
		};
	} else {
		context.res = {
			status: 200,
			body: {
				source: `primary`,
				response: primaryResponse,
			},
		};
	}
};

	if (looksUseless(primaryResponse)) {
		const fallbackResponse = await askFallbackGPT(prompt);
		return {
			status: 200,
			jsonBody: {
				source: `fallback`,
				original: primaryResponse,
				fallback: fallbackResponse,
			},
		};
	} else {
		return {
			status: 200,
			jsonBody: {
				source: `primary`,
				response: primaryResponse,
			},
		};
	}
}

app.http(`generateResponse`, {
	methods: [`POST`],
	authLevel: `anonymous`,
	handler: generateResponse,
});
