<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { debounce } from '$lib/utils/helpers.js';
	let { data } = $props();

	let employers: Writable<any> = writable([]);

	let searchValue: string = $state('');

	let url = $page.url.searchParams;
	let pageN: Writable<number> = writable(parseInt(url.get('page') || '1'));
	let totalPages = writable(1);

	let defaultEmployers: any = $state({});
	let newEmployers: any = $state({});

	const _fetchEmployerData = async (getTotal = false) => {
		if (getTotal) {
			const response = await fetch(
				`/v1/employers?q=-1&page=${$pageN}&search=${searchValue}&total=${getTotal}`
			);

			const count = await response.json();
			totalPages.set(count);
		}
		const response = await fetch(`/v1/employers?q=-1&page=${$pageN}&search=${searchValue}`);
		const res = await response.json();
		employers.set(res);
		res.forEach((el: Record<string, string>) => {
			defaultEmployers[el.employer_id] = el;
		});
	};

	const debouncedFetchData = debounce(_fetchEmployerData, 400);

	const updateNewValue = (employer_id: number, header: string, value: any) => {
		if (!newEmployers[employer_id]) {
			newEmployers[employer_id] = {};
		}
		newEmployers[employer_id][header] = value;
		if (!newEmployers[employer_id].hasOwnProperty('company')) {
			newEmployers[employer_id]['company'] = defaultEmployers[employer_id]['company'];
		}
		if (!newEmployers[employer_id].hasOwnProperty('logo')) {
			newEmployers[employer_id]['logo'] = defaultEmployers[employer_id]['logo'];
		}
	};

	onMount(async () => {
		await _fetchEmployerData();
	});

	$effect(() => {
		searchValue = searchValue.replaceAll(/['"`;%|]/g, '');
	});

	$effect(() => {
		totalPages.set(data.totalPages);
	});

	$effect(() => {
		console.log(Object.keys(newEmployers).length);
	});

	const deleteSupplier = async (employer_id: number) => {
		const response = await fetch(`/v1/employers?q=${employer_id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			window.location.reload();
		}
	};

	const saveChanges = async () => {
		const requestBody = newEmployers;
		try {
			const response = await fetch('/v1/employers', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});
			if (response.ok) {
				console.log('Changes saved successfully');
				window.location.reload();
			} else {
				console.error('Failed to save changes');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};
</script>

<section class="mt-4 flex w-full justify-center">
	<input
		type="text"
		name="search-employer"
		id="search-employer"
		placeholder="Введите данные для поиска"
		class="box-border h-12 w-96 border border-gray-500 bg-white p-2 text-sm hover:border"
		bind:value={searchValue}
		oninput={() => {
			debouncedFetchData(true);
		}}
	/>
</section>
<section class="flex w-full justify-evenly overflow-x-scroll">
	<table class="mt-10 w-[1280px] border-collapse border border-gray-300 bg-white">
		<thead>
			<tr class="bg-gray-100">
				<th class="px-4 py-2 text-left">Наименование</th>
				<th class="px-4 py-2 text-left">Лого</th>
				<th class="px-4 py-2 text-left">Действие</th>
			</tr>
		</thead>
		<tbody>
			{#if $employers}
				{#each $employers as employer}
					<tr class="hover:bg-gray-200">
						<td class="px-4 py-2 text-left"
							><input
								type="text"
								name="company"
								id="company"
								bind:value={employer.company}
								class="border border-gray-300"
								oninput={(e) => updateNewValue(employer.employer_id, e.target.name, e.target.value)}
							/></td
						>
						<td class="px-4 py-2 text-left"
							><input
								type="file"
								name="logo"
								id="logo"
								oninput={(e) => {
									updateNewValue(employer.employer_id, e.target.name, e.target.files[0]?.name);
								}}
							/>
						</td>
						<td class="w-[100px] px-4 py-2 text-left font-bold text-red-600 hover:cursor-pointer"
							><a onclick={() => deleteSupplier(employer.employer_id)}>Удалить</a></td
						>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</section>

<section class="mt-16 flex h-max justify-center gap-x-24">
	<button
		class="text-lg font-semibold text-blue-600 disabled:text-gray-600"
		disabled={$pageN === 1}
		onclick={() => {
			$pageN--;
			_fetchEmployerData();
		}}>Назад</button
	>
	<button
		class="text-lg font-semibold text-blue-600 disabled:text-gray-600"
		disabled={$pageN === $totalPages}
		onclick={() => {
			$pageN++;
			_fetchEmployerData();
		}}>Вперед</button
	>
	<button
		class="rounded-lg bg-blue-600 px-8 py-4 text-white disabled:bg-gray-300 disabled:text-black"
		onclick={saveChanges}
		disabled={Object.keys(newEmployers).length > 0 ? false : true}>Сохранить изменения</button
	>
</section>
