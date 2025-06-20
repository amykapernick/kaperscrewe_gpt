import { CosmosClient } from '@azure/cosmos';
import dotenv from 'dotenv';

dotenv.config();

const client = new CosmosClient({
	endpoint: process.env.COSMOS_DB_ENDPOINT!,
	key: process.env.COSMOS_DB_KEY!,
});

const databaseId = process.env.COSMOS_DB_DATABASE!;
const containerId = process.env.COSMOS_DB_CONTAINER!;
const container = client.database(databaseId).container(containerId);

interface MemoryEntry {
	id: string;
	timestamp: string;
	content: string;
	prompt?: string;
}

async function saveMemory(content: string, prompt?: string) {
	const entry: MemoryEntry = {
		id: Date.now().toString(),
		timestamp: new Date().toISOString(),
		content,
		prompt: prompt || `No prompt provided`,
	};
	await container.items.create(entry);
}

async function loadMemory(limit: number = 5): Promise<MemoryEntry[]> {
	const query = {
		query: `SELECT * FROM c ORDER BY c.timestamp DESC OFFSET 0 LIMIT @limit`,
		parameters: [{ name: `@limit`, value: limit }],
	};
	const { resources } = await container.items
		.query<MemoryEntry>(query)
		.fetchAll();
	return resources;
}

async function summarizeMemory(limit: number = 5): Promise<string> {
	const memory = await loadMemory(limit);
	return memory
		.map((entry) => `- [${entry.timestamp}]: ${entry.content}`)
		.join(`\n`);
}

export default {
	saveMemory,
	loadMemory,
	summarizeMemory,
};