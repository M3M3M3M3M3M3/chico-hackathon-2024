<script lang="ts">
    import { formatCategory, formatMoney, type ItemInfo } from "../utils";
    import PriceChart from "./PriceChart.svelte";

    let { itemVal }: { itemVal: ItemInfo } = $props();

    let priceStyles: string = $state("");

    const PriceData = [
        { day: "2023-01-01", price: 93.88 },
        { day: "2023-01-02", price: 88.14 },
        { day: "2023-01-03", price: 64.88 },
        { day: "2023-01-04", price: 109.76 },
        { day: "2023-01-05", price: 106.42 },
        { day: "2023-01-06", price: 90.2 },
        { day: "2023-01-07", price: 91.01 },
        { day: "2023-01-08", price: 108.2 },
        { day: "2023-01-09", price: 106.23 },
        { day: "2023-01-10", price: 82.68 },
        { day: "2023-01-11", price: 108.89 },
        { day: "2023-01-12", price: 98.33 },
        { day: "2023-01-13", price: 110.0 },
        { day: "2023-01-14", price: 114.5 },
        { day: "2023-01-15", price: 86.82 },
        { day: "2023-01-16", price: 106.43 },
        { day: "2023-01-17", price: 102.04 },
        { day: "2023-01-18", price: 94.47 },
        { day: "2023-01-19", price: 99.06 },
        { day: "2023-01-20", price: 84.05 },
        { day: "2023-01-21", price: 97.09 },
        { day: "2023-01-22", price: 109.22 },
        { day: "2023-01-23", price: 102.66 },
        { day: "2023-01-24", price: 99.57 },
        { day: "2023-01-25", price: 101.6 },
        { day: "2023-01-26", price: 95.53 },
        { day: "2023-01-27", price: 102.6 },
        { day: "2023-01-28", price: 103.73 },
        { day: "2023-01-29", price: 87.87 },
        { day: "2023-01-30", price: 99.11 },
        { day: "2023-01-31", price: 117.82 },
        { day: "2023-02-01", price: 89.51 },
        { day: "2023-02-02", price: 113.45 },
        { day: "2023-02-03", price: 101.3 },
        { day: "2023-02-04", price: 95.23 },
        { day: "2023-02-05", price: 91.62 },
        { day: "2023-02-06", price: 103.26 },
        { day: "2023-02-07", price: 94.58 },
        { day: "2023-02-08", price: 96.63 },
        { day: "2023-02-09", price: 112.97 },
        { day: "2023-02-10", price: 106.85 },
        { day: "2023-02-11", price: 91.95 },
        { day: "2023-02-12", price: 94.28 },
        { day: "2023-02-13", price: 95.84 },
        { day: "2023-02-14", price: 108.63 },
        { day: "2023-02-15", price: 97.18 },
        { day: "2023-02-16", price: 108.45 },
        { day: "2023-02-17", price: 103.86 },
        { day: "2023-02-18", price: 96.53 },
        { day: "2023-02-19", price: 94.57 },
        { day: "2023-02-20", price: 107.89 },
        { day: "2023-02-21", price: 103.05 },
        { day: "2023-02-22", price: 98.65 },
        { day: "2023-02-23", price: 103.23 },
        { day: "2023-02-24", price: 105.47 },
        { day: "2023-02-25", price: 109.32 },
        { day: "2023-02-26", price: 104.88 },
        { day: "2023-02-27", price: 106.89 },
        { day: "2023-02-28", price: 98.41 },
        { day: "2023-03-01", price: 106.32 },
        { day: "2023-03-02", price: 103.09 },
        { day: "2023-03-03", price: 108.29 },
        { day: "2023-03-04", price: 94.46 },
        { day: "2023-03-05", price: 91.87 },
        { day: "2023-03-06", price: 98.12 },
        { day: "2023-03-07", price: 101.07 },
        { day: "2023-03-08", price: 97.02 },
        { day: "2023-03-09", price: 93.05 },
        { day: "2023-03-10", price: 89.14 },
        { day: "2023-03-11", price: 91.6 },
        { day: "2023-03-12", price: 115.55 },
        { day: "2023-03-13", price: 89.08 },
        { day: "2023-03-14", price: 119.27 },
        { day: "2023-03-15", price: 121.51 },
        { day: "2023-03-16", price: 89.94 },
        { day: "2023-03-17", price: 112.68 },
        { day: "2023-03-18", price: 106.08 },
        { day: "2023-03-19", price: 95.45 },
        { day: "2023-03-20", price: 108.84 },
        { day: "2023-03-21", price: 101.64 },
        { day: "2023-03-22", price: 105.49 },
        { day: "2023-03-23", price: 112.74 },
        { day: "2023-03-24", price: 109.81 },
        { day: "2023-03-25", price: 101.07 },
        { day: "2023-03-26", price: 101.57 },
        { day: "2023-03-27", price: 90.36 },
        { day: "2023-03-28", price: 96.37 },
        { day: "2023-03-29", price: 103.36 },
        { day: "2023-03-30", price: 105.57 },
        { day: "2023-03-31", price: 96.38 },
        { day: "2023-04-01", price: 111.69 },
        { day: "2023-04-02", price: 104.24 },
        { day: "2023-04-03", price: 98.45 },
        { day: "2023-04-04", price: 97.85 },
        { day: "2023-04-05", price: 87.45 },
        { day: "2023-04-06", price: 126.56 },
    ];

    $effect(() => {
        if (itemVal.buy_quality == "MEDIUM") {
            priceStyles = "text-neutral-500";
        } else if (itemVal.buy_quality == "GOOD") {
            priceStyles = "text-green-700";
        } else if (itemVal.buy_quality == "BAD") {
            priceStyles = "text-orange-700";
        }
    });
</script>

<div class="flex flex-col gap-4">
    <div class="grid gap-2 grid-cols-1 md:grid-cols-2">
        <div class="md:rounded-md overflow-hidden">
            <img alt="I hate the blind" src={itemVal.image} />
        </div>

        <div class="flex flex-col gap-8 px-2 md:p-0 justify-center">
            <div class="flex flex-col items-start gap-2">
                <span class="text-3xl font-extrabold">{itemVal.title}</span>

                <span
                    class="bg-neutral-300 px-2 py-1 text-sm rounded-full capitalize"
                    >{formatCategory(itemVal.category)}</span
                >
            </div>

            <div class="flex place-items-center flex-col">
                <span class="text-4xl font-extrabold w-min {priceStyles}"
                    >{formatMoney(itemVal.price)}</span
                >
                {#if itemVal.buy_quality === "GOOD"}
                    <span class="text-sm text-neutral-600"
                        >This is a good time to buy this product :)</span
                    >
                {/if}

                {#if itemVal.buy_quality === "BAD"}
                    <span class="text-sm text-neutral-600"
                        >This is a bad time to buy this product :(</span
                    >
                {/if}

                {#if itemVal.buy_quality === "MEDIUM" || !itemVal.buy_quality}
                    <span class="text-sm text-neutral-600"
                        >This is an OK time buy this product :|</span
                    >
                {/if}
            </div>
        </div>
    </div>

    <div class="flex flex-col gap-2">
        <span class="text-2xl font-extrabold px-2 md:p-0 select-none"
            >Price History</span
        >

        <div class="p-2 md:p-0">
            <div class="border rounded-lg p-4 h-96">
                <PriceChart priceData={PriceData} />
            </div>
        </div>
    </div>
</div>
