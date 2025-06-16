import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { generateResponse as askPrimary } from '../api/openai';
import { askFallbackGPT } from '../api/gptFallback';

function looksUseless(response: string): boolean {
  const fallbackTriggers = [
    "I'm not sure",
    "I don't know",
    "unable to",
    "cannot find",
    "insufficient information",
  ];
  return fallbackTriggers.some((phrase) => response.toLowerCase().includes(phrase));
}

export async function generateResponse(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const body = (await request.json()) as { prompt?: string };
  const prompt = body?.prompt || 'What is my current task status?';

  const primaryResponse = await askPrimary(prompt);

  if (looksUseless(primaryResponse)) {
    const fallbackResponse = await askFallbackGPT(prompt);
    return {
      status: 200,
      jsonBody: {
        source: 'fallback',
        original: primaryResponse,
        fallback: fallbackResponse,
      },
    };
  } else {
    return {
      status: 200,
      jsonBody: {
        source: 'primary',
        response: primaryResponse,
      },
    };
  }
}

app.http('generateResponse', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: generateResponse,
});
