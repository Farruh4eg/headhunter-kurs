import type { ServerLoadEvent } from '@sveltejs/kit';
import * as jwt from 'jsonwebtoken';

export const load = async (event: ServerLoadEvent) => {
	let token = event.cookies.get('token')?.replaceAll("'", '') as string;
	const userInfo = jwt.decode(token) as Record<any, any>;
	const response = await event.fetch(`/v1/user?q=${userInfo?.user_id}`);
	let userData = await response.json();
	let userInsensitiveData: any = {
		user_id: userData.user_id,
		username: userData.username,
		email: userData.email,
		last_name: userData.last_name,
		first_name: userData.first_name,
		experience: userData.experience
	};

	userInsensitiveData = JSON.stringify(userInsensitiveData, null, 2);

	return {
		userInsensitiveData
	};
};
