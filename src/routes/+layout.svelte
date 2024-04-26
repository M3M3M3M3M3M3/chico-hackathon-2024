<script>
    import "../app.css";
</script>

<div class="flex flex-col gap-4">
    <div class="bg-neutral-200 p-4">
        <div class="container">
            <span class="text-3xl font-extrabold">Safeway</span>
        </div>
    </div>

    <main class="container mx-auto">
        <slot />
    </main>
</div>
