<script lang="ts">
    import type { FormEventHandler } from "svelte/elements";
    import type { SearchParams } from "./search/+server";
    import type { ItemInfo } from "./item/[slug]/+page";
    import { goto } from "$app/navigation";
    import { formatMoney } from "../utils";

    let items: ItemInfo[] = $state([]);
    let categories = $state([]);
    let query = $state("");

    let selectedCategory: string | undefined = $state(undefined);

    let searchInput: HTMLInputElement;

    $effect(() => {
        fetch("/search", {
            method: "POST",
            body: JSON.stringify({
                query,
                category: selectedCategory,
            } as SearchParams),
        })
            .then((res) => res.json())
            .then((res) => {
                items = res.items;
                categories = res.categories;
            });
    });

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            goto(`/search?q=${encodeURIComponent(searchInput.value)}`);
        }
        if (e.key === "Backspace" && !query) {
            selectedCategory = undefined;
        }
    };
</script>

<div class="relative w-full flex justify-center">
    <div
        onfocus={() => {
            searchInput.focus();
        }}
        class="flex items-center rounded-full pr-6 text-lg bg-blue-50 overflow-hidden focus-within:ring-4 transition-all ring-2 placeholder-blue-400 ring-blue-600 w-full md:max-w-[70%]"
    >
        {#if selectedCategory}
            <div class="ml-2 rounded-full px-4 py-2 text-white bg-neutral-700">
                {selectedCategory}
            </div>
        {/if}

        <input
            bind:this={searchInput}
            bind:value={query}
            onkeydown={onKeyDown}
            placeholder="Search"
            class="bg-inherit flex-grow outline-none px-4 first:px-6 py-4"
        />

        <svg
            class="h-7 w-7 fill-blue-700"
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

    {#if items.length !== 0}
        <div
            class="z-50 max-h-72 max-w-full overflow-y-auto absolute top-20 w-[70%] rounded-md bg-white border-neutral-300 border flex flex-col"
        >
            {#if !selectedCategory && categories.length !== 0}
                <div class="max-w-full">
                    <div class="overflow-auto p-2 flex gap-2">
                        {#each categories as category}
                            <button
                                onclick={() => {
                                    selectedCategory = category;
                                    query = "";
                                    searchInput.focus();
                                }}
                                class="px-4 py-2 border-neutral-500 rounded-full border focus:bg-blue-50 transition-all"
                            >
                                {category}
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}

            {#each items as item}
                <a
                    href="/item/{item.id}"
                    class="border-neutral-300 border-b last:border-0 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-all grid gap-4 items-center grid-cols-[56px_auto_56px]"
                >
                    <span
                        class="h-14 w-14 bg-cover"
                        style={`background-image: url("${item.image}")`}
                    ></span>
                    <span class="overflow-ellipsis">{item.title}</span>

                    <span class="font-bold">{formatMoney(item.price)}</span>
                </a>
            {/each}
        </div>
    {/if}
</div>
