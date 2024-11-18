<script lang="ts">
	import { onMount } from 'svelte';

	let { data, query } = $props();

	let companiesCheckboxContainer: HTMLElement;
	let checkboxes: HTMLInputElement[];
	let inputMinSalary: HTMLInputElement;
	let inputMaxSalary: HTMLInputElement;
	let inputExperience: HTMLInputElement;

	let companiesArray = new Set<string>(data.map((x: any) => x.employers.company));

	let companiesStringified: string = '';
	let salary: string;

	const loadFiltersFromStorage = () => {
		const filters = JSON.parse(localStorage.getItem('searchFilters') || '{}');
		inputMinSalary.value = filters.minPrice || '20000';
		inputMaxSalary.value = filters.maxPrice || '900000';
		inputExperience.value = filters.experience || '0';

		checkboxes.forEach((checkbox) => {
			checkbox.checked = filters.employers.includes(checkbox.name);
		});
	};

	let submitFilters = $state(() => {
		validateFilters();
		saveFiltersToStorage();
		window.location.href = `/search/jobs?q=${query}&&salary=${salary}&company=${companiesStringified}&experience=${inputExperience.value}`;
	});

	const saveFiltersToStorage = () => {
		const filters = {
			minPrice: inputMinSalary.value,
			maxPrice: inputMaxSalary.value,
			employers: checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.name),
			experience: inputExperience.value
		};
		localStorage.setItem('searchFilters', JSON.stringify(filters));
	};

	const validateFilters = () => {
		if (parseInt(inputMinSalary.value) < 20_000 || isNaN(parseInt(inputMinSalary.value))) {
			inputMinSalary.value = '20000';
		} else if (parseInt(inputMaxSalary.value) > 900_000) {
			inputMinSalary.value = '900000';
		}

		salary = [inputMinSalary.value, inputMaxSalary.value].join('-');
		companiesStringified = checkboxes
			.filter((el) => el.checked)
			.map((el) => el.name)
			.join('-');

		if (parseInt(inputExperience.value) < 0 || isNaN(parseInt(inputExperience.value))) {
			inputExperience.value = '0';
		} else if (parseInt(inputExperience.value) > 60) {
			inputExperience.value = '60';
		}
	};

	const resetFilters = () => {
		checkboxes.forEach((el) => {
			el.checked = false;
		});

		inputMinSalary.value = '20000';
		inputMaxSalary.value = '900000';
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
		<section class="flex w-full items-center justify-between gap-x-2">
			<span>От</span>
			<input
				type="number"
				name="min-price"
				id="min-price"
				bind:this={inputMinSalary}
				class="w-[40%] rounded-lg border border-gray-200 p-2 text-sm placeholder:text-xs"
				placeholder="От 20 000 руб"
			/>
			<span>До</span>
			<input
				type="number"
				name="max-price"
				id="max-price"
				bind:this={inputMaxSalary}
				class="w-[40%] rounded-lg border border-gray-200 p-2 text-sm placeholder:text-xs"
				placeholder="До 900 000 руб"
			/>
		</section>
	</section>
	<section
		class="flex h-48 w-full flex-col gap-y-4 overflow-y-scroll border-2 border-gray-200 p-2"
		bind:this={companiesCheckboxContainer}
	>
		<span class="font-bold">Компании</span>
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
	<section class="flex w-full flex-col gap-y-4">
		<span class="font-bold">Опыт работы (в годах)</span>
		<input
			type="number"
			name="experience"
			id="experience"
			min="0"
			max="60"
			bind:this={inputExperience}
			class="w-[40%] rounded-lg border border-gray-200 p-2 text-sm placeholder:text-xs"
		/>
	</section>
	<section class="flex w-full flex-col items-center gap-y-2">
		<button class="w-[98%] rounded-lg bg-blue-600 px-10 py-3 text-white" onclick={submitFilters}>
			Применить
		</button>
		<button
			class="w-[98%] rounded-lg border border-gray-300 px-10 py-3 text-gray-600"
			onclick={resetFilters}
		>
			Сбросить
		</button>
	</section>
</section>
