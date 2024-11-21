<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let usersButton: HTMLButtonElement,
		jobsButton: HTMLButtonElement,
		employersButton: HTMLButtonElement,
		applicationsButton: HTMLButtonElement,
		reportButton: HTMLButtonElement;

	let pathname: string;
	$: pathname = $page.url.pathname;

	onMount(() => {
		switch (true) {
			case pathname.includes('users'):
				usersButton.disabled = true;
				break;
			case pathname.includes('jobs'):
				jobsButton.disabled = true;
				break;
			case pathname.includes('employers'):
				employersButton.disabled = true;
				break;
			case pathname.includes('applications'):
				applicationsButton.disabled = true;
				break;
			case pathname.includes('report'):
				reportButton.disabled = true;
				break;
			default:
				break;
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
			<button
				class="rounded-md border border-gray-400 bg-white px-6 py-4 disabled:bg-blue-600 disabled:text-white"
				bind:this={reportButton}
				on:click={() => (window.location.href = '/admin/report')}>Отчёт</button
			>
		</section>
	</section>
</section>
