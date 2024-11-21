import * as jwt from 'jsonwebtoken';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import { error } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const load = async ({ cookies, fetch, url }) => {
	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const role = userInfo?.role;
	const user_id = userInfo?.user_id;

	if (role !== 'admin' && role !== 'mod') {
		error(403, {
			message: 'Forbidden'
		});
	}

	const page: number = parseInt(url.searchParams.get('page') ?? '1');
	const pageSize = 12;

	const response = await fetch(`/v1/user?q=-1&page=${page}`, {
		method: 'GET'
	});
	const users = await response.json();

	let totalPages = await prisma.users.count();

	totalPages = Math.ceil(totalPages / pageSize);

	return { users, totalPages, role, user_id };
};
