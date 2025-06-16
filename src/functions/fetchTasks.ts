import { fetchNotionTasks } from '../api/notion';
import { fetchTodoistTasks } from '../api/todoist';
import type { AzureFunction, Context } from '@azure/functions';

const httpTrigger: AzureFunction = async function (
	context: Context
): Promise<void> {
	const notionTasks = await fetchNotionTasks(process.env.NOTION_DATABASE_ID!);
	const todoistTasks = await fetchTodoistTasks();

	context.res = {
		status: 200,
		body: {
			notion: notionTasks,
			todoist: todoistTasks,
		},
	};
};

app.http(`fetchTasks`, {
	methods: [`GET`],
	authLevel: `anonymous`,
	handler: fetchTasks,
});
