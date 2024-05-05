<script lang="ts">
import { goto, preloadData, pushState } from "$app/navigation";
import { formatMoney, priceDatesGetCurrent } from "../utils";

let { itemVal }: { itemVal: any } = $props();
let { current, next } = $derived(priceDatesGetCurrent(itemVal.priceDates));
</script>

<a
    href={`/item/${itemVal.id}`}
    onclick={async (e) => {
        e.preventDefault();
        const href = `/item/${itemVal.id}`;
        const result = await preloadData(href);

        if (result.type === "loaded" && result.status === 200) {
            pushState(href, { displayItem: result.data });
        } else {
            goto(href);
        }
    }}
    class={`flex items-center gap-4 border-b border-neutral-300 bg-white
    text-left transition-all last:border-0 hover:bg-blue-50 focus:bg-blue-50
    focus:outline-none dark:border-neutral-600 dark:bg-black hover:dark:bg-amber-900 focus:dark:bg-amber-900 ${!current!.available ? "opacity-50 contrast-75" : ""}}`}
>
    <span
        class="h-20 w-20 min-w-20 bg-cover"
        style={`background-image: url("${itemVal.image}")`}
    ></span>

    <div class="flex flex-col gap-1">
        <div>
            {#if !current!.available}
                <span
                    class="mr-1 rounded-sm bg-neutral-300 px-1 py-1 text-xs font-bold dark:bg-neutral-600"
                >
                    OUT OF STOCK</span
                >
            {/if}

            <span class="overflow-ellipsis">{itemVal.title}</span>
        </div>
        <div class="flex items-center">
            <span
                class="mr-2 flex items-end rounded-sm bg-neutral-300 px-1 dark:bg-neutral-600"
            >
                <span class="text-sm font-bold"
                    >{formatMoney(current!.price / current!.totalUnits)}</span
                ><span class="mb-[1px] text-xs">/{itemVal.unitDisplay}</span>
            </span>

            <span class={`rounded-sm px-1 py-1 text-xs`}>
                {formatMoney(current!.price)}
            </span>

            {#if next && next.price !== current!.price}
                <span
                    class="rounded-sm py-1 text-xs text-neutral-400 line-through"
                >
                    {formatMoney(next.price)}</span
                >
            {/if}
        </div>
    </div>
</a>
