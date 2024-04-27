<script>
    import "../app.css";
</script>

<div class="flex flex-col gap-4">
    <div class="bg-neutral-200 p-4">
        <div class="container">
            <a href="/" class="text-3xl font-extrabold hover:underline">
                Safeway
            </a>
        </div>
    </div>

    <main class="container mx-auto">
        <div class="p-0 md:p-4">
            <slot />
        </div>
    </main>
</div>
