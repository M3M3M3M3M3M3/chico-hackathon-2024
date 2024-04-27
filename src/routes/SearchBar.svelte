<script lang="ts">
    import type { FormEventHandler } from "svelte/elements";
    import type { SearchParams } from "./search/+server";
    import type { ItemInfo } from "./item/[slug]/+page";

    let items: ItemInfo[] = [];

    const onInput: FormEventHandler<HTMLInputElement> = (e) => {
        fetch("/search", {
            method: "POST",
            body: JSON.stringify({
                /* @ts-ignore */
                input: e.target.value,
            } as SearchParams),
        })
            .then((res) => res.json())
            .then((res) => {
                items = res;
            });
    };
</script>

<div class="relative w-full flex justify-center">
    <input
        oninput={onInput}
        placeholder="Search"
        class="rounded-full text-lg bg-blue-50 border-2 placeholder-blue-400 border-blue-600 py-4 px-6 w-full md:max-w-[70%]"
    />

    {#if items.length !== 0}
        <div
            class="absolute top-20 w-[70%] rounded-md bg-white border-neutral-300 border flex flex-col overflow-hidden"
        >
            {#each items as item}
                <a
                    href="/item/{item.id}"
                    class="border-neutral-300 border-b last:border-0 hover:bg-blue-50 transition-all flex gap-4 items-center"
                >
                    <span
                        class="h-14 w-14 bg-cover"
                        style={`background-image: url("${item.img_url}")`}
                    ></span>
                    <span class="w-16 overflow-ellipsis">{item.title}</span>

                    <span class="font-bold">{item.price}</span>
                </a>
            {/each}
        </div>
    {/if}
</div>
