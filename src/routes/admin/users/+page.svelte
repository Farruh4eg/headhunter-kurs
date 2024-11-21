<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { debounce } from '$lib/utils/helpers.js';
	let { data } = $props();

	let currentUserLevel = $state(0);

	let users: Writable<any> = writable([]);

	let searchValue: string = $state('');

	let privilegeChanges: Record<string, number>[] = [];

	let url = $page.url.searchParams;
	let pageN: Writable<number> = writable(parseInt(url.get('page') || '1'));
	let totalPages = writable(1);

	let defaultRoles: Record<string, number> = {};

	const _fetchUserData = async (getTotal = false) => {
		if (getTotal) {
			const response = await fetch(
				`/v1/user?q=-1&page=${$pageN}&search=${searchValue}&total=${getTotal}`
			);

			const count = await response.json();
			totalPages.set(count);
		}
		const response = await fetch(`/v1/user?q=-1&page=${$pageN}&search=${searchValue}`);
		const res = await response.json();
		users.set(res);
		res.forEach((el: Record<string, any>) => {
			defaultRoles[el.user_id] = el.roles.role_id;
		});
	};

	const debouncedFetchData = debounce(_fetchUserData, 400);

	onMount(async () => {
		await _fetchUserData();
		switch (data.role) {
			case 'admin':
				currentUserLevel = 3;
				break;
			case 'mod':
				currentUserLevel = 2;
				break;
			default:
				currentUserLevel = 1;
		}
	});

	$effect(() => {
		searchValue.replaceAll(/['"`;%|]/g, '');
	});

	$effect(() => {
		totalPages.set(data.totalPages);
	});

	const handlePrivilegeChange = (event: any, user_id: number) => {
		const selectedRole = +event.target.value;
		const defaultRole = defaultRoles[user_id];

		if (selectedRole !== defaultRole) {
			privilegeChanges.push({ user_id, newRole: selectedRole });
			privilegeChanges = privilegeChanges;
		} else {
			privilegeChanges = privilegeChanges.filter((change) => change.user_id !== user_id);
			privilegeChanges = privilegeChanges;
		}
	};

	const deleteUser = async (user_id: string) => {
		const response = await fetch(`/v1/user?q=${user_id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			window.location.href = '/admin/users';
		}
	};

	const changePrivileges = async () => {
		if (!privilegeChanges || privilegeChanges.length === 0) return;
		privilegeChanges.forEach(async (el) => {
			const response = await fetch(`/v1/user?q=${el.user_id}&role=${el.newRole}`, {
				method: 'PUT'
			});
			if (response.ok) {
				window.location.href = '/admin/users';
			}
		});
	};
</script>

<section class="mt-4 flex w-full justify-center">
	<input
		type="text"
		name="search-user"
		id="search-user"
		placeholder="Введите данные для поиска"
		class="box-border h-12 w-96 border border-gray-500 bg-white p-2 text-sm hover:border"
		bind:value={searchValue}
		oninput={() => {
			if (searchValue.length) debouncedFetchData(true);
		}}
	/>
</section>
<section class="flex w-full justify-evenly overflow-x-scroll">
	<table class="mt-10 w-max border-collapse border border-gray-300 bg-white">
		<thead>
			<tr class="bg-gray-100">
				<th class="px-4 py-2 text-left">Логин</th>
				<th class="px-4 py-2 text-left">Имя</th>
				<th class="px-4 py-2 text-left">Фамилия</th>
				<th class="px-4 py-2 text-left">Почта</th>
				<th class="px-4 py-2 text-left">Роль</th>
				<th class="px-4 py-2 text-left">Дата создания</th>
				<th class="px-4 py-2 text-left">Действие</th>
			</tr>
		</thead>
		<tbody>
			{#if $users && currentUserLevel}
				{#each $users as user}
					<tr class="hover:bg-gray-200">
						<td class="px-4 py-2 text-left"><span>{user.username}</span></td>
						<td class="px-4 py-2 text-left"><span>{user.first_name}</span></td>
						<td class="px-4 py-2 text-left"><span>{user.last_name}</span></td>
						<td class="px-4 py-2 text-left"><span>{user.email}</span></td>
						<td class="px-4 py-2 text-left">
							<select
								name="role"
								id="role_{user.user_id}"
								disabled={currentUserLevel !== 3 && currentUserLevel < user.roles.role_id}
								class="w-24 p-2"
								onchange={(e) => {
									handlePrivilegeChange(e, user.user_id);
								}}
							>
								<option value="1" selected={user.roles.role === 'default'}>default</option>
								<option value="2" selected={user.roles.role === 'mod'}>mod</option>
								<option
									value="3"
									selected={user.roles.role === 'admin'}
									disabled={currentUserLevel < 3}>admin</option
								>
							</select>
						</td>
						<td class="px-4 py-2 text-left"><span>{user.date_created.split('T')[0]}</span></td>
						{#if data.role === 'admin'}
							<td
								class={'px-4 py-2 text-left font-bold hover:cursor-pointer ' +
									(user.user_id === data.user_id
										? 'pointer-events-none text-gray-500'
										: 'text-red-600')}><a onclick={() => deleteUser(user.user_id)}>Удалить</a></td
							>
						{:else if data.role === 'mod'}
							<td class="px-4 py-2 text-left font-bold"><span>Недоступно</span></td>
						{/if}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</section>

<section class="mt-16 flex h-max justify-center gap-x-24">
	<button
		class="text-lg font-semibold text-blue-600 disabled:text-gray-600"
		disabled={$pageN === 1}
		onclick={() => {
			$pageN--;
			_fetchUserData();
		}}>Назад</button
	>
	<button
		class="text-lg font-semibold text-blue-600 disabled:text-gray-600"
		disabled={$pageN === $totalPages}
		onclick={() => {
			$pageN++;
			_fetchUserData();
		}}>Вперед</button
	>
	<button class="rounded-lg bg-blue-600 px-8 py-4 text-white" onclick={changePrivileges}
		>Сохранить изменения</button
	>
</section>
