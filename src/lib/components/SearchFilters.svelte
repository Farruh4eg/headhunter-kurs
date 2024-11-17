<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let { data, query } = $props();

	let companiesCheckboxContainer: HTMLElement;
	let checkboxes: HTMLInputElement[];
	let inputMinPrice: HTMLInputElement;
	let inputMaxPrice: HTMLInputElement;

	let companiesArray = new Set<string>(data.map((x: any) => x.employers.company));

	let url = $page.url.searchParams;

	let companiesStringified: string = '';
	let salary: string;

	const loadFiltersFromStorage = () => {
		const filters = JSON.parse(localStorage.getItem('searchFilters') || '{}');
		inputMinPrice.value = filters.minPrice || '20000';
		inputMaxPrice.value = filters.maxPrice || '900000';

		checkboxes.forEach((checkbox) => {
			checkbox.checked = filters.employers.includes(checkbox.name);
		});
	};

	let submitFilters = $state(() => {
		validateFilters();
		saveFiltersToStorage();
		window.location.href = `/search/jobs?q=${query}&&salary=${salary}&company=${companiesStringified}`;
	});

	const saveFiltersToStorage = () => {
		const filters = {
			minPrice: inputMinPrice.value,
			maxPrice: inputMaxPrice.value,
			employers: checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.name)
		};
		localStorage.setItem('searchFilters', JSON.stringify(filters));
	};

	const validateFilters = () => {
		if (parseInt(inputMinPrice.value) < 20_000 || isNaN(parseInt(inputMinPrice.value))) {
			inputMinPrice.value = '20000';
		} else if (parseInt(inputMinPrice.value) > 899_999) {
			inputMinPrice.value = '899999';
		}

		if (
			parseInt(inputMaxPrice.value) > 900_000 ||
			parseInt(inputMaxPrice.value) < 20_001 ||
			isNaN(parseInt(inputMaxPrice.value))
		) {
			inputMaxPrice.value = '900000';
		}

		salary = [inputMinPrice.value, inputMaxPrice.value].join('-');
		companiesStringified = checkboxes
			.filter((el) => el.checked)
			.map((el) => el.name)
			.join('-');
	};

	const resetFilters = () => {
		checkboxes.forEach((el) => {
			el.checked = false;
		});

		inputMinPrice.value = '20000';
		inputMaxPrice.value = '900000';
	};

	onMount(() => {
		checkboxes = [...document.getElementsByTagName('input')].filter((el) => el.type === 'checkbox');
		try {
			loadFiltersFromStorage();
		} catch (e) {
			console.log('no search filters saved yet');
		}
	});
</script>

<section class="flex h-max min-w-[12%] flex-col items-center gap-y-6 rounded-xl bg-white p-4 pb-10">
	<section class="flex w-full flex-col gap-y-4">
		<span class="font-bold">Заработная плата</span>
		<section class="flex w-full justify-between">
			<input
				type="number"
				name="min-price"
				id="min-price"
				bind:this={inputMinPrice}
				class="w-[45%] rounded-lg border border-gray-200 p-2 text-sm placeholder:text-xs"
				placeholder="От 20 000 руб"
			/>
			<input
				type="number"
				name="max-price"
				id="max-price"
				bind:this={inputMaxPrice}
				class="w-[45%] rounded-lg border border-gray-200 p-2 text-sm placeholder:text-xs"
				placeholder="До 900 000 руб"
			/>
		</section>
	</section>
	<section
		class="flex h-48 w-full flex-col gap-y-4 overflow-y-scroll"
		bind:this={companiesCheckboxContainer}
	>
		<span class="font-bold">Производители</span>
		{#each companiesArray as company}
			<section class="flex w-full items-center gap-x-4">
				<input
					type="checkbox"
					name={company}
					id={company}
					class="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
				/>
				<label for={company} class="text-sm">{company}</label>
			</section>
		{/each}
	</section>
	<section class="flex w-full flex-col items-center gap-y-2">
		<button class="w-[98%] rounded-lg bg-blue-600 px-10 py-3 text-white" on:click={submitFilters}>
			Применить
		</button>
		<button
			class="w-[98%] rounded-lg border border-gray-300 px-10 py-3 text-gray-600"
			on:click={resetFilters}
		>
			Сбросить
		</button>
	</section>
</section>
