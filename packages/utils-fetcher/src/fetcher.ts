export const fetcher = (options: {
	fetch?: typeof fetch;
	method: 'POST' | 'GET';
	endpoint: string;
	variables?: object;
}) => {
	const { method, endpoint, variables } = options;

	const body = method === 'GET' ? undefined : JSON.stringify(variables);
	console.log('[fetcher] Request:', { method, endpoint, body });

	return (options.fetch ?? fetch)(endpoint, {
		method,
		headers: {
			'Content-Type': 'application/json',
		},
		...(method === 'GET' ? {} : { body }),
	});
};
