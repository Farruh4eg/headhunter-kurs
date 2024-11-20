<script lang="ts">
	import { addSpaceInString } from '$lib/utils/helpers';
	import ButtonLike from './ButtonLike.svelte';
	import ButtonApply from './ButtonApply.svelte';
	import { session } from '$lib/session';
	import { onMount } from 'svelte';

	let { job, user_id } = $props();

	let isLoggedIn: boolean = $state($session.isLoggedIn);

	let job_id = job.job_id;
	let jobTitle = job.title;
	let jobSalary = addSpaceInString(job.salary.toString());
	let jobEmployerCompany = job.employers.company;
	let jobEmployerLogo = job.employers.logo;
	let jobExperience = job.experience;
	let jobDescription = job.description;
</script>

<svelte:head>
	<title>
		{jobTitle}
	</title>
</svelte:head>

<section
	class="mx-auto my-0 box-border flex w-[1280px] flex-col items-end gap-y-10 p-8 text-gray-700"
>
	<section class="w-full rounded-xl bg-white p-6 text-gray-700">
		<section class="flex items-start justify-center">
			<section class="flex min-h-[60vh] w-[800px] flex-col gap-y-4 rounded-lg p-4 px-10 shadow-xl">
				<section class="flex w-full items-start justify-start">
					<section class="flex w-full items-center justify-between">
						<h1 class="flex flex-wrap items-end gap-x-4 overflow-hidden pb-4">
							<section class="flex w-max flex-wrap text-wrap text-3xl font-bold">
								<span class="flex flex-wrap text-wrap">
									{jobTitle}
								</span>
							</section>
						</h1>
						<section class="mx-1 flex flex-col items-center justify-center text-center">
							<a href="/search/jobs?q=&company={jobEmployerCompany}" class="flex w-max">
								<img src="/companies/{jobEmployerLogo}" alt="employer-logo" class="h-12" />
							</a>
							<a
								href="/search/jobs?q=&company={jobEmployerCompany}"
								class="max-w-40 text-wrap text-sm font-bold"
							>
								{jobEmployerCompany}
							</a>
						</section>
					</section>
				</section>
				<section class="flex w-full gap-x-4 rounded-lg">
					<section
						class="flex w-full items-center gap-x-4 rounded-lg py-4 pl-4 pr-8 font-semibold shadow-md"
					>
						<span>Заработная плата: от </span>
						<span class="text-2xl text-blue-600">{jobSalary} &#8381;</span>
					</section>
					{#if isLoggedIn}
						<section class="flex items-end gap-x-4">
							<ButtonLike {user_id} {job_id} />
							<ButtonApply {user_id} {job_id} />
						</section>
					{/if}
				</section>
				<section
					class="flex w-max items-center gap-x-4 rounded-lg py-4 pl-4 pr-8 font-semibold shadow-md"
				>
					<span>Требуемый опыт работы (в годах): </span>
					{#if jobExperience}
						<span>{jobExperience}</span>
					{:else}
						<span>не требуется</span>
					{/if}
				</section>
				<section class="flex w-2/3 flex-col gap-y-4 rounded-lg p-4" id="description">
					<h1 class="text-2xl font-bold">Описание вакансии</h1>
					<p class="text-lg">{jobDescription}</p>
				</section>
			</section>
		</section>
	</section>
</section>
