<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { quintOut } from "svelte/easing";
    import { fade, scale } from "svelte/transition";

    let { close, shown }: { close: () => void; shown: boolean } = $props();

    const keyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            close();
        }
    };

    onMount(() => {
        document.addEventListener("keydown", keyDown);
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
{#if shown}
    <div
        transition:fade={{
            duration: 400,
        }}
        onclick={() => {
            close();
        }}
        class="z-50 fixed left-0 right-0 top-0 bottom-0 bg-black/10 dark:bg-white/10 flex sm:place-items-center place-items-end justify-center overscroll-none"
    >
        <div
            transition:scale={{
                duration: 400,
                opacity: 0.0,
                start: 0.5,
                easing: quintOut,
            }}
            onclick={(e) => {
                e.stopImmediatePropagation();
            }}
            class="container relative w-full h-[90dvh] sm:h-min overflow-auto sm:max-w-screen-sm max-h-screen rounded-t-xl sm:rounded-b-xl shadow-lg bg-white dark:bg-black p-4"
        >
            <button
                onclick={() => close()}
                class="absolute hover:bg-neutral-800 transition-colors top-4 right-4 w-8 h-8 aspect-square rounded-full bg-black dark:bg-white dark:hover:bg-neutral-200 dark:text-black text-white text-center"
            >
                ×
            </button>

            <slot />
        </div>
    </div>
{/if}
