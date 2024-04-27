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
        class="z-50 fixed left-0 right-0 top-0 bottom-0 bg-black/10 flex place-items-center justify-center"
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
            class="container max-w-screen-sm max-h-screen rounded-xl shadow-lg bg-white p-4"
        >
            <slot />
        </div>
    </div>
{/if}
