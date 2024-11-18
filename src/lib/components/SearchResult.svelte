<script lang="ts">
	import ButtonLike from './ButtonLike.svelte';
	import { session } from '$lib/session.js';
	import { addSpaceInString } from '$lib/utils/helpers';
	import ButtonApply from './ButtonApply.svelte';

	let { job, user_id = -1, job_id } = $props();

	let isLoggedIn = $state($session.isLoggedIn);

	let jobTitle = job.title;
	let jobSalary = addSpaceInString(job.salary.toString());
	let jobEmployerCompany = job.employers.company;
	let jobEmployerLogo = job.employers.logo;
</script>

<section
	class="flex w-full items-center rounded-lg border-2 border-gray-100 bg-white p-4 shadow-md"
>
	<div class="relative flex h-20 justify-center">
		<img src="/companies/{jobEmployerLogo}" alt="thumb-{jobEmployerCompany}" class="w-max" />
	</div>

	<section class="items-evenly flex w-full flex-col justify-between rounded-xl px-4 py-2">
		<a href="/jobs/{job_id}" class="h-max w-full text-lg font-bold hover:text-blue-600">
			{jobTitle}
		</a>
		<section class="flex flex-col items-end justify-between">
			<section class="flex w-full justify-between gap-x-4">
				<section class="flex w-full flex-col justify-center">
					<span class="text-2xl font-semibold text-blue-600">От {jobSalary} &#8381;</span>
				</section>
				{#if isLoggedIn}
					<section class="flex items-end gap-x-4">
						<ButtonLike {user_id} {job_id} />
						<ButtonApply {user_id} {job_id} />
					</section>
				{/if}
			</section>
		</section>
	</section>
</section>
