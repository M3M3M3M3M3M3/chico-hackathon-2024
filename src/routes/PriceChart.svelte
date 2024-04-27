<script lang="ts">
    import { Chart } from "chart.js/auto";
    import { onDestroy, onMount } from "svelte";

    let canvas: HTMLCanvasElement;

    onMount(() => {
        const chart = new Chart(canvas, {
            type: "line",
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: false,
                    },
                },
            },
            data: {
                labels: [
                    "Janurary",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ],
                datasets: [
                    {
                        label: "Price",
                        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                        fill: false,
                        borderColor: "rgb(75, 192, 192)",
                        tension: 0.1,
                    },
                ],
            },
        });

        chart.draw();
    });

    onDestroy(() => {});
</script>

<canvas bind:this={canvas}></canvas>
