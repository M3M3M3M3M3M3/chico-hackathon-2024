<script lang="ts">
    import type { ItemInfo } from "./+page";

    export let data: ItemInfo;
</script>

<svelte:head>
    <title>Item Listing</title>
</svelte:head>

<div class="grid grid-cols-1 md:grid-cols-2">
    <div class="md:rounded-md overflow-hidden">
        <img
            alt="I hate the blind"
            src="https://purr.objects-us-east-1.dream.io/i/baby2.jpg"
        />
    </div>

    <div class="flex flex-col gap-2 px-4">
        <span class="text-2xl font-extrabold">{data.title}</span>

        <span>{data.content}</span>
    </div>
</div>
