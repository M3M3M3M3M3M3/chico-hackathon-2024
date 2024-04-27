<script lang="ts">
    import FeaturedItem from "../FeaturedItem.svelte";
    import SearchBar from "../SearchBar.svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    let searchVal: string = $state($page.url.searchParams.get("q") ?? "");
    let sortType: string = $state(
        $page.url.searchParams.get("sortType") ?? "ASCENDING",
    );
    let sortBy: string = $state(
        $page.url.searchParams.get("sortBy") ?? "PRICE_PER_WEIGHT",
    );

    $effect(() => {
        goto(`/search?q=${searchVal}&sortType=${sortType}&sortBy=${sortBy}`, {
            replaceState: true,
            keepFocus: true,
        });
    });

    let { data } = $props();
</script>

<div class="grid px-2 sm:p-0 sm:grid-cols-search gap-2 items-start">
    <div
        class="bg-neutral-50 border-neutral-300 top-2 rounded-md border p-2 sticky self-start"
    >
        <span class="font-bold">Filters</span>

        <div class="grid grid-cols-[min-content_auto] gap-2">
            <label for="sortby" class="text-nowrap">Sort By</label>
            <select bind:value={sortBy} name="sortby">
                <option value="PRICE">Price</option>
                <option value="PRICE_PER_WEIGHT">Price Per Weight</option>
            </select>

            <label for="sortby" class="text-nowrap">Sort Type</label>
            <select bind:value={sortType} name="sortby">
                <option value="ASCENDING">Low to High</option>
                <option value="DESCENDING">High to Low</option>
            </select>

            <div class="col-span-2">
                <label for="sortby" class="text-nowrap">Sort Type</label>
                <input type="radio" bind:value={sortType} name="showShelf" />

                <label for="sortby" class="text-nowrap">Sort Type</label>
                <input type="radio" bind:value={sortType} name="" />
            </div>
        </div>
    </div>

    <div class="flex flex-col gap-2">
        <input
            bind:value={searchVal}
            class="rounded-md bg-blue-50 px-4 py-2 w-full ring-blue-500 border border-blue-500 ring-0 outline-none focus:ring-2 transition-all"
            placeholder="Search"
        />

        <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {#each data.items as item}
                <FeaturedItem />
            {/each}
        </div>
    </div>
</div>
