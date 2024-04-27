<script lang="ts">
    import type { FormEventHandler } from "svelte/elements";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { formatCategory, formatMoney, type ItemInfo } from "../utils";
    import { fade, scale, slide } from "svelte/transition";
    import { cubicInOut, quintInOut, quintOut } from "svelte/easing";
    import { onMount, untrack } from "svelte";
    import Modal from "./Modal.svelte";
    import ItemView from "./ItemView.svelte";

    let { data } = $props();

    let maxPrice = $state(0);

    let query = $state($page.url.searchParams.get("q") ?? "");

    let selectedCategory: string | undefined = $state(
        $page.url.searchParams.get("category") ?? "",
    );
    let selectedItem: string | undefined = $state(
        $page.url.searchParams.get("item") ?? "",
    );

    $effect(() => {
        maxPrice = Math.max(...data.items.map((i: ItemInfo) => i.prices[0]));
    });

    let searchInput: HTMLInputElement;

    function getParams(): string {
        const params = new URLSearchParams();
        if (selectedCategory) params.append("category", selectedCategory);
        if (selectedItem) params.append("item", selectedItem);
        if (query) params.append("q", query);

        return params.toString();
    }

    onMount(() => {
        searchInput.focus();
    });

    $effect(() => {
        goto(`/?${getParams()}`, {
            replaceState: true,
            noScroll: true,
            keepFocus: true,
        });
    });

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Backspace" && !query) {
            selectedCategory = undefined;
        }
    };
</script>

<svelte:head>
    <title>DealFinder</title>
    <meta name="description" content="Deal Finder" />
</svelte:head>

<Modal
    shown={data && !!data.itemVal}
    close={() => {
        selectedItem = undefined;
        goto(`/?${getParams()}`, {
            replaceState: true,
            noScroll: true,
            keepFocus: true,
        });
        history.back();
    }}
>
    <ItemView itemVal={data.itemVal} />
</Modal>

<section class="flex flex-col gap-4 px-4">
    <div class="flex justify-center">
        <div class="flex flex-col w-full h-fit mt-4">
            {#if !query && !selectedCategory}
                <span
                    out:slide={{
                        delay: 200,
                        duration: 800,
                        easing: quintInOut,
                        axis: "y",
                    }}
                    in:slide={{
                        duration: 800,
                        easing: quintInOut,
                        axis: "y",
                    }}
                    class="text-6xl text-center font-extrabold mt-[30vh] mb-2 italic"
                    >DealFinder</span
                >
            {/if}

            <div class="top-4">
                <div
                    onfocus={() => {
                        searchInput.focus();
                    }}
                    class="flex items-center rounded-full pr-6 text-lg bg-blue-50 dark:bg-amber-200 dark:border-amber-600 dark:ring-amber-600 dark:text-black overflow-hidden focus-within:ring-2 transition-all border-2 border-blue-600 ring-blue-600 w-full pl-2"
                >
                    {#if selectedCategory}
                        <div
                            out:slide={{
                                duration: 300,
                                easing: cubicInOut,
                                axis: "x",
                            }}
                            class="rounded-full px-4 py-2 text-white bg-neutral-700 capitalize text-nowrap"
                        >
                            {formatCategory(selectedCategory)}
                        </div>
                    {/if}

                    <input
                        bind:this={searchInput}
                        bind:value={query}
                        onkeydown={onKeyDown}
                        placeholder="Search"
                        class="bg-inherit flex-grow outline-none px-4 py-4 dark:placeholder-amber-600 placeholder-blue-400"
                    />

                    <svg
                        class="h-7 w-7 fill-blue-700 dark:fill-amber-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        id="search"
                        ><g
                            ><path
                                d="m20.71 19.29-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z"
                            ></path></g
                        ></svg
                    >
                </div>

                {#if !selectedCategory && data.categories.length !== 0}
                    <div
                        transition:slide={{
                            duration: 300,
                            easing: cubicInOut,
                            axis: "y",
                        }}
                        class="max-w-full mt-4"
                    >
                        <div class="overflow-auto flex gap-2">
                            {#each data.categories as category}
                                <button
                                    onclick={() => {
                                        selectedCategory = category;
                                        query = "";
                                        searchInput.focus();
                                    }}
                                    class="px-4 py-2 border-neutral-300 dark:border-neutral-600 dark:bg-black rounded-full border hover:bg-blue-50 focus:bg-blue-50 focus:dark:bg-amber-900 hover:dark:bg-amber-900 transition-all capitalize text-nowrap"
                                >
                                    {formatCategory(category)}
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>

            {#if selectedCategory && data.items.length !== 0}
                <div
                    transition:slide={{
                        duration: 300,
                        easing: cubicInOut,
                        axis: "y",
                    }}
                    class="rounded-xl p-4 border border-neutral-300 dark:border-neutral-600 mt-4"
                >
                    <div class="flex gap-2 items-center">
                    Maximum Price:

                    <input
                        bind:value={maxPrice}
                        type="range"
                        max={Math.max(...data.items.map((i: ItemInfo) => i.prices[0]))}
                        min={Math.min(...data.items.map((i: ItemInfo) => i.prices[0]))}
                        step={0.01}
                    />

                    {formatMoney(maxPrice)}
                </div>
                </div>
            {/if}

            {#if data.items.length !== 0}
                <div
                    class="w-full border-neutral-300 dark:border-neutral-600 flex flex-col border rounded-xl overflow-hidden mt-4"
                >
                    {#each data.items.filter(i => i.prices[0] <= maxPrice) as itemVal}
                        <button
                            onclick={() => {
                                selectedItem = itemVal.id;
                                goto(`/?${getParams()}`, {
                                    noScroll: true,
                                    keepFocus: true,
                                });
                            }}
                            class={`border-neutral-300 border-b last:border-0 bg-white dark:bg-black dark:border-neutral-600
                            hover:bg-blue-50 focus:bg-blue-50 focus:dark:bg-amber-900 hover:dark:bg-amber-900 focus:outline-none
                            transition-all gap-4 items-center flex text-left ${itemVal.availability === "out_of_stock" ? "contrast-75 opacity-50" : ""}}`}
                        >
                            <span
                                class="h-20 w-20 min-w-20 bg-cover"
                                style={`background-image: url("${itemVal.image}")`}
                            ></span>

                            <div class="flex flex-col gap-1">
                                <div>
                                    {#if itemVal.availability === "out_of_stock"}
                                        <span
                                            class="bg-neutral-300 dark:bg-neutral-600 px-1 py-1 rounded-sm text-xs mr-1 font-bold"
                                        >
                                            OUT OF STOCK</span
                                        >
                                    {/if}

                                    <span class="overflow-ellipsis"
                                        >{itemVal.title}</span
                                    >
                                </div>
                                <div class="flex items-center">
                                    {#if itemVal.pricePerUnit}
                                        <span
                                            class="bg-neutral-300 dark:bg-neutral-600 rounded-sm flex items-end px-1 mr-2"
                                        >
                                            <span class="font-bold text-sm"
                                                >{formatMoney(
                                                    itemVal.pricePerUnit,
                                                )}</span
                                            ><span class="text-xs mb-[1px]"
                                                >/{itemVal.unitDisplay}</span
                                            >
                                        </span>

                                        <span
                                            class={`px-1 py-1 rounded-sm text-xs`}
                                        >
                                            {formatMoney(itemVal.prices[0])}
                                        </span>

                                        {#if itemVal.prices[1] && itemVal.prices[1] !== itemVal.prices[0]}
                                            <span
                                                class="py-1 rounded-sm text-xs line-through text-neutral-400"
                                            >
                                                {formatMoney(itemVal.prices[1])}</span
                                            >
                                        {/if}
                                    {/if}
                                    {#if !itemVal.pricePerUnit}
                                        <span class="font-bold"
                                            >{formatMoney(itemVal.price)}</span
                                        >
                                    {/if}
                                </div>
                            </div>
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</section>
