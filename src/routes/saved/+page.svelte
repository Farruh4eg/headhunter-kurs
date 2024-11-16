<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Избранное</title>
</svelte:head>
<h1 class="flex w-full justify-center pt-6 text-3xl font-bold">Избранное</h1>
<section class="flex justify-evenly gap-x-4 p-4">
	{#if data.jobs.length === 0}
		<p>Ваш список избранных пуст</p>
	{:else}
		<section class="mb-4 mt-6 flex flex-col gap-4">
			{#each data.jobs as job (job.job_id)}
				<SearchResult job={job.joblistings} user_id={data.user_id} />
			{/each}
		</section>
	{/if}
</section>
