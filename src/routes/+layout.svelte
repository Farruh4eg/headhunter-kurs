<script lang="ts">
	import '../app.css';
	import { session } from '$lib/session';
	import { onDestroy } from 'svelte';
	import { preventDefault } from 'svelte/legacy';
	let { children, data } = $props();

	let isLoggedIn: boolean = $state($session.isLoggedIn);
	let role: string = $state(data?.userInfo?.role);

	let usernameInput: HTMLInputElement;
	let showPassword = $state(false);
	let passwordInput: HTMLInputElement;

	let errorElement: HTMLParagraphElement;
	let loginDialog: HTMLDialogElement;

	let searchElement: HTMLInputElement;
	async function submitForm() {
		const username = usernameInput;
		const password = passwordInput.value;

		const response = await fetch('/v1/login', {
			method: 'POST',
			credentials: 'same-origin',
			body: JSON.stringify({ username, password }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			session.set({
				isLoggedIn: true
			});
			window.location.href = '/';
		} else if (response.status === 401) {
			errorElement.textContent = 'Неверный логин или пароль';
		} else if (response.status === 404) {
			errorElement.textContent = 'Пользователя не существует';
		}
	}

	function showDialog() {
		loginDialog.showModal();
	}

	function handleDialogClick(event: MouseEvent) {
		if (event.target === loginDialog && !loginDialog.contains(event.relatedTarget as Node)) {
			loginDialog.close();
		}
	}

	function handleRegisterClick() {
		window.location.href = `/register/`;
	}

	function handleShowPassword() {
		switch (passwordInput.type) {
			case 'password':
				passwordInput.type = 'text';
				break;
			case 'text':
				passwordInput.type = 'password';
		}
		showPassword = !showPassword;
	}

	async function handleLogout() {
		const response = await fetch('/v1/logout', {
			method: 'POST',
			headers: {
				credentials: 'same-origin'
			}
		});
		if (response.ok) {
			session.set({
				isLoggedIn: false
			});
			window.location.href = '/';
		}
	}

	$effect(() => {
		if (isLoggedIn) {
			session.set({
				isLoggedIn: true
			});
		}
	});

	const sessionUnsubscribe = session.subscribe((value: { isLoggedIn: boolean }) => {
		isLoggedIn = value.isLoggedIn;
	});

	onDestroy(() => {
		sessionUnsubscribe();
	});
</script>

<nav
	class="sticky z-[1000] flex h-28 w-full content-center items-center justify-evenly gap-x-4 bg-white p-2 2xl:mx-auto 2xl:my-0 2xl:justify-center"
>
	<a
		href="/"
		class="h-max w-36 rounded-xl bg-blue-600 p-5 text-center text-gray-200 transition-opacity hover:opacity-80"
		data-sveltekit-reload>Главная</a
	>
	<search class="relative flex justify-center gap-x-1">
		<form
			autocomplete="off"
			onsubmit={() => {
				window.location.href = `/search/jobs?q=${searchElement.value.trim()}&page=1`;
			}}
			class="flex w-full content-center items-center justify-center gap-x-2"
		>
			<input
				required
				bind:this={searchElement}
				type="search"
				placeholder="Поиск вакансий"
				class="relative box-border h-16 w-96 rounded-xl bg-gray-100
        p-5 text-sm transition-all hover:border hover:border-gray-100 hover:bg-white hover:shadow-xl"
				id="search"
				name="q"
			/>
			<button
				class="z-10 -ml-16 flex h-max w-12 content-center items-center justify-center rounded-lg py-3 hover:bg-gray-200"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="gray"
					class="h-5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
					/>
				</svg>
			</button>
		</form>
	</search>
	<section class="flex justify-around">
		{#if isLoggedIn}
			<a
				href="/saved/"
				data-sveltekit-reload
				class="flex min-w-[5rem] scale-90 flex-col rounded-lg p-5 text-center text-gray-500 transition-colors hover:bg-gray-100"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="blue"
					fill="none"
					class="relative h-7"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
					/>
				</svg>
				Избранное</a
			>
			<a
				href="/applications/"
				data-sveltekit-reload
				class="flex min-w-[5rem] scale-90 flex-col rounded-lg p-5 text-center text-gray-500 transition-colors hover:bg-gray-100"
				><svg
					class="relative h-7"
					fill="#0000FA"
					version="1.1"
					id="Capa_1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 925 925"
					xml:space="preserve"
					stroke="#0000FA"
					><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"
					></g><g id="SVGRepo_iconCarrier">
						<g>
							<g>
								<path
									d="M352.9,53.4H441.6c33.601,0,61.601,24,68,55.7H560.2C553.4,49.7,502.8,3.4,441.6,3.4H352.9 c-61.2,0-111.8,46.3-118.601,105.7H284.9C291.3,77.3,319.3,53.4,352.9,53.4z"
								></path>
								<path
									d="M127.2,322.4c71.8,46.4,167.7,72,270.1,72c102.4,0,198.2-25.6,270.101-72C732,280.7,769.5,226.8,774.1,169.7 C756.8,148,730.2,134.1,700.2,134.1H561h-50H283.6h-50H94.4c-29.9,0-56.6,13.9-73.9,35.6C25.1,226.8,62.6,280.6,127.2,322.4z"
								></path>
								<path
									d="M363.1,461.1c0,15.601,12.7,28.3,28.301,28.3H403.1c15.601,0,28.301-12.699,28.301-28.3v-22.6H363.1V461.1L363.1,461.1z"
								></path>
								<path
									d="M94.4,617.201h419.5V553.5c0-7.699,3.1-15,8.6-20.4L618.2,439c5.399-5.3,12.6-8.2,20.1-8.2h156.2V243 c-4.2,8.6-9,17.1-14.5,25.5c-21.5,32.9-52.2,62.3-91,87.4c-60.3,39-135.8,64.4-217.6,74.1v8.399V461 c0,37.701-30.601,68.3-68.301,68.3H391.4c-37.7,0-68.301-30.6-68.301-68.3V438.4V430c-81.8-9.601-157.3-35.101-217.6-74.1 c-38.8-25.1-69.5-54.5-91-87.4C9,260.1,4.2,251.6,0,243v279.8C0,574.9,42.3,617.201,94.4,617.201z"
								></path>
								<g>
									<path
										d="M659.6,453.6c-13.399,0-26.5,5.5-36,15l-69.1,69.602c-9.5,9.6-14.7,22.199-14.7,35.699v43.301v12.5v12.5V870.9 c0,2.4,0.2,4.801,0.5,7.1c3.4,24.6,24.601,43.6,50.2,43.6h283.8c27.9,0,50.7-22.699,50.7-50.699V504.201 c0-24.5-17.4-44.901-40.5-49.601c-3.3-0.7-6.7-1-10.1-1h-54.9H807h-12.5H659.6L659.6,453.6z M819.5,503.6h54.8 c0.4,0,0.7,0.301,0.7,0.701V871c0,0.1,0,0.1,0,0.201c-0.1,0.299-0.3,0.5-0.6,0.5c0,0,0,0-0.101,0H590.5 c-0.4,0-0.7-0.301-0.7-0.701V642.201v-12.5v-12.5v-33h36.7c22.9,0,41.5-18.602,41.5-41.5V503.6h126.5H807H819.5L819.5,503.6z"
									></path>
									<path
										d="M750,617.301H641.1c-9.199,0-17.199,5-21.6,12.4c-2.2,3.699-3.4,7.898-3.4,12.5v0.1c0,13.799,11.2,25,25,25h182.7 c13.8,0,25-11.201,25-25c0-13.801-11.2-25-25-25h-50.7H750z"
									></path>
									<path
										d="M823.8,774.801H641.1c-13.8,0-25,11.199-25,25c0,13.799,11.2,25,25,25h182.7c13.8,0,25-11.201,25-25 C848.8,786,837.6,774.801,823.8,774.801z"
									></path>
									<path
										d="M823.8,696.1H641.1c-13.8,0-25,11.201-25,25c0,13.801,11.2,25,25,25h182.7c13.8,0,25-11.199,25-25 C848.8,707.301,837.6,696.1,823.8,696.1z"
									></path>
								</g>
							</g>
						</g>
					</g></svg
				>
				Отклики</a
			>
		{/if}
		{#if !isLoggedIn}
			<a
				href="/register"
				class="flex min-w-[5rem] scale-90 flex-col rounded-lg p-5 text-center text-gray-500 transition-colors hover:bg-gray-100"
				data-sveltekit-reload
				><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000" class="h-7"
					><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"
					></g><g id="SVGRepo_iconCarrier">
						<title>i</title>
						<g id="Complete">
							<g id="user-add">
								<g>
									<path
										d="M17,21V19a4,4,0,0,0-4-4H5a4,4,0,0,0-4,4v2"
										fill="none"
										stroke="#0000FF"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.9440000000000002"
									></path>
									<circle
										cx="9"
										cy="7"
										r="4"
										fill="none"
										stroke="#0000FF"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.9440000000000002"
									></circle>
									<line
										x1="17"
										y1="11"
										x2="23"
										y2="11"
										fill="none"
										stroke="#0000FF"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.9440000000000002"
									></line>
									<line
										x1="20"
										y1="8"
										x2="20"
										y2="14"
										fill="none"
										stroke="#0000FF"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.9440000000000002"
									></line>
								</g>
							</g>
						</g>
					</g></svg
				>Регистрация</a
			>
			<button
				class="flex min-w-[5rem] scale-90 flex-col rounded-lg p-5 text-center text-gray-500 transition-colors hover:bg-gray-100"
				onclick={showDialog}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="blue"
					class="h-7"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
					/>
				</svg>
				Войти</button
			>
		{:else if isLoggedIn}
			<a
				class="flex min-w-[5rem] scale-90 flex-col rounded-lg p-5 text-center text-gray-500 transition-colors hover:bg-gray-100"
				href="/profile/"
				data-sveltekit-reload
				><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="blue"
					class="h-7"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
					/>
				</svg>
				{data?.userInfo?.username}</a
			>
			{#if role === 'admin' || role === 'mod'}
				<a
					class="flex min-w-[5rem] scale-90 flex-col rounded-lg p-5 text-center text-gray-500 transition-colors hover:bg-gray-100"
					href="/admin/users"
					data-sveltekit-reload
					><svg
						fill="#0000FF"
						class="h-7"
						version="1.1"
						id="Layer_1"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 512 512"
						xml:space="preserve"
						stroke="#0000FF"
						><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
							id="SVGRepo_tracerCarrier"
							stroke-linecap="round"
							stroke-linejoin="round"
						></g><g id="SVGRepo_iconCarrier">
							<g>
								<g>
									<path
										d="M235.082,392.745c-5.771,0-10.449,4.678-10.449,10.449v4.678c0,5.771,4.678,10.449,10.449,10.449 c5.77,0,10.449-4.678,10.449-10.449v-4.678C245.531,397.423,240.853,392.745,235.082,392.745z"
									></path>
								</g>
							</g>
							<g>
								<g>
									<path
										d="M492.948,313.357l-31.393-25.855c1.58-10.4,2.38-20.968,2.38-31.502c0-10.534-0.8-21.104-2.381-31.504l31.394-25.856 c10.032-8.262,12.595-22.42,6.099-33.66L456.35,91.029c-4.704-8.173-13.479-13.25-22.903-13.25c-3.19,0-6.326,0.573-9.302,1.695 l-38.109,14.274c-16.546-13.286-34.848-23.869-54.55-31.54l-6.683-40.082C322.676,9.306,311.701,0,298.704,0h-85.408 C200.3,0,189.324,9.307,187.2,22.119l-6.684,40.088c-19.703,7.673-38.007,18.255-54.553,31.542L87.898,79.492 c-2.999-1.138-6.14-1.715-9.338-1.715c-9.414,0-18.191,5.074-22.903,13.241l-42.702,73.96 c-6.499,11.244-3.935,25.403,6.097,33.664l31.394,25.855c-1.58,10.4-2.38,20.969-2.38,31.503c0,10.534,0.8,21.103,2.38,31.503 l-31.394,25.856c-10.032,8.262-12.595,22.42-6.099,33.66l42.703,73.963c4.716,8.171,13.492,13.247,22.904,13.247 c3.205,0,6.352-0.581,9.294-1.703l38.107-14.275c16.547,13.287,34.85,23.87,54.551,31.541l6.682,40.075 C189.316,502.692,200.293,512,213.297,512h85.408c12.991,0,23.967-9.304,26.096-22.118l6.683-40.089 c19.705-7.673,38.008-18.255,54.554-31.542l38.07,14.261c2.999,1.137,6.141,1.713,9.336,1.713c9.411,0,18.185-5.074,22.9-13.241 l42.703-73.962C505.543,335.776,502.979,321.619,492.948,313.357z M298.704,491.102H245.53v-49.427 c0-5.771-4.678-10.449-10.449-10.449c-5.771,0-10.449,4.678-10.449,10.449v49.427h-10.922V376.504 c13.606,4.844,28.061,7.375,42.865,7.382c0.003,0,0.066,0,0.07,0c14.852,0,29.325-2.528,42.928-7.376v114.515h0.001 C299.289,491.069,299,491.102,298.704,491.102z M256.642,362.988h-0.057c-58.964-0.029-106.933-48.026-106.932-106.99 c0.001-34.314,16.175-65.814,43.158-85.745v76.229c0,3.671,1.926,7.072,5.073,8.96l53.381,32.027 c3.309,1.984,7.443,1.984,10.752,0l53.381-32.027c3.147-1.889,5.073-5.29,5.073-8.96v-76.229 c26.983,19.931,43.159,51.432,43.157,85.747c0,28.528-11.143,55.382-31.374,75.614 C312.022,351.846,285.169,362.988,256.642,362.988z M480.949,336.57l-42.705,73.965c-1.326,2.296-4.122,3.423-6.769,2.42 l-43.772-16.397c-3.557-1.331-7.555-0.63-10.444,1.834c-16.925,14.428-36.026,25.589-56.79,33.212v-64.779 c9.585-5.551,18.513-12.386,26.56-20.434c24.179-24.18,37.495-56.281,37.495-90.391c0.001-48.242-26.729-91.831-69.76-113.754 c-3.239-1.651-7.103-1.498-10.203,0.401c-3.099,1.9-4.989,5.274-4.989,8.909v89.011l-42.932,25.759l-42.932-25.759v-89.011 c0-3.635-1.89-7.009-4.989-8.909c-3.099-1.899-6.963-2.05-10.203-0.401c-43.03,21.922-69.76,65.51-69.762,113.752 c-0.001,34.743,13.583,67.154,38.247,91.26c7.858,7.68,16.53,14.23,25.809,19.585v65.235 c-21.258-7.63-40.795-18.958-58.071-33.684c-1.922-1.638-4.333-2.497-6.78-2.497c-1.232,0-2.473,0.217-3.663,0.664l-43.83,16.419 c-0.613,0.234-1.255,0.353-1.905,0.353c-1.969,0-3.81-1.071-4.805-2.796l-42.706-73.968c-1.365-2.361-0.822-5.337,1.288-7.076 L68.389,299.8c2.926-2.411,4.318-6.216,3.635-9.944c-2.03-11.12-3.061-22.509-3.061-33.856c0-11.346,1.03-22.736,3.063-33.854 c0.681-3.729-0.709-7.535-3.636-9.944l-36.051-29.691c-2.112-1.74-2.654-4.716-1.287-7.08l42.705-73.966 c1.323-2.294,4.109-3.429,6.769-2.419l43.772,16.396c3.555,1.33,7.554,0.63,10.444-1.833 c17.417-14.847,37.129-26.244,58.589-33.876c3.576-1.272,6.182-4.382,6.805-8.126l7.679-46.059 c0.446-2.694,2.752-4.649,5.482-4.649h85.408c2.73,0,5.036,1.955,5.485,4.656l7.679,46.053c0.624,3.744,3.23,6.856,6.806,8.126 c21.459,7.631,41.17,19.027,58.586,33.874c2.89,2.463,6.888,3.165,10.444,1.833l43.794-16.405c0.631-0.238,1.287-0.358,1.95-0.358 c1.97,0,3.805,1.064,4.798,2.789l42.706,73.967c1.365,2.361,0.822,5.337-1.288,7.076l-36.052,29.692 c-2.926,2.411-4.318,6.215-3.635,9.944c2.03,11.118,3.061,22.509,3.061,33.855c0,11.346-1.03,22.735-3.063,33.853 c-0.681,3.728,0.709,7.535,3.636,9.944l36.051,29.691C481.774,331.227,482.316,334.205,480.949,336.57z"
									></path>
								</g>
							</g>
						</g></svg
					>
					Управление</a
				>
			{/if}
			<a
				class="hover: flex min-w-[5rem] scale-90 cursor-pointer flex-col rounded-lg p-5 text-center text-gray-500 transition-colors hover:bg-gray-100"
				data-sveltekit-reload
				onclick={handleLogout}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="red"
					class="h-7"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
					/>
				</svg>

				Выйти</a
			>
		{/if}
	</section>
</nav>
<dialog
	id="loginDialog"
	bind:this={loginDialog}
	onclick={handleDialogClick}
	class="mx-auto mt-12 h-[36rem] w-[30rem] justify-center rounded-3xl shadow-lg"
>
	<form
		onsubmit={preventDefault(submitForm)}
		class="flex h-[36rem] w-full flex-col items-center justify-center gap-y-12 p-4"
		id="loginForm"
	>
		<h1 class="h-max text-3xl font-bold text-gray-700">Вход</h1>
		<section class="flex w-full flex-col items-center justify-center gap-y-2">
			<label for="username"> Логин </label>
			<input
				type="text"
				name="username"
				bind:value={usernameInput}
				class="box-content w-7/12 rounded-lg border border-gray-300 px-5 py-2 shadow-md"
				required
			/>
		</section>
		<section class="flex w-full flex-col items-center justify-center gap-y-2">
			<label for="password"> Пароль </label>
			<input
				type="password"
				name="password"
				class="relative box-content w-7/12 rounded-lg border border-gray-300 px-2 py-2 pr-8 shadow-md"
				bind:this={passwordInput}
				required
			/>
			<button
				class="absolute ml-[17rem] mt-8 bg-transparent"
				onclick={handleShowPassword}
				type="button"
			>
				{#if !showPassword}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6 hover:stroke-blue-600"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
				{:else if showPassword}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6 hover:stroke-blue-600"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
						/>
					</svg>
				{/if}
			</button>
		</section>
		<p bind:this={errorElement}></p>
		<button
			type="submit"
			class="mt-12 rounded-xl border border-gray-200 bg-white px-10 py-3 shadow-md hover:bg-blue-500 hover:text-white"
			>Вход</button
		>
		<p>
			Нет учетной записи? <a
				onclick={handleRegisterClick}
				class="text-blue-500 hover:cursor-pointer">Зарегистрируйтесь</a
			>
		</p>
	</form>
</dialog>

{@render children()}
