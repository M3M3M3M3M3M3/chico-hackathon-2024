<script lang="ts">
import { page } from "$app/stores";
import { goto } from "$app/navigation";
import { formatCategory, formatMoney, priceDatesGetCurrent } from "../utils";
import { slide } from "svelte/transition";
import { cubicInOut, quintInOut, quintOut } from "svelte/easing";
import { onMount } from "svelte";
import Modal from "./Modal.svelte";
import ItemListing from "./ItemListing.svelte";
import ItemView from "./item/[slug]/+page.svelte";
import type { PageData } from "./$types";

let maxPrice = $state(0);
let filterPrice = $state(Number.MAX_VALUE);
let minPrice = $state(0);

let query = $state($page.url.searchParams.get("q") ?? "");
let selectedCategory: string | undefined = $state(
    $page.url.searchParams.get("category") ?? ""
);

let { data }: { data: PageData } = $props();

$effect(() => {
    let prices = data.items.map((i: any) => {
        let { current } = priceDatesGetCurrent(i.priceDates);
        return current!.price;
    });
    maxPrice = Math.max(...prices);
    minPrice = Math.min(...prices);

    filterPrice = maxPrice;
});

let searchInput: HTMLInputElement;

function getParams(): string {
    const params = new URLSearchParams();
    if (selectedCategory) params.append("category", selectedCategory);
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

let prevDisplayItem = $state();

$effect(() => {
    if ($page.state.displayItem) {
        prevDisplayItem = $page.state.displayItem;
    }
});

let jsEnabled = $state(false);

onMount(() => {
    jsEnabled = true;
});
</script>

<svelte:head>
    <title>DealFinder</title>
    <meta name="description" content="Deal Finder" />
</svelte:head>

<Modal
    shown={!!$page.state.displayItem}
    close={() => {
        history.back();
    }}
>
    {#if prevDisplayItem}
        <ItemView data={prevDisplayItem} />
    {/if}
</Modal>

<section class="flex flex-col py-4">
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
            class="mb-2 mt-8 text-center text-5xl font-extrabold italic md:mt-[30vh] md:text-6xl"
            >DealFinder</span
        >
    {/if}

    <div class="px-2">
        <form
            method="GET"
            action="/"
            onsubmit={(e) => {
                e.preventDefault();
            }}
            onfocus={() => {
                searchInput.focus();
            }}
            class="flex w-full items-center overflow-hidden rounded-full border-2 border-blue-600 bg-blue-50 pl-2 pr-6 text-lg ring-blue-600 transition-all focus-within:ring-2 dark:border-amber-600 dark:bg-amber-200 dark:text-black dark:ring-amber-600"
        >
            {#if selectedCategory}
                <input type="hidden" name="category" value={selectedCategory} />

                <div
                    out:slide={{
                        duration: 300,
                        easing: cubicInOut,
                        axis: "x",
                    }}
                    class="text-nowrap rounded-full bg-neutral-700 px-4 py-2 capitalize text-white"
                >
                    {formatCategory(selectedCategory)}
                </div>
            {/if}

            <input
                name="q"
                bind:this={searchInput}
                bind:value={query}
                onkeydown={onKeyDown}
                placeholder="Search"
                class="flex-grow bg-inherit px-4 py-4 placeholder-blue-400 outline-none dark:placeholder-amber-600"
            />

            <button type="submit">
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
            </button>
        </form>
    </div>

    {#if !selectedCategory && data.categories.length !== 0}
        <div
            transition:slide={{
                duration: 300,
                easing: cubicInOut,
                axis: "y",
            }}
            class="mt-4 max-w-full px-2"
        >
            <div class="flex gap-2 overflow-auto">
                {#each data.categories as category}
                    <a
                        href={`?category=${category}`}
                        onclick={(e) => {
                            e.preventDefault();
                            selectedCategory = category;
                            query = "";
                            searchInput.focus();
                        }}
                        class="text-nowrap rounded-full border border-neutral-300 px-4 py-2 capitalize transition-all hover:bg-blue-50 focus:bg-blue-50 dark:border-neutral-600 dark:bg-black hover:dark:bg-amber-900 focus:dark:bg-amber-900"
                    >
                        {formatCategory(category)}
                    </a>
                {/each}
            </div>
        </div>
    {/if}

    {#if jsEnabled && selectedCategory && data.items.length !== 0}
        <div class="px-2">
            <div
                transition:slide={{
                    duration: 300,
                    easing: cubicInOut,
                    axis: "y",
                }}
                class="mt-4 rounded-xl border border-neutral-300 p-4 dark:border-neutral-600"
            >
                <div class="flex items-center gap-2">
                    Maximum Price:

                    <input
                        bind:value={filterPrice}
                        type="range"
                        max={maxPrice}
                        min={minPrice}
                        step={0.01}
                    />

                    {formatMoney(filterPrice)}
                </div>
            </div>
        </div>
    {/if}

    {#if data.items.length !== 0}
        <div class="px-2">
            <div
                class="mt-4 flex w-full flex-col overflow-hidden rounded-xl border border-neutral-300 dark:border-neutral-600"
            >
                {#each data.items.filter((i) => priceDatesGetCurrent(i.priceDates).current!.price <= filterPrice) as itemVal}
                    <ItemListing {itemVal} />
                {/each}
            </div>
        </div>
    {/if}
</section>
