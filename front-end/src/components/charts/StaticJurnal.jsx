import React, { useState } from "react";
import Chart from "react-apexcharts";
import Title from "../Title";

const StaticJurnal = () => {
  const [filter, setFilter] = useState("Yearly");

  const dataOptions = {
    Yearly: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      series: [
        { name: "Mengisi", data: [2, 3, 2, 4, 3, 6, 3, 4, 3, 4, 3, 5] },
        { name: "Tidak Mengisi", data: [1, 2, 3, 6, 4, 8, 5, 6, 5, 6, 5, 7] },
      ],
    },
    Monthly: {
      categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
      series: [
        { name: "Mengisi", data: [5, 7, 6, 8] },
        { name: "Tidak Mengisi", data: [3, 5, 4, 6] },
      ],
    },
    Weekly: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      series: [
        { name: "Mengisi", data: [1, 2, 3, 2, 4, 3, 5] },
        { name: "Tidak Mengisi", data: [2, 1, 3, 2, 3, 4, 2] },
      ],
    },
  };

  const options = {
    chart: { type: "area", toolbar: { show: false } },
    colors: ["#1E40AF", "#DC2626"],
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    xaxis: { categories: dataOptions[filter].categories },
    yaxis: { min: 0, max: 10 },
    legend: {
      position: "top",
      horizontalAlign: "left",
      floating: true,
      offsetX: 570,
      offsetY: -40,
    },
  };

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Title className="ml-5">Statistik Jurnal</Title>
        <select
          className="border border-gray-300/[0.5] rounded-lg px-2 py-0.5 text-sm text-center text-gray-500 z-5 focus:outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="Yearly">Yearly</option>
          <option value="Monthly">Monthly</option>
          <option value="Weekly">Weekly</option>
        </select>
      </div>
      <Chart
        options={options}
        series={dataOptions[filter].series}
        type="area"
        height={300}
      />
    </>
  );
};

export default StaticJurnal;
