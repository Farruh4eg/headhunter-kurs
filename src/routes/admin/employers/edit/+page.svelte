<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { debounce } from '$lib/utils/helpers.js';
	export let data;

	let employers: Writable<any> = writable([]);

	let searchValue: string = '';

	let url = $page.url.searchParams;
	let pageN: Writable<number> = writable(parseInt(url.get('page') || '1'));
	let totalPages = writable(1);

	let defaultSuppliers: Record<string, any> = {};
	let newSuppliers: Record<string, any> = {};

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
			defaultSuppliers[el.employer_id] = el;
		});
	};

	const debouncedFetchData = debounce(_fetchEmployerData, 400);

	const updateNewValue = (employer_id: number, header: string, value: any) => {
		if (!newSuppliers[employer_id]) {
			newSuppliers[employer_id] = {};
		}
		newSuppliers[employer_id][header] = value;
		if (!newSuppliers[employer_id].hasOwnProperty('company')) {
			newSuppliers[employer_id]['company'] = defaultSuppliers[employer_id]['company'];
		}
		if (!newSuppliers[employer_id].hasOwnProperty('logo')) {
			newSuppliers[employer_id]['logo'] = defaultSuppliers[employer_id]['logo'];
		}
	};

	onMount(async () => {
		await _fetchEmployerData();
	});

	$: {
		searchValue = searchValue.replaceAll(/['"`;%|]/g, '');
	}

	$: {
		totalPages.set(data.totalPages);
		console.log($totalPages);
	}

	const deleteSupplier = async (supplierid: number) => {
		const response = await fetch(`/v1/employers?q=${supplierid}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			window.location.reload();
		}
	};

	const saveChanges = async () => {
		const requestBody = newSuppliers;
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
		on:input={() => {
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
			</tr>
		</thead>
		<tbody>
			{#if $employers}
				{#each $employers as employer}
					<tr class="hover:bg-gray-200">
						<td class="px-4 py-2 text-left"
							><input
								type="text"
								name="companyname"
								bind:value={employer.company}
								class="w-[100px] border border-gray-300"
								on:input={(e) =>
									updateNewValue(employer.employer_id, e.target.name, e.target.value)}
							/></td
						>
						<td class="px-4 py-2 text-left"
							><input
								type="file"
								name="logo"
								class=" w-[100px]"
								bind:value={defaultSuppliers[employer.employer_id].logo}
								on:input={(e) => {
									console.log(e.target.files[0]?.name);
									updateNewValue(employer.supplierid, e.target.name, e.target.files[0]?.name);
								}}
							/>
						</td>
						<td class="w-[100px] px-4 py-2 text-left font-bold text-red-600 hover:cursor-pointer"
							><a on:click={() => deleteSupplier(employer.supplierid)}>Удалить</a></td
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
		on:click={() => {
			$pageN--;
			_fetchEmployerData();
		}}>Назад</button
	>
	<button
		class="text-lg font-semibold text-blue-600 disabled:text-gray-600"
		disabled={$pageN === $totalPages}
		on:click={() => {
			$pageN++;
			_fetchEmployerData();
		}}>Вперед</button
	>
	<button
		class="rounded-lg bg-blue-600 px-8 py-4 text-white disabled:bg-gray-300 disabled:text-black"
		on:click={saveChanges}
		disabled={Object.keys(newSuppliers).length > 0 ? false : true}>Сохранить изменения</button
	>
</section>
