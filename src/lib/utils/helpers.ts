export const createErrorResponse = (message: string, status: number): Response => {
	return new Response(JSON.stringify({ success: false, message }), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
};

export const addSpaceInString = (inputString: string): string => {
	if (inputString.length <= 3) {
		return inputString;
	}

	let result = '';
	let counter = 0;

	for (let i = inputString.length - 1; i >= 0; i--) {
		result = inputString[i] + result;
		counter++;
		if (counter === 3 && i !== 0) {
			result = ' ' + result;
			counter = 0;
		}
	}

	return result;
};

export const handleFetch = async (url: string, method: string, body: {}, headers?: {}) => {
	try {
		const response = await fetch(url, {
			method,
			credentials: 'same-origin',
			body: JSON.stringify(body),
			headers: {
				...headers
			}
		});

		return response;
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
};

export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
	let timerId: ReturnType<typeof setTimeout>;

	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		clearTimeout(timerId);
		timerId = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
};

export const fetchJobs = async (
	searchQuery: string,
	page: number,
	eventFetch: (input: string | URL | Request, init?: RequestInit | undefined) => Promise<Response>
) => {
	const response = await eventFetch(`/v1/jobs?q=${searchQuery}&page=${page}`);
	return response.json();
};
