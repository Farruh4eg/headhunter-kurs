import prisma from '$lib/prisma';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN } from '$env/static/private';
import { dev } from '$app/environment';
import type { RequestHandler } from '@sveltejs/kit';
import type { PostBody, UserCookieInfo } from '$lib/utils/interfaces';
import { createErrorResponse } from '$lib/utils/helpers';
import type { Body } from '$lib/utils/interfaces';

export const GET: RequestHandler = async ({ url, cookies }) => {
	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const role = userInfo?.role;
	const urlUserId = +url.searchParams.get('q')!;
	const searchQuery = url.searchParams.get('search');
	const page = parseInt(url.searchParams.get('page') || '1');
	const sendTotalPages = url.searchParams.get('total') === 'true';
	const pageSize = 12;
	const offset = (page - 1) * pageSize;
	const isPermitted = role === 'admin' || role === 'mod';

	if (sendTotalPages && searchQuery) {
		let totalPages = await prisma.users.count({
			where: {
				OR: [
					{
						username: {
							contains: searchQuery,
							mode: 'insensitive'
						}
					},
					{
						first_name: {
							contains: searchQuery,
							mode: 'insensitive'
						}
					},
					{
						last_name: {
							contains: searchQuery,
							mode: 'insensitive'
						}
					},
					{
						email: {
							contains: searchQuery,
							mode: 'insensitive'
						}
					},
					{
						roles: {
							role: {
								contains: searchQuery,
								mode: 'insensitive'
							}
						}
					}
				]
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
		const users = await prisma.users.findMany({
			where: {
				OR: [
					{
						username: {
							contains: searchQuery,
							mode: 'insensitive'
						}
					},
					{
						first_name: {
							contains: searchQuery,
							mode: 'insensitive'
						}
					},
					{
						last_name: {
							contains: searchQuery,
							mode: 'insensitive'
						}
					},
					{
						email: {
							contains: searchQuery,
							mode: 'insensitive'
						}
					},
					{
						roles: {
							role: {
								contains: searchQuery,
								mode: 'insensitive'
							}
						}
					}
				]
			},
			select: {
				user_id: true,
				username: true,
				first_name: true,
				last_name: true,
				email: true,
				roles: {
					select: {
						role: true
					}
				},
				date_created: true,
				experience: true
			},
			skip: offset,
			take: pageSize
		});

		return new Response(JSON.stringify(users), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	if (isPermitted && urlUserId === -1) {
		let users = await prisma.users.findMany({
			select: {
				user_id: true,
				username: true,
				first_name: true,
				last_name: true,
				email: true,
				roles: {
					select: {
						role: true
					}
				},
				date_created: true,
				experience: true
			},
			skip: offset,
			take: pageSize
		});

		return new Response(JSON.stringify(users), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	let user = await prisma.users.findUnique({
		where: {
			user_id: urlUserId!
		}
	});

	const userJson = JSON.stringify(user, null, 2);

	return new Response(userJson, {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json()) as Body;

	if (
		body?.username.replaceAll(/['"`;%|]/g, '').trim().length < 4 ||
		body?.password.replaceAll(/['"`;%|]/g, '').trim().length < 8
	) {
		return createErrorResponse(
			'Логин должен быть больше 4 символов. Пароль должен быть больше 8 символов',
			400
		);
	} else {
		const check_user = await prisma.users.findFirst({
			where: {
				username: body.username
			},
			select: {
				username: true
			}
		});
		if (check_user) {
			return createErrorResponse('Пользователь уже существует', 409);
		}
		const saltRounds = 14;
		const hashedPassword = await bcrypt.hash(body.password, saltRounds);
		const refresh_token = randomUUID();

		const create_user = await prisma.users.create({
			data: {
				username: body.username,
				refresh_token,
				password: hashedPassword
			},
			include: {
				roles: true
			}
		});

		const user_id = create_user.user_id;

		const user = {
			username: body.username,
			user_id,
			role: create_user.roles?.role
		};
		const secure = dev ? '' : 'Secure;';
		const token = jwt.sign(user, SECRET_ACCESS_TOKEN, {
			expiresIn: '90 days'
		});

		const setCookieHeader = [
			`token=${token}; Max-Age=${90 * 24 * 60 * 60}; Path=/; ${secure} HttpOnly`,

			`refresh-token=${refresh_token}; Max-Age=${30 * 24 * 60 * 60 * 12}; Path=/; ${secure} HttpOnly`
		].join(', ');

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Set-Cookie': setCookieHeader
			}
		});
	}
};

export const PUT: RequestHandler = async ({ request, url }) => {
	const role = url.searchParams.get('role');
	const changingUserId = +url.searchParams.get('user_id')!;

	if (role && changingUserId) {
		const user = await prisma.users.update({
			where: {
				user_id: changingUserId
			},
			data: {
				roles: {
					update: {
						role
					}
				}
			}
		});

		return new Response(
			JSON.stringify({
				success: true,
				message: 'User privilige changed'
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	} else {
		const body = (await request.json()) as PostBody;
		let { user_id, last_name, first_name, email, experience } = body;
		console.log(body);

		const receivedUser = await prisma.users.findUnique({
			where: {
				user_id
			}
		});

		if (!receivedUser) {
			createErrorResponse('Пользователь не найден', 404);
		} else {
			await prisma.users.update({
				where: {
					user_id
				},
				data: {
					last_name,
					first_name,
					email,
					experience: +experience
				}
			});
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: 'Пользователь создан успешно'
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
};

export const DELETE: RequestHandler = async ({ url, cookies }) => {
	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const role = userInfo?.role;
	const queryId = +url.searchParams.get('q')!;

	if (role === 'admin' && queryId) {
		await prisma.users.delete({
			where: {
				user_id: queryId
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
