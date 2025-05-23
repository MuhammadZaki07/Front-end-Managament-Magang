import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const StatisticsCard = ({ peserta }) => {
  const years = ["2025", "2023", "2022"];
  const [selectedYear, setSelectedYear] = useState(years[0]);

  // Assuming peserta is an array with data for all years
  const data = {
    "2025": peserta
    // "2023": peserta.filter(item => item.year === 2023),
    // "2022": peserta.filter(item => item.year === 2022),
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const activeData = data[selectedYear] || [];

  const options = {
    chart: {
      type: 'bar',
      height: '100%',
      toolbar: { show: false },
      fontFamily: 'Poppins, Arial, sans-serif',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        columnWidth: '20%',
        endingShape: 'rounded',
        distributed: false,
      },
    },
    dataLabels: {
      enabled: false, // Matikan data labels (angka)
    },
    xaxis: {
      categories: activeData.map(item => item.nama_divisi),
      labels: { style: { fontSize: '10px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: '' },
      max: 10,
      tickAmount: 5,
      labels: {
        formatter: function(val) { return val.toLocaleString(); },
        style: { fontSize: '10px' },
      },
    },
    fill: {
      opacity: 1,
      colors: ['#3A5987'],
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      y: { formatter: function(val) { return val.toLocaleString() + ' Peserta'; } }
    },
    states: {
      hover: {
        filter: { type: 'darken', value: 0.9 },
      }
    },
  };

  const series = [{
    name: 'Peserta',
    data: activeData.map(item => item.total_peserta),
  }];

  return (
    <div className="bg-white-200 bg-white border border-slate-400/[0.5] rounded-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Peserta Per Divisi</h2>
        <div className="relative">
          <select 
            className="border border-gray-300 text-gray-500 rounded-lg px-2 py-1 appearance-none pr-8"
            value={selectedYear}
            onChange={handleYearChange}
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <i className="bi bi-chevron-down text-gray-400"></i>
          </div>
        </div>
      </div>
      
      <div className="relative h-64">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height="100%"
        />
      </div>
    </div>
  );
};

export default StatisticsCard;
