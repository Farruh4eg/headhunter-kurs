<script lang="ts">
	import { handleFetch } from '$lib/utils/helpers';
	import { onMount } from 'svelte';
	let { user_id, job_id } = $props();

	let applyButton: HTMLButtonElement;

	let buttonText = $state('Откликнуться');
	let hoverColor = $state('bg-blue-600');
	let hasApplied = $state(false);

	onMount(async () => {
		const response = await fetch('/v1/application', {
			method: 'GET'
		});

		const data = (await response.json()) as [{ job_id: number }] | null;

		if (data?.some((item) => item.job_id === job_id)) {
			hasApplied = true;
			buttonText = 'Отмена';
			hoverColor = 'bg-red-600';
		} else {
			hasApplied = false;
			buttonText = 'Откликнуться';
			hoverColor = 'bg-blue-600';
		}
	});

	async function manageApplication() {
		if (hasApplied) {
			window.location.href = '/applications';
		} else {
			await handleFetch(
				'/v1/applications',
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
			hoverColor = 'bg-red-600';
		}
	}
</script>

<button
	onclick={manageApplication}
	bind:this={applyButton}
	class="w-32 rounded-xl border border-solid border-gray-300 p-4 hover:bg-blue-600 hover:text-white"
>
	{buttonText}
</button>
