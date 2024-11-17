<script lang="ts">
	import ButtonLike from './ButtonLike.svelte';
	import { session } from '$lib/session.js';
	import { addSpaceInString } from '$lib/utils/helpers';
	import ButtonApply from './ButtonApply.svelte';

	let { job, user_id, job_id } = $props();

	let isLoggedIn = $state($session.isLoggedIn);

	let jobTitle = job.title;
	let jobSalary = addSpaceInString(job.salary.toString());
	let jobEmployerId = job.employers.employer_id;
	let jobEmployerCompany = job.employers.company;
	let jobEmployerLogo = job.employers.logo;
</script>

<section class="flex w-full rounded-lg bg-white p-5">
	<div class="relative flex h-52 w-64 justify-center">
		<img src="/companies/{jobEmployerLogo}" alt="thumb-{jobEmployerCompany}" />
	</div>

	<section class="flex w-full flex-col justify-between rounded-xl p-1">
		<a href="/jobs/{job_id}" class="h-max w-full pb-12 hover:text-blue-600">
			{jobTitle}
		</a>
		<section class="flex flex-col items-end justify-between p-1">
			<section class="flex w-full justify-between gap-x-4">
				<section class="flex w-full flex-col">
					<span class="text-sm text-gray-600 line-through"
						>{jobSalary}
						<p></p></span
					>
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
