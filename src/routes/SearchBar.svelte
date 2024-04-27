<script lang="ts">
    import type { FormEventHandler } from "svelte/elements";
    import type { SearchParams } from "./search/+server";
    import type { ItemInfo } from "./item/[slug]/+page";
    import { goto } from "$app/navigation";
    import { formatMoney } from "../utils";

    let items: ItemInfo[] = [];

    let searchInput: HTMLInputElement;

    const onInput: FormEventHandler<HTMLInputElement> = (e) => {
        /* @ts-ignore */
        let input = e.target.value;

        fetch("/search", {
            method: "POST",
            body: JSON.stringify({
                input,
            } as SearchParams),
        })
            .then((res) => res.json())
            .then((res) => {
                items = res;
            });
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            goto(`/search?q=${encodeURIComponent(searchInput.value)}`);
        }
    };
</script>

<div class="relative w-full flex justify-center">
    <div
        onfocus={() => {
            // searchInput.focus();
        }}
        class="flex items-center rounded-full pr-6 text-lg bg-blue-50 overflow-hidden focus-within:ring-4 transition-all ring-2 placeholder-blue-400 ring-blue-600 w-full md:max-w-[70%]"
    >
        <input
            bind:this={searchInput}
            oninput={onInput}
            onkeydown={onKeyDown}
            placeholder="Search"
            class="bg-inherit flex-grow outline-none px-6 py-4"
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
            class="z-50 max-h-72 overflow-auto absolute top-20 w-[70%] rounded-md bg-white border-neutral-300 border flex flex-col"
        >
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
