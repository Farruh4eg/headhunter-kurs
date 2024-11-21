import prisma from '$lib/prisma.js';

export const actions = {
	default: async ({ request }) => {
		// Parse the form data
		const formData = new URLSearchParams(await request.text());
		const startDate = formData.get('startDate');
		const endDate = formData.get('endDate');

		// Check if startDate and endDate are provided
		if (!startDate || !endDate) {
			return {
				status: 400,
				body: { error: 'Please select both start and end dates.' }
			};
		}

		// Query to count applications between the selected dates
		const applicationsCount = await prisma.userjobapplications.count({
			where: {
				application_date: {
					gte: new Date(startDate),
					lte: new Date(endDate)
				}
			}
		});

		// Query to find the most applied job within the date range
		const mostAppliedJob = await prisma.userjobapplications.groupBy({
			by: ['job_id'],
			where: {
				application_date: {
					gte: new Date(startDate),
					lte: new Date(endDate)
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
			// Fetch the job title based on the most applied job
			const job = await prisma.joblistings.findUnique({
				where: { job_id: mostAppliedJob[0].job_id }
			});
			mostAppliedJobTitle = job?.title || 'No job found';
		}

		return {
			status: 200,
			body: {
				applicationsCount,
				mostAppliedJob: mostAppliedJobTitle
			}
		};
	}
};

export const load = async ({ url }) => {
	const searchParams = url.searchParams;
	const startDate = searchParams.get('startDate');
	const endDate = searchParams.get('endDate');

	let applicationsCount = 0;
	let mostAppliedJob = '';

	if (startDate && endDate) {
		// Handle data fetching on page load
		const response = await fetch('/?startDate=' + startDate + '&endDate=' + endDate);
		const data = await response.json();

		applicationsCount = data.applicationsCount;
		mostAppliedJob = data.mostAppliedJob;
	}

	return {
		applicationsCount,
		mostAppliedJob
	};
};
