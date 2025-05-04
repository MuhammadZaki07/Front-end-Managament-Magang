import React from "react";
import Chart from "react-apexcharts";

const StatistikJurnalChartMini = () => {
  const series = [
    {
      name: "Mengisi",
      data: [65, 75, 58, 68, 45, 60, 70],
    },
    {
      name: "Tidak Mengisi",
      data: [20, 18, 22, 38, 30, 28, 32],
    },
  ];

  const options = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    colors: ["#00D1B2", "#B2F1E6"],
    plotOptions: {
      bar: {
        columnWidth: "35%",
        borderRadius: 3,
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    xaxis: {
      categories: ["S", "M", "T", "W", "T", "F", "S"],
      labels: {
        style: { fontSize: "12px", colors: "#94A3B8" },
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", colors: "#94A3B8" },
      },
      max: 120,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      markers: { radius: 10 },
      fontSize: "12px",
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 4,
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  return (
    <div className="w-[320px] px-2 py-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-slate-900">Statistik Jurnal</h2>
        <button className="px-2 py-0.5 border border-slate-300 rounded-md text-slate-500 text-xs">
          Cabang A ▼
        </button>
      </div>
      <Chart options={options} series={series} type="bar" height={240} />
    </div>
  );
};

export default StatistikJurnalChartMini;
