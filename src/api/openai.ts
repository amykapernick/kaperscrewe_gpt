import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_OPENAI_KEY!)
);

export async function generateResponse(prompt: string) {
  const deploymentId = 'gpt-4'; // Customize if needed
  const messages = [{ role: 'user', content: prompt }];
  const response = await client.getChatCompletions(deploymentId, messages);
  return response.choices[0].message?.content ?? '';
}
