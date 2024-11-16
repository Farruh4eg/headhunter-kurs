<script lang="ts">
	import ButtonLike from './ButtonLike.svelte';
	import { session } from '$lib/session.js';

	let { job, user_id } = $props();

	let isLoggedIn: boolean;

	$effect(() => {
		isLoggedIn = $session.isLoggedIn;
	});

	// TODO: fix errors below

	let jobId = job.job_id;
	let jobTitle = job.title;
	let productInStock: boolean = product.instock;
	let productDiscountAvailable: boolean = product.discountavailable;
	let productDiscountAmount = product.discount;
	let productRatingsArray: number[] = [];

	product.ratings.forEach((element: Rating) => {
		productRatingsArray.push(element.rating);
	});
	const sum = productRatingsArray.reduce((a, b) => a + b, 0);
	const count = productRatingsArray.length;
	const avg = sum / count || 0;
	let productType = deviceEnumValueToString(product.producttype);
	let productDisplaySize = product.displaysize + '' || '';
	let productPrice = product.price;
	let productPriceString = addSpaceInString(product.price.toString());
	let productPriceWithDiscount = addSpaceInString(
		parseInt((productPrice - (productPrice / 100) * productDiscountAmount).toString()).toString()
	);

	let productMemory = product.memoryamount
		? `${product.memoryamount} ${memoryEnumValueToString(product.memoryunit)}`
		: '';
</script>

<section class="flex w-full rounded-lg bg-white p-5">
	<div class="relative flex h-52 w-64 justify-center">
		<img src="/products/{productThumb}" alt="thumb-{productName}" />
		{#if productDiscountAvailable}
			<span class="absolute right-36 top-40 rounded-3xl bg-blue-500 p-2 text-xs text-gray-50"
				>-{productDiscountAmount}%</span
			>
		{/if}
	</div>

	<section class="flex w-full flex-col justify-between rounded-xl p-1">
		<a href="/jobs/{jobId}" class="h-max w-full pb-12 hover:text-blue-600">
			{jobTitle}
		</a>
		<section class="flex flex-col items-end justify-between p-1">
			<section class="flex w-full justify-between gap-x-4">
				{#if isLoggedIn}
					<section class="flex items-end gap-x-4">
						<ButtonLike {user_id} {jobId} />
						<ButtonBuy {user_id} {jobId} />
					</section>
				{/if}
			</section>
		</section>
	</section>
</section>
