<script lang="ts">
import { Chart } from "chart.js/auto";
import type { ChartEvent } from "chart.js/auto";
import { onDestroy, onMount } from "svelte";

let canvas: HTMLCanvasElement;
let chart: Chart;

const {
    priceData,
    dealData,
}: {
    priceData: { date: string; price: number }[];
    dealData: { date: string; price: number };
} = $props();

let currentMonthIndex = 0;
let maxMonthIndex = 0;
let monthlyData: Record<
    string,
    { labels: number[]; prices: (number | null)[] }
> = {};

function parseDataIntoMonths() {
    monthlyData = {};
    priceData.forEach((data) => {
        const dataDate = new Date(data.date);
        const year = dataDate.getUTCFullYear();
        const month = dataDate.getUTCMonth();
        const day = dataDate.getUTCDate();
        const monthKey = `${year}-${month}`;

        if (!monthlyData[monthKey]) {
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            monthlyData[monthKey] = {
                labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
                prices: new Array(daysInMonth).fill(null),
            };
        }

        const dayIndex = day - 1;
        monthlyData[monthKey].prices[dayIndex] = data.price;
    });
    currentMonthIndex = Object.keys(monthlyData).length - 1;

    const dealDate = new Date(dealData.date);
    const dealYear = dealDate.getUTCFullYear();
    const dealMonth = dealDate.getUTCMonth();
    const lastMonthKey = Object.keys(monthlyData).pop();
    if (lastMonthKey) {
        const [lastMonthYear, lastMonthMonth] = lastMonthKey
            .split("-")
            .map(Number);

        if (
            dealYear > lastMonthYear ||
            (dealYear === lastMonthYear && dealMonth > lastMonthMonth)
        ) {
            maxMonthIndex = Object.keys(monthlyData).length;
        } else {
            maxMonthIndex = Object.keys(monthlyData).length - 1;
        }
    }
    currentMonthIndex = Object.keys(monthlyData).length - 1;
}

function getCurrentMonthData() {
    const monthKeys = Object.keys(monthlyData);
    const currentMonthKey = monthKeys[currentMonthIndex];
    const [year, month] = currentMonthKey.split("-");
    const { labels, prices } = monthlyData[currentMonthKey];

    return { labels, prices };
}

function updateChart() {
    if (
        currentMonthIndex === maxMonthIndex &&
        maxMonthIndex === Object.keys(monthlyData).length
    ) {
        const extendedLabels = Array.from({ length: 32 }, (_, i) => i + 1);
        const extendedPrices = Array(32).fill(null);

        chart.data.labels = extendedLabels;
        chart.data.datasets[0].data = extendedPrices;

        const dealDate = new Date(dealData.date);
        const dealDay = dealDate.getUTCDate();

        chart.data.datasets[1] = {
            label: "Deal",
            data: [
                { x: 1, y: dealData.price },
                { x: dealDay, y: dealData.price },
            ],
            fill: false,
            borderColor: "red",
            stepped: "before",
        };
    } else {
        const { labels, prices } = getCurrentMonthData();

        const [year, month] =
            Object.keys(monthlyData)[currentMonthIndex].split("-");
        const monthName = new Date(Number(year), Number(month)).toLocaleString(
            "default",
            { month: "long" }
        );

        const extendedLabels = Array.from({ length: 32 }, (_, i) => i + 1);
        const extendedPrices = Array(32).fill(null);
        labels.forEach((label, index) => {
            extendedPrices[label - 1] = prices[index];
        });

        const lastNonNullIndex = prices.findLastIndex(
            (price) => price !== null
        );

        chart.data.labels = extendedLabels;
        chart.data.datasets[0].data = extendedPrices;

        if (lastNonNullIndex !== -1) {
            const dealDate = new Date(dealData.date);
            const dealYear = dealDate.getUTCFullYear();
            const dealMonth = dealDate.getUTCMonth();
            const dealDay = dealDate.getUTCDate();

            if (dealYear === Number(year) && dealMonth === Number(month)) {
                chart.data.datasets[1] = {
                    label: "Deal",
                    data: [
                        {
                            x: lastNonNullIndex + 1,
                            y: extendedPrices[lastNonNullIndex],
                        },
                        { x: dealDay, y: dealData.price },
                    ],
                    fill: false,
                    borderColor: "red",
                    stepped: "before",
                };
            } else if (
                dealYear === Number(year) &&
                dealMonth - 1 === Number(month)
            ) {
                const daysInCurrentMonth = new Date(
                    Number(year),
                    Number(month) + 1,
                    0
                ).getDate();
                chart.data.datasets[1] = {
                    label: "Deal",
                    data: [
                        {
                            x: lastNonNullIndex + 1,
                            y: extendedPrices[lastNonNullIndex],
                        },
                        {
                            x: daysInCurrentMonth,
                            y: extendedPrices[lastNonNullIndex],
                        },
                    ],
                    fill: false,
                    borderColor: "red",
                    stepped: "before",
                };
            } else {
                chart.data.datasets.splice(1, 1);
            }
        }

        const plugins = chart?.options?.plugins;
        if (plugins && plugins.title) {
            plugins.title.text = `${monthName} ${year}`;
        }
    }

    chart.update();
}

const ButtonPlugin = {
    id: "buttonPlugin",
    afterEvent: (
        chart: Chart,
        args: { event: ChartEvent; replay: boolean }
    ) => {
        const {
            ctx,
            chartArea: { left, right, top, bottom, width, height },
        } = chart;

        canvas.addEventListener("mousemove", (event) => {
            const x = args.event.x;
            const y = args.event.y;

            let shiftUp = 164;
            let sideOffSet = 15;

            if (
                x &&
                x >= left + sideOffSet - 15 &&
                x <= left + sideOffSet + 15 &&
                y &&
                y >= height / 2 + top - shiftUp - 15 &&
                y <= height / 2 + top - shiftUp + 15
            ) {
                canvas.style.cursor = "pointer";
            } else if (
                x &&
                x >= right - sideOffSet - 15 &&
                x <= right - sideOffSet + 15 &&
                y &&
                y >= height / 2 + top - shiftUp - 15 &&
                y <= height / 2 + top - shiftUp + 15
            ) {
                canvas.style.cursor = "pointer";
            } else {
                canvas.style.cursor = "default";
            }
        });
    },
    afterDraw: (chart: Chart) => {
        const {
            ctx,
            chartArea: { left, right, top, bottom, width, height },
        } = chart;

        function circleChevron(
            ctx: CanvasRenderingContext2D,
            x1: number,
            pixel: number,
            shiftUp: number
        ) {
            const angle = Math.PI / 180;
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "rgba(102, 102, 102, 0.5)";
            ctx.fillStyle = "white";
            ctx.arc(
                x1,
                height / 2 + top - shiftUp,
                15,
                angle * 0,
                angle * 360,
                false
            );
            ctx.stroke();
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "rgba(255, 26, 104, 1)";
            ctx.moveTo(x1 + pixel, height / 2 + top - 7.5 - shiftUp);
            ctx.lineTo(x1 - pixel, height / 2 + top - shiftUp);
            ctx.lineTo(x1 + pixel, height / 2 + top + 7.5 - shiftUp);
            ctx.stroke();
            ctx.closePath();
        }

        let shiftUpValue = 164;
        let sideOffSet = 15;

        circleChevron(ctx, left + sideOffSet, 5, shiftUpValue);
        circleChevron(ctx, right - sideOffSet, -5, shiftUpValue);
    },
};
function clickHandler() {
    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let shiftUp = 164;
        let sideOffSet = 15;

        const { left, right, top, bottom, width, height } = chart.chartArea;

        if (
            x >= left + sideOffSet - 15 &&
            x <= left + sideOffSet + 15 &&
            y >= height / 2 + top - shiftUp - 15 &&
            y <= height / 2 + top - shiftUp + 15
        ) {
            if (currentMonthIndex > 0) {
                currentMonthIndex--;
                updateChart();
            }
        } else if (
            x >= right - sideOffSet - 15 &&
            x <= right - sideOffSet + 15 &&
            y >= height / 2 + top - shiftUp - 15 &&
            y <= height / 2 + top - shiftUp + 15
        ) {
            if (currentMonthIndex < maxMonthIndex) {
                currentMonthIndex++;
                updateChart();
            }
        }
    });
}

$effect(() => {
    parseDataIntoMonths();

    if (chart) chart.destroy();
    chart = new Chart(canvas, {
        type: "line",
        plugins: [ButtonPlugin],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 4.5,
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false,
                },
                title: {
                    display: true,
                    text: "",
                },
            },
            scales: {
                x: {
                    min: 1,
                    max: 32,
                    // offset: true,
                    grid: {
                        offset: false,
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10,
                    },
                },
            },
        },
        data: {
            labels: [],
            datasets: [
                {
                    label: "Price",
                    data: [],
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    stepped: "before",
                },
                {
                    label: "Deal",
                    data: [],
                    borderColor: "rgba(255, 26, 104, 1)",
                    backgroundColor: "rgba(255, 26, 104, 1)",
                    pointRadius: 5,
                    pointHoverRadius: 7,
                },
            ],
        },
    });

    updateChart();
    clickHandler();
});

onDestroy(() => {
    if (chart) chart.destroy();
});
</script>

<canvas bind:this={canvas}></canvas>
