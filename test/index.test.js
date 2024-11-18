const apiEndpoint = 'https://headhunter-kurs.vercel.app/v1';

describe('app unit tests', () => {
	describe('users GET endpoint', () => {
		it("should get existing user's info", async () => {
			const existinguserid = 2;
			const response = await fetch(`${apiEndpoint}/user?q=${existinguserid}`);
			const data = await response.json();
			expect(data).toBeTruthy();
		});

		it('get non-existing user info', async () => {
			const userid = 999;
			const response = await fetch(`${apiEndpoint}/user?q=${userid}`);
			const data = await response.json();
			expect(data).toBeFalsy();
		});
	});

	describe('users POST endpoint', () => {
		it('should create a user', async () => {
			const crypto = require('crypto');
			const username = crypto.randomBytes(20).toString('hex');
			const password = '12345678';

			const response = await fetch(`${apiEndpoint}/user`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
			});

			expect(response.status).toEqual(200);
		});

		it('should not create user with existing username', async () => {
			const username = 'farruh4eg';
			const password = '11111111';

			const response = await fetch(`${apiEndpoint}/user`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
			});
			expect(response.status).toEqual(409);
		});
	});

	describe('users DELETE endpoint', () => {
		it('should not let delete a user to a non-admin user', async () => {
			const userid = 2;

			const response = await fetch(`${apiEndpoint}/user?q=${userid}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			expect(response.status).toEqual(403);
		});
	});
});
