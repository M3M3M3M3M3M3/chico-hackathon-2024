<script lang="ts">
    import { formatCategory, formatMoney, type ItemInfo } from "../utils";
    import PriceChart from "./PriceChart.svelte";

    let { item }: { item: ItemInfo } = $props();

    let priceStyles: string = $state("");

    $effect(() => {
        if (item.buy_quality == "MEDIUM") {
            priceStyles = "text-neutral-500";
        } else if (item.buy_quality == "GOOD") {
            priceStyles = "text-green-700";
        } else if (item.buy_quality == "BAD") {
            priceStyles = "text-orange-700";
        }
    });
</script>

<div class="flex flex-col gap-4">
    <div class="grid gap-2 grid-cols-1 md:grid-cols-2">
        <div class="md:rounded-md overflow-hidden">
            <img alt="I hate the blind" src={item.image} />
        </div>

        <div class="flex flex-col gap-8 px-2 md:p-0">
            <div class="flex flex-col items-start gap-2">
                <span class="text-3xl font-extrabold">{item.title}</span>

                <span
                    class="bg-neutral-300 px-2 py-1 text-sm rounded-full capitalize"
                    >{formatCategory(item.type)}</span
                >
            </div>

            <div class="flex place-items-center flex-col">
                <span class="text-4xl font-extrabold w-min {priceStyles}"
                    >{formatMoney(item.price)}</span
                >
                {#if item.buy_quality === "GOOD"}
                    <span class="text-sm text-neutral-600"
                        >This is a good time to buy this product :)</span
                    >
                {/if}

                {#if item.buy_quality === "BAD"}
                    <span class="text-sm text-neutral-600"
                        >This is a bad time to buy this product :(</span
                    >
                {/if}

                {#if item.buy_quality === "MEDIUM" || !item.buy_quality}
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
