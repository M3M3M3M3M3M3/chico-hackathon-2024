<script lang="ts">
    export let name: string = '';
  </script>

<a
    href="/featured/{name}"
    class="rounded-md border border-neutral-300 flex flex-col overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:bg-blue-50"
>
    <div class="bg-blue-900 h-24"></div>

    <div class="p-4 font-extrabold">{name}</div>
</a>
