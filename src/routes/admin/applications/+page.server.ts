import * as jwt from 'jsonwebtoken';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import { type ServerLoadEvent } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const load = async ({ cookies, fetch, url }: ServerLoadEvent) => {
	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const role = userInfo?.role;

	if (role !== 'admin' && role !== 'mod') {
		throw new Error('Forbidden');
	}

	const page: number = parseInt(url.searchParams.get('page') ?? '1');
	const pageSize = 12;
	const offset = (page - 1) * pageSize;

	const applications = await prisma.userjobapplications.findMany({
		select: {
			application_date: true,
			users: {
				select: {
					email: true
				}
			},
			joblistings: {
				select: {
					title: true,
					employers: {
						select: {
							company: true
						}
					}
				}
			}
		},
		take: pageSize,
		skip: offset,
		orderBy: {
			application_date: 'desc'
		}
	});

	let totalPages = await prisma.userjobapplications.count();

	totalPages = Math.ceil(totalPages / pageSize);

	return { applications, totalPages };
};
