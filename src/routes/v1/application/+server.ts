import prisma from '$lib/prisma';
import * as jwt from 'jsonwebtoken';
import { createErrorResponse } from '$lib/utils/helpers';
import type { RequestHandler } from '@sveltejs/kit';
import type { UserCookieInfo } from '$lib/utils/interfaces';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = (await request.json()) as {
		user_id: number;
		job_id: number;
	};

	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const cookieUserId = userInfo?.user_id;

	const { user_id, job_id } = body;

	if (cookieUserId !== user_id) {
		return createErrorResponse(`Forbidden`, 403);
	}

	const application = await prisma.userjobapplications.findFirst({
		where: {
			user_id,
			job_id
		}
	});

	if (application == null) {
		const job = await prisma.joblistings.findUnique({
			where: {
				job_id
			},
			select: {
				experience: true
			}
		});

		const user = await prisma.users.findUnique({
			where: {
				user_id
			},
			select: {
				experience: true
			}
		});

		if (user?.experience! < job?.experience!) {
			return createErrorResponse('Ваш опыт работы меньше требуемого', 400);
		}

		await prisma.userjobapplications.create({
			data: {
				user_id,
				job_id
			}
		});
	}

	return new Response(
		JSON.stringify({
			success: true,
			message: 'Application sent'
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			},
			status: 200
		}
	);
};

export const GET: RequestHandler = async ({ cookies }) => {
	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const cookieUserId = userInfo?.user_id;

	if (!cookieUserId) {
		return new Response(JSON.stringify({ success: false, message: 'User not logged in' }));
	}
	const application = await prisma.userjobapplications.findMany({
		where: {
			user_id: cookieUserId
		},
		select: {
			job_id: true
		}
	});

	return new Response(JSON.stringify(application), {
		headers: {
			'Content-Type': 'application/json'
		},
		status: 200
	});
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	const body = (await request.json()) as {
		user_id: number;
		job_id: number;
	};

	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const cookieUserId = userInfo?.user_id;
	const { user_id, job_id } = body;

	if (cookieUserId != user_id) {
		return createErrorResponse('Forbidden', 403);
	}

	if (job_id) {
		const application = await prisma.userjobapplications.findFirst({
			where: {
				user_id,
				job_id
			},
			select: {
				application_id: true
			}
		});

		const application_id = application?.application_id;

		if (application_id) {
			await prisma.userjobapplications.delete({
				where: {
					application_id
				}
			});
		}
	} else {
		await prisma.userjobapplications.deleteMany({
			where: {
				user_id
			}
		});
	}
	return new Response(
		JSON.stringify({
			success: true,
			message: 'Application has been deleted'
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			},
			status: 200
		}
	);
};
