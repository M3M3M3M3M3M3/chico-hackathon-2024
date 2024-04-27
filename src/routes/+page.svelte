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

    <span class="font-bold text-lg">Featured Items</span>

    <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
        <FeaturedCategory name="Milk"/>
        <FeaturedCategory name="Ice Cream"/>
        <FeaturedCategory name="Cracker"/>
        <FeaturedCategory name="Bread"/>
        <FeaturedCategory name="Yogurt"/>
        <FeaturedCategory name="Dog Food"/>
    </div>
</section>
