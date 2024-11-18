import prisma from '$lib/prisma';

export const load = async () => {
	const jobs = await prisma.joblistings.findMany({
		orderBy: {
			date_created: 'desc'
		},

		include: {
			employers: true
		},

		take: 10
	});
	return { jobs };
};
