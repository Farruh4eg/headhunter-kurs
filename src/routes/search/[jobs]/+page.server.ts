import * as jwt from 'jsonwebtoken';
import type { ServerLoadEvent } from '@sveltejs/kit';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import { fetchJobs } from '$lib/utils/helpers';

export const load = async ({ url, cookies, fetch }: ServerLoadEvent) => {
	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const user_id = userInfo?.user_id;

	let searchQuery: string = url.searchParams.get('q')!;
	const page: number = parseInt(url.searchParams.get('page') ?? '1');

	const jobs = await fetchJobs(searchQuery, page, fetch);

	return { jobs, user_id, searchQuery };
};
