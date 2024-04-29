<script lang="ts">
import { formatCategory, formatMoney } from "../../../utils";
import type { PageServerData } from "./$types";
import PriceChart from "./PriceChart.svelte";

let { data }: { data: PageServerData } = $props();

let priceStyles: string = $state("");

let { currentPrice, nextPrice } = $derived.by(() => {
    let currentPrice = 0;
    let nextPrice = 0;
    for (let { price, date } of data.priceDates) {
        nextPrice = price;
        if (new Date(date) > new Date()) break;
        currentPrice = price;
    }
    return { currentPrice, nextPrice };
});

// $effect(() => {
//     if (data.buy_quality == "MEDIUM") {
//         priceStyles = "text-neutral-500";
//     } else if (data.buy_quality == "GOOD") {
//         priceStyles = "text-green-700";
//     } else if (data.buy_quality == "BAD") {
//         priceStyles = "text-orange-700";
//     }
// });
</script>

<div class="flex flex-col gap-4">
    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div class="flex justify-center overflow-hidden md:rounded-md">
            <img alt="product" src={data.image} />
        </div>

        <div class="flex flex-col justify-center gap-8 px-2 md:p-0">
            <div class="flex flex-col items-start gap-2">
                <span class="text-3xl font-extrabold">{data.title}</span>

                <span
                    class="rounded-full bg-neutral-300 px-2 py-1 text-sm capitalize dark:bg-neutral-600"
                    >{formatCategory(data.category)}
                </span>
            </div>

            <div class="flex flex-col place-items-center">
                <div class="flex gap-2 items-center">
                    <span class="w-min text-4xl font-extrabold {priceStyles}"
                        >{formatMoney(currentPrice)}</span
                    >

                    {#if nextPrice != currentPrice}
                        <span
                            class="w-min text-2xl bg-neutral-300 px-2 py-1 rounded line-through"
                            >{formatMoney(nextPrice)}</span
                        >
                    {/if}
                </div>

                {#if data.buy_quality === "GOOD"}
                    <span class="text-sm text-neutral-600 dark:text-neutral-300"
                        >This is a good time to buy this product :)</span
                    >
                {/if}

                {#if data.buy_quality === "BAD"}
                    <span class="text-sm text-neutral-600 dark:text-neutral-300"
                        >This is a bad time to buy this product :(</span
                    >
                {/if}

                {#if data.buy_quality === "MEDIUM" || !data.buy_quality}
                    <span class="text-sm text-neutral-600 dark:text-neutral-300"
                        >This is an OK time buy this product :|</span
                    >
                {/if}
            </div>
        </div>
    </div>

    <div class="flex flex-col gap-2">
        <span class="select-none px-2 text-2xl font-extrabold md:p-0"
            >Price History</span
        >

        <div class="p-2 md:p-0">
            <div
                class="h-96 rounded-lg border border-neutral-300 p-4 dark:border-neutral-600"
            >
                <PriceChart priceData={data.priceDates} dealData={[]} />
            </div>
        </div>
    </div>
</div>
