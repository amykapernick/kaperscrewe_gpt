import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { fetchNotionTasks } from '../api/notion';
import { fetchTodoistTasks } from '../api/todoist';

export async function fetchTasks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

app.http('fetchTasks', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: fetchTasks,
});
