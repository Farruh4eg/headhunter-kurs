<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let usersButton: HTMLButtonElement,
		jobsButton: HTMLButtonElement,
		employersButton: HTMLButtonElement,
		applicationsButton: HTMLButtonElement;

	let pathname: string;
	$: pathname = $page.url.pathname;

	onMount(() => {
		if (pathname.includes('users')) {
			usersButton.disabled = true;
		} else if (pathname.includes('jobs')) {
			jobsButton.disabled = true;
		} else if (pathname.includes('employers')) {
			employersButton.disabled = true;
		} else if (pathname.includes('applications')) {
			applicationsButton.disabled = true;
		}
	});
</script>

<slot />
<section>
	<section class="my-8 flex w-full justify-center gap-x-4">
		<section class="sticky flex gap-x-4">
			<button
				class="rounded-md border border-gray-400 bg-white px-6 py-4 disabled:bg-blue-600 disabled:text-white"
				bind:this={usersButton}
				on:click={() => (window.location.href = '/admin/users')}>Пользователи</button
			>
			<button
				class="rounded-md border border-gray-400 bg-white px-6 py-4 disabled:bg-blue-600 disabled:text-white"
				bind:this={jobsButton}
				on:click={() => (window.location.href = '/admin/jobs/edit')}>Вакансии</button
			>
			<button
				class="rounded-md border border-gray-400 bg-white px-6 py-4 disabled:bg-blue-600 disabled:text-white"
				bind:this={employersButton}
				on:click={() => (window.location.href = '/admin/employers/edit')}>Работодатели</button
			>
			<button
				class="rounded-md border border-gray-400 bg-white px-6 py-4 disabled:bg-blue-600 disabled:text-white"
				bind:this={applicationsButton}
				on:click={() => (window.location.href = '/admin/applications?page=1')}>Отклики</button
			>
		</section>
	</section>
</section>
