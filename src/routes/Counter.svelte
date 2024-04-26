<script lang="ts">
    let count = $state(0);
</script>

<div class="counter">
    <button
        onclick={() => (count += 1)}
        aria-label="Increase the counter by one"
    >
        {count}
    </button>
</div>
