import React, { useState } from "react";
import Chart from "react-apexcharts";
import Title from "../Title";

const StaticAbsensiPerusahaan = () => {
  const [filter, setFilter] = useState("Cabang A");
  
  const dataOptions = {
    "Cabang A": {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      series: [
        { name: "Hadir", data: [3, 4, 5, 6, 7, 8, 9, 7, 6, 5, 4, 5] },
        { name: "Tidak Hadir", data: [1, 1, 2, 1, 2, 1, 2, 3, 2, 3, 2, 3] },
        { name: "Izin", data: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1] },
      ],
    },
    "Cabang B": {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      series: [
        { name: "Hadir", data: [3, 6, 7, 6, 5, 4, 5, 6, 7, 6, 7, 8] },
        { name: "Tidak Hadir", data: [2, 3, 2, 3, 2, 1, 2, 1, 2, 1, 1, 2] },
        { name: "Izin", data: [1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1] },
      ],
    },
    "Cabang C": {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      series: [
        { name: "Hadir", data: [3, 7, 8, 7, 6, 7, 8, 9, 8, 7, 6, 5] },
        { name: "Tidak Hadir", data: [1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 2, 3] },
        { name: "Izin", data: [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0] },
      ],
    },
    "Cabang D": {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      series: [
        { name: "Hadir", data: [4, 3, 4, 5, 6, 5, 4, 4, 5, 6, 7, 6] },
        { name: "Tidak Hadir", data: [3, 2, 2, 1, 1, 2, 3, 2, 3, 2, 1, 1] },
        { name: "Izin", data: [1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1] },
      ],
    },
  };
  
  // Membuat custom legend secara manual
  const renderCustomLegend = () => {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: "#27CFA7" }}></span>
          <span className="text-sm">Hadir</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: "#1E40AF" }}></span>
          <span className="text-sm">Tidak Hadir</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: "#F1C40F" }}></span>
          <span className="text-sm">Izin</span>
        </div>
      </div>
    );
  };
  
  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
    },
    colors: ["#27CFA7", "#1E40AF", "#F1C40F"],
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
    xaxis: {
      categories: dataOptions[filter].categories,
    },
    yaxis: {
      min: 0,
      max: 10,
    },
    legend: {
      show: false, // Sembunyikan legend bawaan ApexCharts
    },
  };
  
  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-3">
        <Title className="ml-5">Statistik Absensi</Title>
        <div className="flex items-center space-x-3">
          {renderCustomLegend()} {/* Custom legend di samping filter */}
          <select
            className="border border-gray-300/[0.5] rounded-lg px-2 py-0.5 text-sm text-center text-gray-500 z-5 focus:outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {Object.keys(dataOptions).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
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

export default StaticAbsensiPerusahaan;