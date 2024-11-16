export interface PostBody {
	user_id: number;
	last_name: string;
	first_name: string;
	email: string;
	experience: number;
}

export interface UserData extends PostBody {
	username: string;
	role: string;
}

export interface Body {
	username: string;
	password: string;
}

export interface UserCookieInfo {
	username: string;
	user_id: number;
	role: string;
	iat: number;
	exp: number;
}
