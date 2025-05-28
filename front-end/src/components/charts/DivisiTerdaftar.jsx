import React from 'react';

export default function LowonganChart() {
  const percentage = 84;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">Lowongan</h2>
          <p className="text-sm text-gray-500">Kelola lowongan</p>
        </div>

        {/* Semi-Circle Chart */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg width="200" height="120" viewBox="0 0 200 120">
              {/* Background Semi-Circle - Light Blue */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                stroke="#A5B4FC"
                strokeWidth="24"
                fill="none"
              />
              {/* Active Semi-Circle (84%) - Dark Blue */}
              <path
                d="M 20 100 A 80 80 0 0 1 148 34"
                stroke="#4338CA"
                strokeWidth="24"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center mt-4">
              <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-700 rounded-sm mr-3"></div>
              <span className="text-sm text-gray-600">Lowongan Aktif</span>
            </div>
            <span className="text-sm font-medium text-gray-900">84%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-300 rounded-sm mr-3"></div>
              <span className="text-sm text-gray-600">ppppp</span>
            </div>
            <span className="text-sm font-medium text-gray-900">16%</span>
          </div>
        </div>
      </div>
    </div>
  );
}