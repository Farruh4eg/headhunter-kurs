<script lang="ts">
	import SearchResult from '$lib/components/SearchResult.svelte';
  import { session } from '$lib/session.js';
	let { data } = $props();
  
  let isLoggedIn = $state($session.isLoggedIn);
</script>

<svelte:head>
	<title>JobFinder</title>
</svelte:head>

<section class="m-4 mx-auto flex w-[1280px] flex-col gap-y-24 rounded-lg bg-white p-4">
	<section class="flex gap-x-4 w-full flex-col gap-y-4">
  <h1 class="text-2xl font-bold">Последние вакансии</h1>
  {#if data}
    <section class="flex flex-col w-full gap-4 justify-start">
      {#each data.jobs as job}
        {#if isLoggedIn}
        <SearchResult {job} job_id={job.job_id} user_id={data.userInfo.user_id}/>
        {:else}
        <SearchResult {job} job_id={job.job_id}/>
        {/if}
      {/each}
    </section>
  {/if}
</section>
</section>
