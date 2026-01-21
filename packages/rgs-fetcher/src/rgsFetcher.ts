import type { paths } from './schema';
import { fetcher } from 'utils-fetcher';

export const rgsFetcher = {
	post: async function post<
		T extends keyof paths,
		TResponse = paths[T]['post']['responses'][200]['content']['application/json'],
	>(options: {
		url: T;
		rgsUrl: string;
		variables?: paths[T]['post']['requestBody']['content']['application/json'];
	}): Promise<TResponse> {
		console.log('[rgsFetcher] POST request:', {
			endpoint: `https://${options.rgsUrl}${options.url}`,
			variables: options.variables,
		});
		const response = await fetcher({
			method: 'POST',
			variables: options.variables,
			endpoint: `https://${options.rgsUrl}${options.url}`,
		});

		console.log('[rgsFetcher] Response status:', response.status);
		
		const text = await response.text();
		console.log('[rgsFetcher] Raw response text:', text);
		
		if (response.status !== 200) {
			console.error('[rgsFetcher] Non-200 status code:', response.status, 'Response:', text);
			throw new Error(`RGS request failed with status ${response.status}: ${text}`);
		}
		
		try {
			const data = JSON.parse(text);
			console.log('[rgsFetcher] Parsed response:', data);
			return data as TResponse;
		} catch (e) {
			console.error('[rgsFetcher] JSON parse error:', e, 'Text:', text);
			throw new Error(`Failed to parse RGS response as JSON: ${text}`);
		}
	},
	get: async function get<
		T extends keyof paths,
		TResponse = paths[T]['get']['responses'][200]['content']['application/json'],
	>(options: { url: T; rgsUrl: string }): Promise<TResponse> {
		const response = await fetcher({
			method: 'GET',
			endpoint: `https://${options.rgsUrl}${options.url}`,
		});

		if (response.status !== 200) console.error('error', response);
		const data = await response.json();
		return data as TResponse;
	},
};
