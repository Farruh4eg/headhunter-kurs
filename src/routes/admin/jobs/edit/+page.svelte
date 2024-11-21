<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { debounce } from '$lib/utils/helpers.js';
	let { data } = $props();

	let searchValue: string = $state('');
	let url = $page.url.searchParams;
	let pageN: Writable<number> = writable(parseInt(url.get('page') || '1'));
	let totalPages = writable(1);
	let jobs: Writable<any> = writable([]);
	let newJobs: Record<string, any> = {};

	const updateNewValue = (job_id: number, header: string, value: any) => {
		if (!newJobs[job_id]) {
			newJobs[job_id] = {};
		}
		newJobs[job_id][header] = value;
	};

	const deleteJob = async (job_id: number) => {
		const response = await fetch(`/v1/jobs?q=${job_id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			window.location.href = '/admin/jobs/edit';
		}
	};

	const saveChanges = async () => {
		const requestBody = newJobs;
		try {
			const response = await fetch('/v1/jobs', {
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

	let tableHeaders: string[] = [
		'job_id',
		'title',
		'description',
		'salary',
		'experience',
		'employer_id',
		'Действие'
	];

	let defaultProducts: Record<string, any> = {};

	const _fetchJobData = async () => {
		const response = await fetch(`/v1/jobs?q=${searchValue}&page=${$pageN}`);
		const { jobs: resJobs, totalPages: resTotalPages } = await response.json();
		jobs.set(resJobs);
		resJobs.forEach((el: Record<string, any>) => {
			defaultProducts[el.job_id] = el;
		});
		totalPages.set(resTotalPages);
	};

	const debouncedFetchData = debounce(_fetchJobData, 400);

	onMount(async () => {
		await _fetchJobData();
	});

	$effect(() => {
		searchValue = searchValue.replaceAll(/['"`;%|]/g, '');
	});

	$effect(() => {
		totalPages.set(data.jobs.totalPages);
	});
</script>

<section class="mt-4 flex w-full justify-center gap-x-4">
	<input
		type="text"
		name="search-job"
		id="search-job"
		placeholder="Введите данные для поиска"
		class="box-border h-12 w-96 border border-gray-500 bg-white p-2 text-sm hover:border"
		bind:value={searchValue}
		oninput={() => {
			debouncedFetchData();
		}}
	/>
</section>
<section class="flex w-full justify-center">
	<section class="flex w-full justify-center overflow-x-scroll">
		<table class="mt-10 border-collapse border border-gray-300 bg-white">
			<thead>
				<tr>
					<th class="border border-gray-300 bg-gray-300 px-4 py-2 text-left"></th>
					{#if $jobs}
						{#each $jobs as job (job.job_id)}
							<th class="border border-gray-300 px-4 py-2 text-left">{job.title}</th>
						{/each}
					{/if}
				</tr>
			</thead>
			<tbody>
				{#if tableHeaders}
					{#each tableHeaders as header}
						<tr>
							<td class="border border-gray-300 px-4 py-2">{header}</td>
							{#if $jobs}
								{#each $jobs as job}
									<td class="border border-gray-300 px-4 py-2">
										{#if header === 'experience' || header === 'salary' || header === 'employer_id'}
											<input
												type="number"
												min={header === 'experience' || header === 'employer_id' ? 0 : 20_000}
												max={header === 'experience'
													? 60
													: header === 'salary'
														? 900_000
														: Infinity}
												bind:value={job[header]}
												onchange={() => updateNewValue(job.job_id, header, job[header])}
											/>
										{:else if header !== 'Действие'}
											<input
												type="text"
												bind:value={job[header]}
												onchange={() => updateNewValue(job.job_id, header, job[header])}
												disabled={header === 'job_id'}
											/>
										{:else}
											<a
												class={'px-4 py-2 text-left font-bold text-red-600 hover:cursor-pointer'}
												onclick={() => deleteJob(job.job_id)}>Удалить</a
											>
										{/if}
									</td>
								{/each}
							{/if}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</section>
</section>

<section class="mt-16 flex h-max justify-center gap-x-24">
	<button
		class="text-lg font-semibold text-blue-600 disabled:text-gray-600"
		disabled={$pageN === 1}
		onclick={() => {
			$pageN--;
			_fetchJobData();
		}}>Назад</button
	>
	<button
		class="text-lg font-semibold text-blue-600 disabled:text-gray-600"
		disabled={$pageN === $totalPages}
		onclick={() => {
			$pageN++;
			_fetchJobData();
		}}>Вперед</button
	>
	<button class="rounded-lg bg-blue-600 px-8 py-4 text-white" onclick={saveChanges}
		>Сохранить изменения</button
	>
</section>
