<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let { data, query } = $props();

	let companiesCheckboxContainer: HTMLElement;
	let checkboxes: HTMLInputElement[];

	let companiesArray = new Set<string>(data.map((x: any) => x.suppliers.companyname));

	let url = $page.url.searchParams;

	let searchType = '';
	let producttype = writable(url.get('type') || searchType);

	let suppliersStringified: string = '';
	let inStock: string;
	let rating: string;
	let price: string;

	const loadFiltersFromStorage = () => {
		const filters = JSON.parse(localStorage.getItem('searchFilters') || '{}');
		inputInStock.checked = filters.inStock === 'true';
		inputRating.checked = filters.rating === 'good';
		inputMinPrice.value = filters.minPrice || '50';
		inputMaxPrice.value = filters.maxPrice || '500000';
		searchType = filters.searchType || 'SMARTPHONE';

		checkboxes.forEach((checkbox) => {
			checkbox.checked = filters.suppliers.includes(checkbox.name);
		});
	};

	const saveFiltersToStorage = () => {
		const filters = {
			inStock: inputInStock.checked.toString(),
			rating: inputRating.checked.toString(),
			minPrice: inputMinPrice.value,
			maxPrice: inputMaxPrice.value,
			suppliers: checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.name),
			searchType
		};
		localStorage.setItem('searchFilters', JSON.stringify(filters));
	};

	const validateFilters = () => {
		if (parseInt(inputMinPrice.value) < 50 || isNaN(parseInt(inputMinPrice.value))) {
			inputMinPrice.value = '50';
		} else if (parseInt(inputMinPrice.value) > 499_999) {
			inputMinPrice.value = '499999';
		}

		if (
			parseInt(inputMaxPrice.value) > 500_000 ||
			parseInt(inputMaxPrice.value) < 51 ||
			isNaN(parseInt(inputMaxPrice.value))
		) {
			inputMaxPrice.value = '500000';
		}

		inStock = inputInStock.checked === true ? 'true' : 'all';
		price = [inputMinPrice.value, inputMaxPrice.value].join('-');
		rating = inputRating.checked === true ? 'good' : 'all';
		suppliersStringified = checkboxes
			.filter((el) => el.checked)
			.map((el) => el.name)
			.join('-');
	};

	const resetFilters = () => {
		checkboxes.forEach((el) => {
			el.checked = false;
		});

		inputMinPrice.value = '50';
		inputMaxPrice.value = '500000';
	};

	$: submitFilters = () => {
		validateFilters();
		saveFiltersToStorage();
		window.location.href = `/search/products?q=${query}&inStock=${inStock}&rating=${rating}&price=${price}&brand=${suppliersStringified}&type=${$producttype}`;
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
	<section class="flex w-full items-center gap-x-4">
		<input
			type="checkbox"
			name="stock"
			id="stock"
			bind:this={inputInStock}
			class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
		/>
		<label for="stock">В наличии</label>
	</section>
	<section class="flex w-full items-center gap-x-4">
		<input
			type="checkbox"
			name="rating"
			id="rating"
			bind:this={inputRating}
			class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
		/>
		<label for="rating">Рейтинг 4 и выше</label>
	</section>
	<section class="flex w-full flex-col gap-y-4">
		<span class="font-bold">Цена</span>
		<section class="flex w-full justify-between">
			<input
				type="number"
				name="min-price"
				id="min-price"
				bind:this={inputMinPrice}
				class="w-[45%] rounded-lg border border-gray-200 p-2 text-sm placeholder:text-xs"
				placeholder="От 50"
			/>
			<input
				type="number"
				name="max-price"
				id="max-price"
				bind:this={inputMaxPrice}
				class="w-[45%] rounded-lg border border-gray-200 p-2 text-sm placeholder:text-xs"
				placeholder="До 500 000"
			/>
		</section>
	</section>
	<section
		class="flex h-48 w-full flex-col gap-y-4 overflow-y-scroll"
		bind:this={companiesCheckboxContainer}
	>
		<span class="font-bold">Производители</span>
		{#each suppliersArray as supplier}
			<section class="flex w-full items-center gap-x-4">
				<input
					type="checkbox"
					name={supplier}
					id={supplier}
					class="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
				/>
				<label for={supplier} class="text-sm">{supplier}</label>
			</section>
		{/each}
	</section>
	<section class="flex w-full flex-col gap-y-4">
		<span class="w-full font-bold">Категория продукта</span>
		<select
			name="product-type"
			id="product-type"
			bind:value={searchType}
			on:change={() => {
				producttype.set(searchType);
			}}
			class="w-full rounded-md p-4"
		>
			<option value="SMARTPHONE" selected>Смартфон</option>
			<option value="TABLET">Планшет</option>
			<option value="CELLPHONE">Сотовый телефон</option>
			<option value="CABLE">Кабель</option>
			<option value="CHARGER">Зарядное устройство</option>
			<option value="WATCH">Часы</option>
			<option value="PLAYER">Плеер</option>
			<option value="HEADPHONE">Наушники</option>
		</select>
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
