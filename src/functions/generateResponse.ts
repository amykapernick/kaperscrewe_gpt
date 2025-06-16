import { AzureFunction, Context, HttpRequest } from '@azure/functions';
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
  return fallbackTriggers.some(phrase => response.toLowerCase().includes(phrase));
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const prompt = req.body?.prompt || 'What is my current task status?';
  const primaryResponse = await askPrimary(prompt);

  if (looksUseless(primaryResponse)) {
    const fallbackResponse = await askFallbackGPT(prompt);
    context.res = {
      status: 200,
      body: {
        source: 'fallback',
        original: primaryResponse,
        fallback: fallbackResponse,
      },
    };
  } else {
    context.res = {
      status: 200,
      body: {
        source: 'primary',
        response: primaryResponse,
      },
    };
  }
};

export default httpTrigger;
