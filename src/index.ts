import { app } from '@azure/functions';
import './functions/fetchTasks';
import './functions/generateResponse';
import './functions/httpTrigger1';

app.setup({
	enableHttpStream: true,
});
