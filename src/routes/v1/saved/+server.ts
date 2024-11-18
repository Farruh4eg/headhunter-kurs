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

	if (cookieUserId != user_id) {
		return createErrorResponse('Forbidden', 403);
	}

	const saved = await prisma.savedjoblistings.findFirst({
		where: {
			user_id,
			job_id
		}
	});

	if (saved == null) {
		await prisma.savedjoblistings.create({
			data: {
				user_id,
				job_id
			}
		});
	}

	return new Response(
		JSON.stringify({
			success: true,
			message: 'Item has been added to saved'
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
		return createErrorResponse('User not logged in', 403);
	}
	const saved = await prisma.savedjoblistings.findMany({
		where: {
			user_id: cookieUserId
		},
		select: {
			job_id: true
		}
	});

	return new Response(JSON.stringify(saved), {
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
	const cookieUserId = userInfo.user_id;
	const { user_id, job_id } = body;

	if (cookieUserId != user_id) {
		return createErrorResponse('Forbidden', 403);
	}

	const saved = await prisma.savedjoblistings.findFirst({
		where: {
			user_id,
			job_id
		},
		select: {
			saved_id: true
		}
	});

	const saved_id = saved?.saved_id;

	if (saved_id) {
		await prisma.savedjoblistings.delete({
			where: {
				saved_id
			}
		});
	}
	return new Response(
		JSON.stringify({
			success: true,
			message: 'Item has been deleted from saved'
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			},
			status: 200
		}
	);
};
