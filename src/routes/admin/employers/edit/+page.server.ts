import * as jwt from 'jsonwebtoken';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import { error, type ServerLoadEvent } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const load = async ({ cookies, fetch, url }: ServerLoadEvent) => {
	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const privileges = userInfo?.role;

	if (privileges !== 'admin' && privileges !== 'mod') {
		throw new Error('Forbidden');
	}

	const page: number = parseInt(url.searchParams.get('page') ?? '1');
	const pageSize = 12;

	const response = await fetch(`/v1/employers?q=-1&page=${page}`);
	const employers = await response.json();

	let totalPages = await prisma.employers.count();

	totalPages = Math.ceil(totalPages / pageSize);

	return { employers, totalPages };
};
