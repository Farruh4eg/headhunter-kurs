<script lang="ts">
	import { preventDefault } from 'svelte/legacy';
	import * as XLSX from 'xlsx';

	let start_date = $state();
	let end_date = $state();
	let data: any = $state();

	async function formSubmit() {
		const response = await fetch(`/v1/report?start_date=${start_date}&end_date=${end_date}`);
		data = await response.json();
	}

	function exportToXLS() {
		const table = document.querySelector('table');
		if (table) {
			const wb = XLSX.utils.table_to_book(table);
			XLSX.writeFile(wb, 'report.xlsx');
		}
	}
</script>

<form
	onsubmit={preventDefault(formSubmit)}
	class="mx-auto flex w-max flex-col items-center justify-center gap-4 p-4"
>
	<input type="date" bind:value={start_date} class="w-64 border-2 border-gray-300 p-2" />
	<input type="date" bind:value={end_date} class="w-64 border-2 border-gray-300 p-2" />
	<button class="h-12 w-32 rounded-xl border border-solid bg-blue-600 p-2 text-white">Отчет</button>
</form>

<section class="flex w-full justify-evenly overflow-x-hidden">
	<table class="mt-10 w-[1280px] border-collapse border border-gray-300 bg-white">
		<thead>
			<tr class="bg-gray-100">
				<th class="px-4 py-2 text-left">Начальная дата</th>
				<th class="px-4 py-2 text-left">Конечная дата</th>
				<th class="px-4 py-2 text-left">Откликов за промежуток</th>
				<th class="px-4 py-2 text-left">Самая популярная вакансия</th>
			</tr>
		</thead>
		{#if data}
			<tbody>
				<tr class="hover:bg-gray-200">
					<td class="px-4 py-2 text-left"><span>{start_date}</span></td>
					<td class="px-4 py-2 text-left"><span>{end_date}</span></td>
					<td class="px-4 py-2 text-left"><span>{data.applicationsCount}</span></td>
					<td class="px-4 py-2 text-left"><span>{data.mostAppliedJob}</span></td>
				</tr>
			</tbody>
		{/if}
	</table>
</section>
<div class="mt-4 flex justify-center gap-4">
	<button
		class="h-12 w-32 rounded-xl border border-solid bg-green-600 p-2 text-white"
		onclick={exportToXLS}
	>
		Экспорт в XLS
	</button>
</div>
