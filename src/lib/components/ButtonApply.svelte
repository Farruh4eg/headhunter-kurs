<script lang="ts">
	import { dev } from '$app/environment';
	import { handleFetch } from '$lib/utils/helpers';
	import { onMount } from 'svelte';
	let { user_id, job_id } = $props();

	let applyButton: HTMLButtonElement;

	let buttonText = $state('Откликнуться');
	let hoverColor = $state('hover:bg-blue-600');
	let hasApplied = $state(false);

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
			await handleFetch(
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
			hasApplied = true;
			buttonText = 'Отмена';
			hoverColor = 'hover:bg-red-600';
		}
	}

	let classes = $derived(
		`h-14 w-32 rounded-xl border border-solid border-gray-300 p-2 hover:text-white ${hoverColor}`
	);
</script>

<button onclick={manageApplication} bind:this={applyButton} class={classes}>
	{buttonText}
</button>
