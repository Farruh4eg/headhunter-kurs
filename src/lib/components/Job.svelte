<script lang="ts">
  import {
    addSpaceInString,
  } from '$lib/utils/helpers';
  import ButtonLike from './ButtonLike.svelte';
  import ButtonApply from './ButtonApply.svelte';
  import { session } from '$lib/session';
  import { onMount } from 'svelte';

  let {job, user_id} = $props()

  let isLoggedIn: boolean = $state($session.isLoggedIn);
  let notice = '';

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
  class="flex w-[1280px] my-0 mx-auto box-border p-8 text-gray-700 flex-col gap-y-10 items-end"
>
  <section class="w-full bg-white p-6 text-gray-700 rounded-xl">
    <section class="flex">
      <section class="flex flex-col w-[600px] px-10 gap-y-4">
        <section class="flex w-full h-24 items-start justify-start">
          <section class="flex w-full">
            <h1 class="pb-4 flex items-end gap-x-4 flex-wrap overflow-hidden">
              <section
                class="font-bold text-3xl w-max flex flex-wrap text-wrap"
              >
                <span class="flex text-wrap flex-wrap">
                  {jobTitle}
                </span>
              </section>
              <a
                class="no-underline text-blue-600 hover:cursor-pointer"
                on:click={() =>
                  document.getElementById('specs')?.scrollIntoView({
                    behavior: 'smooth',
                  })}>подробнее</a
              >
            </h1>
          </section>
        </section>
        <section class="mt-4 w-full rounded-lg flex gap-x-4">
          <section
            class="flex items-end gap-x-1 w-full py-4 pl-4 pr-8 bg-gray-100 bg-opacity-80 rounded-lg"
          >
            <span class="font-semibold text-2xl text-blue-600"
              >{jobSalary} &#8381;</span
            >
          </section>
          {#if isLoggedIn}
            <section class="flex gap-x-4 items-end">
              <ButtonLike {user_id} {job_id} />
              <ButtonApply {user_id} {job_id} />
            </section>
          {/if}
        </section>
        
        <section class="flex justify-start mx-1">
          <a href="/search/jobs?q=&company={jobEmployerCompany}">
            <img
              src="/companies/{jobEmployerLogo}"
              alt="employer-logo"
              class="h-full"
            />
          </a>
        </section>
      </section>
    </section>
  </section>
  <section
    class="flex flex-col w-2/3 bg-white rounded-lg p-4 gap-y-4 mx-auto"
    id="specs"
  >
    <p>{jobDescription}</p>
  </section>
</section>
