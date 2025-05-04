import React, { useState } from "react";
import Chart from "react-apexcharts";

const chartData = {
  "Cabang A": {
    aktif: [42, 53, 40, 48, 36, 41, 49, 43, 54, 39, 50, 38],
    alumni: [25, 22, 19, 39, 30, 28, 30, 26, 22, 20, 35, 29],
  },
  "Cabang B": {
    aktif: [30, 40, 35, 44, 32, 35, 45, 40, 48, 33, 42, 31],
    alumni: [20, 18, 17, 26, 20, 22, 21, 19, 18, 17, 24, 20],
  },
};

const MagangChart = () => {
  const branches = Object.keys(chartData);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);

  const series = [
    {
      name: "Aktif",
      data: chartData[selectedBranch].aktif,
    },
    {
      name: "Alumni",
      data: chartData[selectedBranch].alumni,
    },
  ];

  const options = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    colors: ["#2563eb", "#bfdbfe"],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: "25%", // kecilin bar
      },
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: {
        colors: "#000",
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      strokeDashArray: 5,
    },
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Jumlah Peserta Magang Per Cabang
        </h2>
        <select
          className="text-sm border border-gray-300 rounded px-2 py-1"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>
      <Chart options={options} series={series} type="bar" height={370} />
    </div>
  );
};

export default MagangChart;
