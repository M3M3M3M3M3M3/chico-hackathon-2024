<script>
    import FeaturedCategory from "./FeaturedCategory.svelte";
    import FeaturedItem from "./FeaturedItem.svelte";
    import SearchBar from "./SearchBar.svelte";
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="flex flex-col gap-4 px-4">
    <div class="flex justify-center">
        <SearchBar />
    </div>
</section>
