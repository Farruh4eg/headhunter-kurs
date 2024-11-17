<script lang="ts">
	import { session } from '$lib/session';
	import SearchResult from '$lib/components/SearchResult.svelte';

	let { data } = $props();
	let isLoggedIn = $state($session.isLoggedIn);
</script>

<svelte:head>
	<title>Ваши отклики</title>
</svelte:head>
<h1 class="flex w-full justify-center pt-6 text-3xl font-bold">Ваши отклики</h1>
<section class="flex w-full justify-evenly gap-x-4 p-4">
	{#if !isLoggedIn}
		<p>Войдите в учетную запись чтобы иметь доступ к откликам</p>
	{:else if data.applications.length === 0}
		<p>Вы еще не откликнулись на вакансии.</p>
	{:else}
		<section class="relative mb-4 ml-10 mt-6 flex min-w-[50%] flex-col gap-4">
			{#each data.applications as application (application.application_id)}
				<SearchResult
					job={application.joblistings}
					user_id={application.user_id}
					job_id={application.job_id}
				/>
			{/each}
		</section>
	{/if}
</section>
