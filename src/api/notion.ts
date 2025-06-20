import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function fetchNotionTasks(databaseId: string) {
	const response = await notion.databases.query({ database_id: databaseId });
	return response.results.map((page: any) => ({
		id: page.id,
		title: page.properties.Name.title[0]?.plain_text,
		status: page.properties.Status?.status?.name,
		due: page.properties.Due?.date?.start ? new Date(page.properties.Due.date.start).toISOString() : null,
		platform: 'notion'
	}));
}
