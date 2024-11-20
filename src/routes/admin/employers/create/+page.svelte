<script lang="ts">
	import { onMount } from 'svelte';

	let employer: Record<string, any> = {};

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		for (const f of formData) {
			if (f[0] === 'logo') {
				if ((f[1] as File).name) {
					employer[f[0]] = (f[1] as File).name;
				}
			} else {
				employer[f[0]] = f[1];
			}
		}
		const response = await fetch('/v1/employers', {
			method: 'POST',
			body: JSON.stringify(employer)
		});

		if (response.ok) {
			window.location.reload();
		}
	};
</script>

<form
	autocomplete="off"
	class="flex w-full items-center justify-center p-4"
	on:submit={handleSubmit}
>
	<section class="mt-[5%] flex w-1/2 flex-col gap-y-8">
		<input
			type="text"
			name="companyname"
			required
			placeholder="companyname"
			class="p-2 placeholder:text-lg"
		/>

		<input
			type="file"
			name="logo"
			required
			accept=".jpg, .jpeg, .png, .webp"
			class="p-2 placeholder:text-lg"
		/>
		<button type="submit" class="w-max bg-blue-600 px-8 py-4 text-white">Добавить</button>
	</section>
</form>
