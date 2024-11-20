import prisma from '$lib/prisma';
import jwt from 'jsonwebtoken';
import type { RequestHandler } from '@sveltejs/kit';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import { createErrorResponse } from '$lib/utils/helpers';

export const GET: RequestHandler = async ({ url, cookies }) => {
	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const role = userInfo?.role;
	const urlEmployerId = parseInt(url.searchParams.get('q') || '-1');
	const searchQuery = url.searchParams.get('search');
	const page = parseInt(url.searchParams.get('page') || '1');
	const sendTotalPages = url.searchParams.get('total') === 'true';
	const pageSize = 12;
	const offset = (page - 1) * pageSize;
	const isPermitted = role === 'admin' || role === 'mod';

	if (sendTotalPages && searchQuery) {
		let totalPages = await prisma.employers.count({
			where: {
				company: {
					contains: searchQuery,
					mode: 'insensitive'
				}
			}
		});

		totalPages = Math.ceil(totalPages / pageSize);

		return new Response(JSON.stringify(totalPages), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} else if (isPermitted && searchQuery) {
		const employers = await prisma.employers.findMany({
			where: {
				company: {
					contains: searchQuery,
					mode: 'insensitive'
				}
			},
			select: {
				company: true,
				logo: true
			},
			skip: offset,
			take: pageSize
		});

		return new Response(JSON.stringify(employers), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	if (isPermitted && urlEmployerId === -1) {
		let employers = await prisma.employers.findMany({
			select: {
				company: true,
				logo: true
			},
			skip: offset,
			take: pageSize
		});

		return new Response(JSON.stringify(employers), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	let employer = await prisma.employers.findUnique({
		where: {
			employer_id: urlEmployerId
		},
		select: {
			company: true,
			employer_id: true,
			logo: true
		}
	});

	const userJson = JSON.stringify(employer, null, 2);

	return new Response(userJson, {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

export const DELETE: RequestHandler = async ({ url, cookies }) => {
	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const privilege = userInfo?.role;
	const queryId = parseInt(url.searchParams.get('q') || '');

	if ((privilege === 'admin' || privilege === 'mod') && queryId) {
		await prisma.employers.delete({
			where: {
				employer_id: queryId
			}
		});

		return new Response(
			JSON.stringify({
				success: true,
				message: 'User deleted successfully'
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}

	return createErrorResponse('Forbidden', 403);
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const role = userInfo?.role;
	if (role === 'admin' || role === 'mod') {
		try {
			let ids: number[] = [];
			const body = await request.json();
			Object.keys(body).forEach((id) => {
				ids.push(parseInt(id));
			});
			ids.forEach(async (employer_id) => {
				await prisma.employers.update({
					where: {
						employer_id
					},
					data: body[employer_id]
				});
			});
			return new Response(JSON.stringify({ success: true, message: 'Supplier changed' }), {
				headers: {
					'Content-Type': 'application/json'
				},
				status: 200
			});
		} catch (error) {
			return createErrorResponse(`Unknown error`, 500);
		}
	}
	return createErrorResponse('Forbidden', 403);
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const role = userInfo?.role;

	if (role === 'admin' || role === 'mod') {
		const body = await request.json();

		await prisma.employers.create({
			data: body
		});

		return new Response(JSON.stringify({ success: true, message: 'Supplier created' }), {
			headers: {
				'Content-Type': 'application/json'
			},
			status: 200
		});
	}
	return createErrorResponse('Forbidden', 403);
};
