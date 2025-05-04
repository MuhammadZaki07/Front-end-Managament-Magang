import React from "react";
import Chart from "react-apexcharts";

const JobCard = ({ job, onClick }) => {
  const chartOptions = {
    chart: {
      type: "area",
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.3,
        opacityFrom: 0.7,
        opacityTo: 0,
      },
    },
    colors: [job.color],
    xaxis: {
      labels: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: { show: false },
    grid: { show: false },
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, dataPointIndex }) {
        const value = series[seriesIndex][dataPointIndex];
        return `
          <div style="
            background: white;
            padding: 6px 10px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            font-size: 13px;
            font-weight: 500;
            color: #333;
          ">
            ${value}
          </div>
        `;
      },
    },
    markers: { size: 0 },
  };

  return (
    <div 
      className="bg-white rounded-lg py-4 px-5 w-full border border-gray-300/[0.8] hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer relative"
      onClick={onClick}
    >
      <div className="flex items-center mb-2">
        <div 
          className="w-10 h-10 rounded-full flex justify-center items-center mr-3"
          style={{ backgroundColor: job.color }}
        >
          {job.iconType === 'people' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
            </svg>
          )}
          {job.iconType === 'display' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
              <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4c0 .667.083 1.167.25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75c.167-.333.25-.833.25-1.5H2s-2 0-2-2V4zm1.398-.855a.758.758 0 0 0-.254.302A1.46 1.46 0 0 0 1 4.01V10c0 .325.078.502.145.602.07.105.17.188.302.254a1.464 1.464 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.758.758 0 0 0 .254-.302 1.464 1.464 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.757.757 0 0 0-.302-.254A1.46 1.46 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145z"/>
            </svg>
          )}
          {job.iconType === 'graduate' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
              <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z"/>
              <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z"/>
            </svg>
          )}
        </div>
        <div>
          <h1 className="font-semibold text-sm text-gray-900">{job.title}</h1>
        </div>
      </div>

      {/* Lowongan dan Chart di bawah */}
      <div className="flex items-end justify-between mt-6">
        <div>
          <h2 className="font-medium text-xl text-gray-800">{job.count} Lowongan</h2>
        </div>
        <div className="w-24 h-16">
          <Chart
            options={chartOptions}
            series={[{ name: job.title, data: job.chartData }]}
            type="area"
            height={60}
            width={100}
          />
        </div>
      </div>
    </div>
  );
};

export default JobCard;
