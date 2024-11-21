<script lang="ts">
	import type { EmployerInfo } from '$lib/utils/interfaces';
	import { onMount } from 'svelte';

	let job: Record<string, any> = {};
	let employers: EmployerInfo[] = $state([]);
	async function handleSubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		for (const field of formData) {
			console.log(field);
			if (field[0] === 'salary' || field[0] === 'experience' || field[0] === 'employer_id') {
				job[field[0]] = +field[1];
			} else {
				job[field[0]] = field[1];
			}
			const response = await fetch('/v1/jobs', {
				method: 'POST',
				body: JSON.stringify(job)
			});

			if (response.ok) {
				window.location.reload();
			}
		}
	}

	onMount(async () => {
		const response = await fetch('/v1/employers?q=-1');
		employers = await response.json();
	});
</script>

<form autocomplete="off" class="flex w-full justify-center p-4" onsubmit={handleSubmit}>
	<section class="flex w-1/2 flex-col gap-y-8">
		<input
			type="text"
			id="title"
			name="title"
			class="border p-4"
			placeholder="Название вакансии"
			required
		/>
		<input
			type="text"
			id="description"
			name="description"
			class="border p-4"
			placeholder="Описание вакансии"
			required
		/>
		<input
			type="number"
			min="20000"
			max="900000"
			id="salary"
			name="salary"
			class="border p-4"
			placeholder="Заработная плата (от 20 000 до 900 000 рублей)"
			required
		/>
		<input
			type="number"
			min="0"
			max="60"
			id="experience"
			name="experience"
			class="border p-4"
			placeholder="Требуемый опыт работы (в годах)"
		/>
		<select name="employer_id" id="employer_id" class="p-4">
			{#if Array.isArray(employers)}
				{#each employers as employer}
					<option value={employer.employer_id}>{employer.company}</option>
				{/each}
			{/if}
		</select>
		<button type="submit" class="w-max bg-blue-600 px-8 py-4 text-white">Добавить</button>
	</section>
</form>
