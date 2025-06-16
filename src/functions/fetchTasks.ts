import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { fetchNotionTasks } from '../api/notion';
import { fetchTodoistTasks } from '../api/todoist';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
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

export default httpTrigger;
