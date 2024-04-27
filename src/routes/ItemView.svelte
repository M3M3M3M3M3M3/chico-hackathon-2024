<script lang="ts">
    import { formatCategory, formatMoney, type ItemInfo } from "../utils";
    import PriceChart from "./PriceChart.svelte";

    let { itemVal }: { itemVal: ItemInfo } = $props();

    let priceStyles: string = $state("");

    const PriceData = 
    [

  {"day": "2022-12-31", "price": 118.98},
  {"day": "2023-01-01", "price": 118.98},
  {"day": "2023-01-02", "price": 118.98},
  {"day": "2023-01-03", "price": 118.98},
  {"day": "2023-01-04", "price": 118.98},
  {"day": "2023-01-05", "price": 118.98},
  {"day": "2023-01-06", "price": 118.98},
  {"day": "2023-01-07", "price": 118.98},
  {"day": "2023-01-08", "price": 93.23},
  {"day": "2023-01-09", "price": 93.23},
  {"day": "2023-01-10", "price": 93.23},
  {"day": "2023-01-11", "price": 93.23},
  {"day": "2023-01-12", "price": 93.23},
  {"day": "2023-01-13", "price": 93.23},
  {"day": "2023-01-14", "price": 93.23},
  {"day": "2023-01-15", "price": 133.80},
  {"day": "2023-01-16", "price": 133.80},
  {"day": "2023-01-17", "price": 133.80},
  {"day": "2023-01-18", "price": 133.80},
  {"day": "2023-01-19", "price": 133.80},
  {"day": "2023-01-20", "price": 133.80},
  {"day": "2023-01-21", "price": 133.80},
  {"day": "2023-01-22", "price": 114.39},
  {"day": "2023-01-23", "price": 114.39},
  {"day": "2023-01-24", "price": 114.39},
  {"day": "2023-01-25", "price": 114.39},
  {"day": "2023-01-26", "price": 114.39},
  {"day": "2023-01-27", "price": 114.39},
  {"day": "2023-01-28", "price": 114.39},
  {"day": "2023-01-29", "price": 111.53},
  {"day": "2023-01-30", "price": 111.53},
  {"day": "2023-01-31", "price": 111.53},
  {"day": "2023-02-01", "price": 111.53},
  {"day": "2023-02-02", "price": 111.53},
  {"day": "2023-02-03", "price": 111.53},
  {"day": "2023-02-04", "price": 111.53},
  {"day": "2023-02-05", "price": 68.91},
  {"day": "2023-02-06", "price": 68.91},
  {"day": "2023-02-07", "price": 68.91},
  {"day": "2023-02-08", "price": 68.91},
  {"day": "2023-02-09", "price": 68.91},
  {"day": "2023-02-10", "price": 68.91},
  {"day": "2023-02-11", "price": 68.91},
  {"day": "2023-02-12", "price": 104.73},
  {"day": "2023-02-13", "price": 104.73},
  {"day": "2023-02-14", "price": 104.73},
  {"day": "2023-02-15", "price": 104.73},
  {"day": "2023-02-16", "price": 104.73},
  {"day": "2023-02-17", "price": 104.73},
  {"day": "2023-02-18", "price": 104.73},
  {"day": "2023-02-19", "price": 98.53},
  {"day": "2023-02-20", "price": 98.53},
  {"day": "2023-02-21", "price": 98.53},
  {"day": "2023-02-22", "price": 98.53},
  {"day": "2023-02-23", "price": 98.53},
  {"day": "2023-02-24", "price": 98.53},
  {"day": "2023-02-25", "price": 98.53},
  {"day": "2023-02-26", "price": 72.87},
  {"day": "2023-02-27", "price": 72.87},
  {"day": "2023-02-28", "price": 72.87},
  {"day": "2023-03-01", "price": 72.87},
  {"day": "2023-03-02", "price": 72.87},
  {"day": "2023-03-03", "price": 72.87},
  {"day": "2023-03-04", "price": 72.87},
  {"day": "2023-03-05", "price": 122.19},
  {"day": "2023-03-06", "price": 122.19},
  {"day": "2023-03-07", "price": 122.19},
  {"day": "2023-03-08", "price": 122.19},
  {"day": "2023-03-09", "price": 122.19},
  {"day": "2023-03-10", "price": 122.19},
  {"day": "2023-03-11", "price": 122.19},
  {"day": "2023-03-12", "price": 143.70},
  {"day": "2023-03-13", "price": 143.70},
  {"day": "2023-03-14", "price": 143.70},
  {"day": "2023-03-15", "price": 143.70},
  {"day": "2023-03-16", "price": 143.70},
  {"day": "2023-03-17", "price": 143.70},
  {"day": "2023-03-18", "price": 143.70},
  {"day": "2023-03-19", "price": 135.45},
  {"day": "2023-03-20", "price": 135.45},
  {"day": "2023-03-21", "price": 135.45},
  {"day": "2023-03-22", "price": 135.45},
  {"day": "2023-03-23", "price": 135.45},
  {"day": "2023-03-24", "price": 135.45},
  {"day": "2023-03-25", "price": 135.45},
  {"day": "2023-03-26", "price": 67.77},
  {"day": "2023-03-27", "price": 67.77},
  {"day": "2023-03-28", "price": 67.77},
  {"day": "2023-03-29", "price": 67.77},
  {"day": "2023-03-30", "price": 67.77},
  {"day": "2023-03-31", "price": 67.77},
  {"day": "2023-04-01", "price": 67.77},
  {"day": "2023-04-02", "price": 76.33},
  {"day": "2023-04-03", "price": 76.33},
  {"day": "2023-04-04", "price": 76.33},
  {"day": "2023-04-05", "price": 76.33},
  {"day": "2023-04-06", "price": 76.33},
  {"day": "2023-04-07", "price": 76.33},
  {"day": "2023-04-08", "price": 76.33},
  {"day": "2023-04-09", "price": 54.00},
  {"day": "2023-04-10", "price": 54.00}
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
    <div class="grid gap-2 grid-cols-1 sm:grid-cols-2">
        <div class="md:rounded-md overflow-hidden">
            <img alt="I hate the blind" src={itemVal.image} />
        </div>

        <div class="flex flex-col gap-8 px-2 md:p-0 justify-center">
            <div class="flex flex-col items-start gap-2">
                <span class="text-3xl font-extrabold">{itemVal.title}</span>

                <span
                    class="bg-neutral-300 dark:bg-neutral-600 px-2 py-1 text-sm rounded-full capitalize"
                    >{formatCategory(itemVal.category)}
                </span>
            </div>

            <div class="flex place-items-center flex-col">
                <span class="text-4xl font-extrabold w-min {priceStyles}"
                    >{formatMoney(itemVal.price)}</span
                >
                {#if itemVal.buy_quality === "GOOD"}
                    <span class="text-sm text-neutral-600 dark:text-neutral-300"
                        >This is a good time to buy this product :)</span
                    >
                {/if}

                {#if itemVal.buy_quality === "BAD"}
                    <span class="text-sm text-neutral-600 dark:text-neutral-300"
                        >This is a bad time to buy this product :(</span
                    >
                {/if}

                {#if itemVal.buy_quality === "MEDIUM" || !itemVal.buy_quality}
                    <span class="text-sm text-neutral-600 dark:text-neutral-300"
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
            <div
                class="border border-neutral-300 dark:border-neutral-600 rounded-lg p-4 h-96"
            >
                <PriceChart priceData={PriceData} />
            </div>
        </div>
    </div>
</div>
