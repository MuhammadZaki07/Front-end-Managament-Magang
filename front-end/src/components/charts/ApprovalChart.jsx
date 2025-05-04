import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

const ApprovalChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    chartRef.current.chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Menunggu Konfirmasi", "Ditolak"],
        datasets: [
          {
            data: [65, 35],
            backgroundColor: ["#1976d2", "#e53935"],
            borderColor: "#fff",
            borderWidth: 3,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: (ctx) => ctx.dataset.backgroundColor[ctx.dataIndex],
            formatter: (value, context) => {
              return context.chart.data.labels[context.dataIndex];
            },
            anchor: "end",
            align: "end",
            offset: 20,
            font: {
              weight: "bold",
              size: 12,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
      plugins: [ChartDataLabels],
    });
  }, []);

  return (
    <div>
      <div className="border-b border-slate-300/[0.5] py-2">
        <div className="px-5 flex justify-between">
          <h3 className="text-lg text-left font-semibold">Total Absensi</h3>
          <i className="bi bi-three-dots"></i>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative w-[200px] h-[200px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="flex justify-around mt-6">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mb-1"></div>
          <div className="text-xs text-red-500">Ditolak</div>
          <div className="font-bold text-sm mt-1">35.0%</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 bg-blue-600 rounded-full mb-1"></div>
          <div className="text-xs text-blue-600">Menunggu Konfirmasi</div>
          <div className="font-bold text-sm mt-1">65.0%</div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalChart;
