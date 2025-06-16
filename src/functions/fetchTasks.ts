import { app } from '@azure/functions';
import { fetchNotionTasks } from '../api/notion';
import { fetchTodoistTasks } from '../api/todoist';
import type { HttpRequest, HttpResponseInit } from '@azure/functions';

export async function fetchTasks(req: HttpRequest): Promise<HttpResponseInit> {
	const notionTasks = await fetchNotionTasks(process.env.NOTION_DATABASE_ID!);
	const todoistTasks = await fetchTodoistTasks();

	return {
		status: 200,
		body: JSON.stringify({
			notion: notionTasks,
			todoist: todoistTasks,
		}),
	};
}

app.http(`fetchTasks`, {
	methods: [`GET`],
	authLevel: `anonymous`,
	handler: fetchTasks,
});
