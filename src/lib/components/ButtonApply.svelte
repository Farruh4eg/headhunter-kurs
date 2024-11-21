<script lang="ts">
	import { dev } from '$app/environment';
	import { handleFetch } from '$lib/utils/helpers';
	import { onMount } from 'svelte';
	let { user_id, job_id } = $props();

	let applyButton: HTMLButtonElement;

	let buttonText = $state('Откликнуться');
	let hoverColor = $state('hover:bg-blue-600');
	let hasApplied = $state(false);
	let errorMessage = $state('');
	let dialogElement: HTMLDialogElement;

	onMount(async () => {
		const response = await fetch('/v1/application', {
			method: 'GET'
		});

		const data = (await response.json()) as [{ job_id: number }] | null;

		if (data?.some((item) => item.job_id === job_id)) {
			hasApplied = true;
			buttonText = 'Отмена';
			hoverColor = 'hover:bg-red-600';
		} else {
			hasApplied = false;
			buttonText = 'Откликнуться';
			hoverColor = 'hover:bg-blue-600';
		}
	});

	async function manageApplication() {
		if (hasApplied) {
			await handleFetch(
				'/v1/application',
				'DELETE',
				{
					user_id,
					job_id
				},
				{
					'Content-Type': 'application/json'
				}
			);
			hasApplied = false;
			buttonText = 'Откликнуться';
			hoverColor = 'hover:bg-blue-600';
		} else {
			const response = await handleFetch(
				'/v1/application',
				'POST',
				{
					user_id,
					job_id
				},
				{
					'Content-Type': 'application/json'
				}
			);
			if (response.ok) {
				hasApplied = true;
				buttonText = 'Отмена';
				hoverColor = 'hover:bg-red-600';
			} else if (response.status === 400) {
				dialogElement.showModal();
				const res = await response.json();
				errorMessage = await res.message;
			}
		}
	}

	let classes = $derived(
		`h-14 w-32 rounded-xl border border-solid border-gray-300 p-2 hover:text-white ${hoverColor}`
	);
</script>

<button onclick={manageApplication} bind:this={applyButton} class={classes}>
	{buttonText}
</button>

<dialog bind:this={dialogElement} class="w-1/5 rounded-lg border-2 border-blue-600">
	<section class="flex h-48 w-full flex-col items-center justify-between p-10">
		<p>{errorMessage}</p>
		<section class="flex w-full justify-center gap-x-12">
			<button
				onclick={() => {
					dialogElement.close();
				}}
				class="border border-gray-300 bg-blue-600 px-8 py-2 text-white">ОК</button
			>
		</section>
	</section>
</dialog>
