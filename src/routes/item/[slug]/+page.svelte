<script lang="ts">
    import type { ItemInfo } from "./+page";
    import PriceChart from "./PriceChart.svelte";

    export let data: ItemInfo;

    let priceStyles: string;

    if (data.buy_quality == "MEDIUM") {
        priceStyles = "text-neutral-500";
    } else if (data.buy_quality == "GOOD") {
        priceStyles = "text-green-700";
    } else if (data.buy_quality == "BAD") {
        priceStyles = "text-orange-700";
    }
</script>

<svelte:head>
    <title>Item Listing</title>
</svelte:head>

<div class="flex flex-col gap-4">
    <div class="grid gap-2 grid-cols-1 md:grid-cols-2">
        <div class="md:rounded-md overflow-hidden">
            <img alt="I hate the blind" src={data.img_url} />
        </div>

        <div class="flex flex-col gap-2 px-2 md:p-0">
            <span class="text-4xl font-extrabold">{data.title}</span>

            <span>{data.content}</span>

            <div class="flex place-items-center flex-col">
                <span class="text-4xl font-extrabold w-min {priceStyles}"
                    >{data.price}</span
                >
                {#if data.buy_quality === "GOOD"}
                    <span class="text-sm text-neutral-600"
                        >This is a good time to buy this product :)</span
                    >
                {/if}

                {#if data.buy_quality === "BAD"}
                    <span class="text-sm text-neutral-600"
                        >This is a bad time to buy this product :(</span
                    >
                {/if}

                {#if data.buy_quality === "MEDIUM"}
                    <span class="text-sm text-neutral-600"
                        >This is an OK time buy this product :|</span
                    >
                {/if}
            </div>
        </div>
    </div>

    <div class="flex flex-col gap-2">
        <span class="text-2xl font-extrabold px-2 md:p-0">Price History</span>

        <div class="p-2 md:p-0">
            <div class="border rounded-lg p-4 h-96">
                <PriceChart />
            </div>
        </div>
    </div>
</div>
