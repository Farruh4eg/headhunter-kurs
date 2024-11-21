<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let editButton: HTMLButtonElement, createButton: HTMLButtonElement;

	let pathname: string;
	$: pathname = $page.url.pathname;

	onMount(() => {
		if (pathname.includes('edit')) {
			editButton.disabled = true;
		} else if (pathname.includes('create')) {
			createButton.disabled = true;
		}
	});
</script>

<slot />

<section class="my-8 flex w-full justify-center gap-x-4">
	<section class="sticky flex gap-x-4">
		<button
			class="rounded-md border border-gray-400 bg-white px-6 py-4 disabled:bg-blue-600 disabled:text-white"
			bind:this={editButton}
			on:click={() => (window.location.href = '/admin/jobs/edit')}>Редактировать</button
		>
		<button
			class="rounded-md border border-gray-400 bg-white px-6 py-4 disabled:bg-blue-600 disabled:text-white"
			bind:this={createButton}
			on:click={() => (window.location.href = '/admin/jobs/create')}>Добавить</button
		>
	</section>
</section>
