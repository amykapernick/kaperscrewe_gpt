import { app } from '@azure/functions';
import type {
	HttpRequest,
	HttpResponseInit,
	InvocationContext,
} from '@azure/functions';

export async function httpTrigger1(
	request: HttpRequest,
	context: InvocationContext
): Promise<HttpResponseInit> {
	context.log(`Http function processed request for url "${request.url}"`);

	const name = request.query.get(`name`) || (await request.text()) || `world`;

	return { body: `Hello, ${name}!` };
}

app.http(`httpTrigger1`, {
	methods: [`GET`, `POST`],
	authLevel: `anonymous`,
	handler: httpTrigger1,
});
