<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let usersButton: HTMLButtonElement,
		productsButton: HTMLButtonElement,
		suppliersButton: HTMLButtonElement;

	let pathname: string;
	$: pathname = $page.url.pathname;

	onMount(() => {
		if (pathname.includes('users')) {
			usersButton.disabled = true;
		} else if (pathname.includes('jobs')) {
			productsButton.disabled = true;
		} else if (pathname.includes('companies')) {
			suppliersButton.disabled = true;
		}
	});
</script>

<slot />
<section>
	<section class="my-8 flex w-full justify-center gap-x-4">
		<section class="sticky flex gap-x-4">
			<button
				class="rounded-md border border-gray-400 bg-white px-6 py-4 disabled:bg-blue-600 disabled:text-white"
				bind:this={usersButton}
				on:click={() => (window.location.href = '/admin/users')}>Пользователи</button
			>
			<button
				class="rounded-md border border-gray-400 bg-white px-6 py-4 disabled:bg-blue-600 disabled:text-white"
				bind:this={productsButton}
				on:click={() => (window.location.href = '/admin/jobs/edit')}>Товары</button
			>
			<button
				class="rounded-md border border-gray-400 bg-white px-6 py-4 disabled:bg-blue-600 disabled:text-white"
				bind:this={suppliersButton}
				on:click={() => (window.location.href = '/admin/companies/edit')}>Поставщики</button
			>
		</section>
	</section>
</section>
