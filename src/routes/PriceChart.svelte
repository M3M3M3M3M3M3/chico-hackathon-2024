<script lang="ts">
  import { Chart } from "chart.js/auto";
  import type { ChartEvent } from "chart.js/auto";
  import { onDestroy, onMount } from "svelte";

  let canvas: HTMLCanvasElement;
  let chart: Chart;

  export let graphData: { day: string; price: number }[];

  let currentMonthIndex = 0;
  let monthlyData: {
    [key: string]: { labels: number[]; prices: (number | null)[] };
  } = {};

  function parseDataIntoMonths() {
    monthlyData = {};
    graphData.forEach((data) => {
      const dataDate = new Date(data.day);
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
  }

  function getCurrentMonthData() {
    const monthKeys = Object.keys(monthlyData);
    const currentMonthKey = monthKeys[currentMonthIndex];
    const [year, month] = currentMonthKey.split("-");
    const { labels, prices } = monthlyData[currentMonthKey];

    return { labels, prices };
  }

  function updateChart() {
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

    chart.data.labels = extendedLabels;
    chart.data.datasets[0].data = extendedPrices;
    const plugins = chart?.options?.plugins;
    if (plugins && plugins.title) {
      plugins.title.text = `${monthName} ${year}`;
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

      class CircleChevron {
        draw(
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
      }

      let shiftUpValue = 164;
      let sideOffSet = 15;

      let drawCircleLeft = new CircleChevron();
      drawCircleLeft.draw(ctx, left + sideOffSet, 5, shiftUpValue);

      let drawCircleRight = new CircleChevron();
      drawCircleRight.draw(ctx, right - sideOffSet, -5, shiftUpValue);
    },
  };

  function clickHandler() {
    const {
      ctx,
      canvas,
      chartArea: { left, right, top, bottom, width, height },
    } = chart;

    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let shiftUp = 164;
      let sideOffSet = 15;

      console.log("click", x, y);
      if (
        x >= left + sideOffSet - 15 &&
        x <= left + sideOffSet + 15 &&
        y >= height / 2 + top - shiftUp - 15 &&
        y <= height / 2 + top - shiftUp + 15
      ) {
        if (currentMonthIndex > 0) {
          currentMonthIndex--;
          updateChart();
          console.log("left");
        }
      } else if (
        x >= right - sideOffSet - 15 &&
        x <= right - sideOffSet + 15 &&
        y >= height / 2 + top - shiftUp - 15 &&
        y <= height / 2 + top - shiftUp + 15
      ) {
        if (currentMonthIndex < Object.keys(monthlyData).length - 1) {
          currentMonthIndex++;
          updateChart();
          console.log("right");
        }
      }
    });
  }

  onMount(() => {
    parseDataIntoMonths();
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
        ],
      },
    });

    updateChart();
    clickHandler();
  });

  onDestroy(() => {});
</script>

<canvas bind:this={canvas}></canvas>
