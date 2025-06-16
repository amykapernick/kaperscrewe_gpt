import { app } from '@azure/functions';
import { fetchNotionTasks } from '../api/notion';
import { fetchTodoistTasks } from '../api/todoist';
import type { HttpResponseInit } from '@azure/functions';

export async function fetchTasks(): Promise<HttpResponseInit> {
	const notionTasks = await fetchNotionTasks(process.env.NOTION_DATABASE_ID!);
	const todoistTasks = await fetchTodoistTasks();

	return {
		status: 200,
		jsonBody: {
			notion: notionTasks,
			todoist: todoistTasks,
		},
	};
}

app.http(`fetchTasks`, {
	methods: [`GET`],
	authLevel: `anonymous`,
	handler: fetchTasks,
});
