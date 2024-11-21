import prisma from '$lib/prisma';
import { createErrorResponse } from '$lib/utils/helpers';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import { Prisma } from '@prisma/client';
import type { RequestHandler, ServerLoad } from '@sveltejs/kit';
import * as jwt from 'jsonwebtoken';

export const GET: RequestHandler = (async ({ url }: { url: URL }) => {
	const urlQuery = url.searchParams.get('q') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const pageSize = 12;

	const companies: string[] = [];
	const companyParam = url.searchParams.get('company') || '';
	if (companyParam) {
		companies.push(...companyParam.split('-'));
	}

	const salary: number[] = [20_000, 900_000];
	const salaryParam = url.searchParams.get('salary');
	const expParam = url.searchParams.get('experience') || 0;

	if (salaryParam) {
		let splittedSalary = salaryParam.split('-');
		try {
			salary[0] = parseInt(splittedSalary[0]); // min salary
			salary[1] = parseInt(splittedSalary[1]); // max salary
		} catch (e) {
			salary[0] = 20_000;
			salary[1] = 900_000;
		}
	}

	let jobs, totalPages;

	const offset = (page - 1) * pageSize;

	if (!urlQuery) {
		let jobs;
		let totalPages;

		if (companyParam) {
			jobs = await prisma.joblistings.findMany({
				where: {
					employers: {
						company: {
							in: companies
						}
					}
				},
				include: {
					employers: true
				},
				skip: offset,
				take: pageSize
			});

			totalPages = await prisma.joblistings.count({
				where: {
					employers: {
						company: {
							in: companies
						}
					}
				}
			});
		} else {
			jobs = await prisma.joblistings.findMany({
				include: {
					employers: true
				},
				skip: offset,
				take: pageSize
			});

			totalPages = await prisma.joblistings.count();
		}

		totalPages = Math.ceil(totalPages / pageSize);

		let response = JSON.stringify({ jobs: jobs, totalPages: totalPages }, null, 2);
		return new Response(response, {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} else if (urlQuery) {
		jobs = await prisma.joblistings.findMany({
			where: {
				AND: [
					{
						title: {
							contains: urlQuery,
							mode: 'insensitive'
						}
					},
					{
						employers: {
							OR: [
								{
									company: {
										in: companies,
										mode: 'insensitive'
									}
								},
								{
									company: {
										contains: companies.join(''),
										mode: 'insensitive'
									}
								}
							]
						}
					},
					{
						salary: {
							gte: salary[0]
						}
					},
					{
						salary: {
							lte: salary[1]
						}
					},
					{
						experience: {
							gte: +expParam
						}
					}
				]
			},
			include: {
				employers: true
			},
			skip: offset,
			take: pageSize
		});

		totalPages = await prisma.joblistings.count({
			where: {
				AND: [
					{
						title: {
							contains: urlQuery,
							mode: 'insensitive'
						}
					},
					{
						salary: {
							gte: salary[0]
						}
					},
					{
						salary: {
							lte: salary[1]
						}
					},
					{
						employers: {
							OR: [
								{
									company: {
										in: companies,
										mode: 'insensitive'
									}
								},
								{
									company: {
										contains: companies.join(''),
										mode: 'insensitive'
									}
								}
							]
						}
					}
				]
			}
		});

		totalPages = Math.ceil(totalPages / pageSize);
	}
	jobs = JSON.stringify({ jobs: jobs, totalPages: totalPages }, null, 2);
	return new Response(jobs, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}) satisfies ServerLoad;

export const PUT: RequestHandler = async ({ request, cookies }) => {
	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const role = userInfo?.role;
	if (role === 'admin' || role === 'mod') {
		try {
			let ids: number[] = [];
			const body = await request.json();
			Object.keys(body).forEach((id) => {
				ids.push(+id);
			});
			ids.forEach(async (job_id) => {
				await prisma.joblistings.update({
					where: {
						job_id
					},
					data: body[job_id]
				});
			});
			return new Response(JSON.stringify({ success: true, message: 'Product changed' }), {
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

export const DELETE: RequestHandler = async ({ url, cookies }) => {
	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const role = userInfo?.role;
	const queryId = url.searchParams.get('q');

	if ((role === 'admin' || role === 'mod') && queryId) {
		try {
			await prisma.joblistings.delete({
				where: {
					job_id: +queryId!
				}
			});

			return new Response(JSON.stringify({ success: true, message: 'Product deleted' }), {
				headers: {
					'Content-Type': 'application/json'
				},
				status: 200
			});
		} catch (error) {
			return createErrorResponse(`Unknown error: ${error}`, 500);
		}
	}
	return createErrorResponse('Forbidden', 403);
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const role = userInfo?.role;

	if (role !== 'admin' && role !== 'mod') {
		return createErrorResponse('Forbidden', 403);
	}

	const body = await request.json();

	let jobInfo: Record<any, any> = {};
	Object.entries(body).forEach(([key, value]) => {
		if (body[key]) {
			jobInfo[key] = value;
		}
	});

	const prismaJobData = jobInfo as Prisma.joblistingsCreateInput;
	await prisma.joblistings.create({
		data: prismaJobData
	});

	return new Response(JSON.stringify({ success: true, message: 'Product created successfully' }), {
		headers: {
			'Content-Type': 'apllication/json'
		},
		status: 200
	});
};
