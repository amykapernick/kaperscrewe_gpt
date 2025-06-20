import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const todoistAPI = axios.create({
	baseURL: `https://api.todoist.com/rest/v2`,
	headers: { Authorization: `Bearer ${process.env.TODOIST_API_TOKEN}` },
});

export async function fetchTodoistTasks() {
	const response = await todoistAPI.get(`/tasks`);

	return response.data.map((task: any) => ({
		id: task.id,
		title: task.content,
		due: task.due?.date ? new Date(task.due.date).toISOString() : null,
		status: task.completed ? 'Done' : 'Not Started',
		platform: 'todoist'
	}));
}
