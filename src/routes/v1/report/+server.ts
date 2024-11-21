import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import * as jwt from 'jsonwebtoken';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import { createErrorResponse } from '$lib/utils/helpers';

export const GET: RequestHandler = async ({ cookies, url }) => {
	let token = cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as UserCookieInfo;
	const role = userInfo?.role;
	const start_date = url.searchParams.get('start_date')!;
	const end_date = url.searchParams.get('end_date')!;

	console.log({ start_date, end_date });

	if (role === 'admin' || role === 'mod') {
		const applicationsCount = await prisma.userjobapplications.count({
			where: {
				application_date: {
					gte: new Date(start_date),
					lte: new Date(end_date)
				}
			}
		});

		const mostAppliedJob = await prisma.userjobapplications.groupBy({
			by: ['job_id'],
			where: {
				application_date: {
					gte: new Date(start_date),
					lte: new Date(end_date)
				}
			},
			_count: {
				job_id: true
			},
			orderBy: {
				_count: {
					job_id: 'desc'
				}
			},
			take: 1
		});

		let mostAppliedJobTitle = '';
		if (mostAppliedJob.length > 0) {
			const job = await prisma.joblistings.findUnique({
				where: { job_id: mostAppliedJob[0].job_id }
			});
			mostAppliedJobTitle = job?.title || 'Вакансий не найдено';
		}

		const body = JSON.stringify(
			{ applicationsCount, mostAppliedJob: mostAppliedJobTitle },
			null,
			2
		);

		return new Response(body, {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
	return createErrorResponse('Forbidden', 403);
};
