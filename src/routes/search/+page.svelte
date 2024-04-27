<script lang="ts">
    import FeaturedItem from "../FeaturedItem.svelte";
    import SearchBar from "../SearchBar.svelte";

    let searchVal: string;

    export let data;
</script>

<div class="grid px-2 sm:p-0 sm:grid-cols-search gap-2 items-start">
    <div
        class="bg-neutral-50 border-neutral-300 top-2 rounded-md border p-2 sticky self-start"
    >
        <span class="font-bold">Filters</span>
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
