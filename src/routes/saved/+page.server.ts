import prisma from '$lib/prisma';
import * as jwt from 'jsonwebtoken';
import type { ServerLoadEvent } from '@sveltejs/kit';
import type { UserCookieInfo } from '$lib/utils/interfaces';

export const load = async ({ cookies }: ServerLoadEvent) => {
	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const user_id = userInfo?.user_id;

	const jobs = await prisma.savedjoblistings.findMany({
		where: {
			user_id
		},
		select: {
			job_id: true,
			joblistings: {
				select: {
					salary: true,
					title: true,
					employers: true
				}
			}
		}
	});

	return { jobs, user_id };
};
