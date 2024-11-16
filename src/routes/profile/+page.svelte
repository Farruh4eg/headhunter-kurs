<script lang="ts">
	import type { UserData } from '$lib/utils/interfaces.js';
	import { handleFetch } from '$lib/utils/helpers.js';

	let { data } = $props();

	const userData: UserData = JSON.parse(data.userInsensitiveData);
	console.log(userData);

	let notice: HTMLParagraphElement;

	let { user_id, last_name, first_name, email, experience } = $state(userData);

	const formSubmit = async () => {
		const response = await handleFetch('/v1/user', 'PUT', {
			user_id,
			last_name,
			first_name,
			email,
			experience
		});

		if (response.ok) {
			notice.textContent = 'Данные успешно изменены';
		}
	};
</script>

<form
	class="mx-auto my-4 flex w-[60rem] flex-col gap-y-4 rounded-lg border border-gray-300 bg-white p-4"
	method="POST"
	on:submit|preventDefault={formSubmit}
>
	<h1 class="flex w-full items-center justify-center text-3xl font-bold text-gray-600">
		Личный кабинет
	</h1>

	<section class="flex w-full items-center gap-x-8">
		<input
			type="text"
			name="last_name"
			required
			bind:value={last_name}
			class="w-64 rounded-lg border border-gray-300 px-2 py-3 text-sm font-bold text-gray-800"
		/>
		<label for="last_name" class="text-sm text-gray-600">Фамилия</label>
	</section>
	<section class="flex w-full items-center gap-x-8">
		<input
			type="text"
			name="first_name"
			required
			bind:value={first_name}
			class="w-64 rounded-lg border border-gray-300 px-2 py-3 text-sm font-bold text-gray-800"
		/>
		<label for="first_name" class="text-sm text-gray-600">Имя</label>
	</section>
	<section class="flex w-full items-center gap-x-8">
		<input
			type="email"
			name="email"
			required
			bind:value={email}
			class="w-64 rounded-lg border border-gray-300 px-2 py-3 text-sm font-bold text-gray-800"
		/>
		<label for="email" class="text-sm text-gray-600">Электронная почта</label>
	</section>
	<section class="flex w-full items-center gap-x-8">
		<input
			type="number"
			name="experience"
			required
			bind:value={experience}
			min="0"
			max="60"
			class="w-32 rounded-lg border border-gray-300 px-2 py-3 text-sm font-bold text-gray-800"
		/>
		<label for="experience" class="text-sm text-gray-600">Опыт работы (в годах)</label>
	</section>
	<section class="box-content flex h-max w-full justify-center p-2 text-lg">
		<p bind:this={notice}></p>
	</section>
	<section class="flex w-full justify-center">
		<button type="submit" class="w-max rounded-lg bg-blue-500 px-4 py-2 text-white hover:opacity-75"
			>Сохранить</button
		>
	</section>
</form>
