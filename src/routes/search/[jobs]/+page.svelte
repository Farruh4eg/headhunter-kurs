<script lang="ts">
	import SearchFilters from '$lib/components/SearchFilters.svelte';
	import SearchResult from '$lib/components/SearchResult.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { page } from '$app/stores';

	export let data: any;

	let jobs: any = writable([]);

	let url = $page.url.searchParams;
	let pageN: Writable<number> = writable(parseInt(url.get('page') || '1'));
	const companies = url.get('company') || '';
	const salary = url.get('salary') || '20000-900000';

	let totalPages = writable(1);

	const fetchJobData = async () => {
		const response = await fetch(
			`/v1/jobs?q=${data.searchQuery}&page=${$pageN}&company=${companies}&salary=${salary}`
		);
		const { jobs: resJobs, totalPages: resTotalPages } = await response.json();
		await jobs.set(resJobs);
		totalPages.set(resTotalPages);
	};

	onMount(async () => {
		await fetchJobData();
	});
</script>

<svelte:head>
	<title>Результаты поиска</title>
</svelte:head>
<section class="mx-auto flex w-[1280px] justify-evenly gap-x-4 p-4">
	{#if $jobs?.length > 0}
		<SearchFilters data={$jobs} query={data.searchQuery} />
	{/if}
	<section class="mb-4 mt-6 flex min-w-[40%] flex-col gap-4" id="search-results-container">
		{#if $jobs?.length > 0}
			{#each $jobs as job (job.job_id)}
				<SearchResult job={job.joblistings} user_id={data.user_id} job_id={job.job_id} />
			{/each}
			<section class="mt-16 flex h-max justify-center gap-x-20">
				<button
					class="text-lg font-semibold text-blue-600 disabled:text-gray-600"
					disabled={$pageN === 1}
					on:click={() => {
						$pageN--;
						document.getElementById('search-results-container')?.scrollIntoView({
							behavior: 'smooth'
						});
						fetchJobData();
					}}>Назад</button
				>
				<button
					class="text-lg font-semibold text-blue-600 disabled:text-gray-600"
					disabled={$pageN === $totalPages}
					on:click={() => {
						$pageN++;
						document.getElementById('search-results-container')?.scrollIntoView({
							behavior: 'smooth'
						});
						fetchJobData();
					}}>Вперед</button
				>
			</section>
		{:else}
			<p>По вашему запросу ничего не найдено</p>
		{/if}
	</section>
</section>
