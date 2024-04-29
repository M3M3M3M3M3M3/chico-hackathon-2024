<script lang="ts">
import { onDestroy, onMount, type Snippet } from "svelte";
import { quintOut } from "svelte/easing";
import { fade, scale } from "svelte/transition";

let {
    close,
    children,
    shown,
}: { close: () => void; children: Snippet; shown: boolean } = $props();
let dialogElement = $state<HTMLDialogElement>();
let childrenCopy = $state<Snippet>(children);

$effect(() => {
    if (shown) {
        dialogElement?.showModal();
    } else {
        dialogElement?.close();
    }
});
</script>

<dialog
    bind:this={dialogElement}
    onclose={(e) => {
        if (shown) close();
    }}
    class="fixed z-50 mb-0 flex h-[90dvh] max-h-screen w-full max-w-full flex-col overflow-auto rounded-t-xl bg-white p-4 sm:m-auto sm:h-min sm:max-w-screen-sm sm:rounded-b-xl dark:bg-black"
>
    <button
        onclick={() => dialogElement?.close()}
        class="sticky top-0 mb-[-3rem] aspect-square min-h-12 min-w-12 select-none self-end rounded-full bg-black text-center text-2xl text-white transition-colors hover:bg-neutral-800 sm:mb-0 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
    >
        ×
    </button>

    {@render childrenCopy()}
</dialog>

<style>
dialog {
    opacity: 1;
    transform: translateY(0);
    transition:
        box-shadow 300ms cubic-bezier(0.645, 0.045, 0.355, 1),
        opacity 300ms cubic-bezier(0.645, 0.045, 0.355, 1),
        transform 300ms cubic-bezier(0.645, 0.045, 0.355, 1);

    box-shadow:
        0 0 0 calc(max(400vw, 400vh)) rgba(0, 0, 0, 0.2),
        0 4px 16px -2px rgba(0, 0, 0, 0.3);
}

dialog::backdrop {
    display: none;
}

dialog:not([open]) {
    opacity: 0;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);

    pointer-events: none;
    transform: translateY(100vh);
}

@media (min-width: 640px) {
    dialog {
        transition:
            box-shadow 300ms cubic-bezier(0.215, 0.61, 0.355, 1),
            opacity 300ms cubic-bezier(0.215, 0.61, 0.355, 1),
            transform 300ms cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    dialog:not([open]) {
        transform: translateY(100px) scale(0.4);
    }
}
</style>
