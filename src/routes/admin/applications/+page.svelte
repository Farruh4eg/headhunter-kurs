<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { page } from '$app/stores';

	let { data } = $props();
	let url = $page.url.searchParams;

	let pageN: Writable<number> = writable(parseInt(url.get('page') || '1'));
	let totalPages = writable(1);

	$effect(() => {
		totalPages.set(data.totalPages);
	});
</script>

<h1 class="w-full text-center text-2xl font-bold">Отклики пользователей</h1>
<table class="mx-auto mt-10 w-[1280px] border-collapse border border-gray-300 bg-white">
	<thead>
		<tr class="bg-gray-100">
			<th class="px-4 py-2 text-left">Работодатель</th>
			<th class="px-4 py-2 text-left">Наименование</th>
			<th class="px-4 py-2 text-left">Эл.почта</th>
			<th class="px-4 py-2 text-left">Дата отклика</th>
		</tr>
	</thead>
	<tbody>
		{#if data}
			{#each data.applications as application}
				<tr class="hover:bg-gray-200">
					<td class="px-4 py-2 text-left">
						<span>
							{application.joblistings?.employers?.company}
						</span></td
					>
					<td class="px-4 py-2 text-left">
						{application.joblistings?.title}
					</td>
					<td class="px-4 py-2 text-left">
						{application.users?.email}
					</td>
					<td class="px-4 py-2 text-left">
						{application.application_date}
					</td>
				</tr>
			{/each}
		{/if}
	</tbody>
</table>

<section class="mt-16 flex h-max justify-center gap-x-24">
	<button
		class="text-lg font-semibold text-blue-600 disabled:text-gray-600"
		disabled={$pageN === 1}
		onclick={() => {
			$pageN--;
			window.location.href = `/admin/applications?page=${$pageN--}`;
		}}>Назад</button
	>
	<button
		class="text-lg font-semibold text-blue-600 disabled:text-gray-600"
		disabled={$pageN === $totalPages}
		onclick={() => {
			$pageN++;
			window.location.href = `/admin/applications?page=${$pageN++}`;
		}}>Вперед</button
	>
</section>
