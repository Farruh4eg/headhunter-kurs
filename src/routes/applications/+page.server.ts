import prisma from '$lib/prisma';
import * as jwt from 'jsonwebtoken';
import type { UserCookieInfo } from '$lib/utils/interfaces';

export const load = async ({ cookies }) => {
	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const user_id = userInfo?.user_id;

	const applications = await prisma.userjobapplications.findMany({
		where: {
			user_id
		},
		select: {
			application_id: true,
			user_id: true,
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

	const user = await prisma.users.findUnique({
		where: {
			user_id
		}
	});

	let userDataFilled = true;

	if (user?.email == null || user?.first_name == null || user?.last_name == null) {
		userDataFilled = false;
	}

	return { applications, user_id, userDataFilled, user };
};
