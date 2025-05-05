import React from 'react';
import Chart from 'react-apexcharts';

const JobCard = ({ job, onClick, isActive }) => {
  const chartOptions = {
    chart: {
      type: 'line',
      height: 40,
      sparkline: {
        enabled: true
      },
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: [job.color === 'orange' ? '#f97316' : job.color === 'indigo' ? '#6366f1' : '#10b981'],
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: () => job.title
        }
      },
      marker: {
        show: false
      }
    },
    grid: {
      show: false
    },
    xaxis: {
      labels: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false
    }
  };
  
  const chartSeries = [
    {
      name: job.title,
      data: job.chartData
    }
  ];

  return (
    <div
      className={`bg-white rounded-xl border border-slate-400/[0.5] py-6 px-4 w-full cursor-pointer transition-all duration-300 ${
        isActive ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${
          job.color === 'orange' ? 'bg-orange-100' : 
          job.color === 'indigo' ? 'bg-indigo-100' : 
          'bg-emerald-100'
        }`}>
          <div className={`w-6 h-6 flex items-center justify-center ${
            job.color === 'orange' ? 'text-orange-500' : 
            job.color === 'indigo' ? 'text-indigo-500' : 
            'text-emerald-500'
          }`}>
            {job.iconType === "people" && <i className="bi bi-people-fill"></i>}
            {job.iconType === "display" && <i className="bi bi-bar-chart-line-fill"></i>}
            {job.iconType === "graduate" && <i className="bi bi-mortarboard-fill"></i>}
          </div>
        </div>
        <span className="text-sm font-medium">{job.title}</span>
      </div>
      <div className="flex items-end justify-between mt-4">
        <h3 className="text-xl font-bold">{job.count} Lowongan</h3>
        <div className="h-10 w-24">
          {typeof window !== 'undefined' && (
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="line"
              height={40}
              width={96}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;