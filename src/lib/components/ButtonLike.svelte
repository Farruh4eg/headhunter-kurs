<script lang="ts">
	import { handleFetch } from '$lib/utils/helpers';
	import { onMount } from 'svelte';
	import { savedJobsCountStore } from '$lib/session';

	let { user_id, job_id } = $props();

	let isLiked = $state(false);

	const fillHeart = async () => {
		const response = await fetch('/v1/saved', {
			method: 'GET'
		});

		const data = (await response.json()) as [{ job_id: number }] | null;

		if (data?.some((item) => item.job_id === job_id)) {
			isLiked = true;
			savedJobsCountStore.update((value) => value + 1);
		} else {
			isLiked = false;
			savedJobsCountStore.update((value) => value - 1);
		}
	};

	onMount(async () => {
		fillHeart();
	});

	const addToLiked = async () => {
		if (isLiked) {
			await handleFetch(
				'/v1/saved',
				'DELETE',
				{
					user_id,
					job_id
				},
				{
					'Content-Type': 'applicaton/json'
				}
			);
			isLiked = false;
			savedJobsCountStore.update((value) => value - 1);
		} else {
			await handleFetch(
				'/v1/saved',
				'POST',
				{
					user_id,
					job_id
				},
				{
					'Content-Type': 'applicaton/json'
				}
			);
			isLiked = true;
			savedJobsCountStore.update((value) => value + 1);
		}
	};
</script>

<button
	onclick={addToLiked}
	class="flex h-16 w-16 items-center justify-center rounded-xl border border-solid border-gray-300 p-4 hover:bg-gray-50"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		stroke-width="1.0"
		stroke="gray"
		fill={isLiked ? 'blue' : 'none'}
		class="h-8"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
		/>
	</svg>
</button>
