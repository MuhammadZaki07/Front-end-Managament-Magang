import { useState, useEffect } from 'react';

export default function MentorPerDivisionChart({ mentor }) {
  const [year, setYear] = useState('2025'); // Default year

  // Dynamically create chart data from mentor prop
  const chartData = mentor.map(item => ({
    name: item.nama_divisi, // Division name
    value: item.total_mentor, // Total mentors in the division
  }));

  // You can use a mapping of year to mentor data if necessary in the future
  const yearData = {
    '2025': chartData, // Default to the data passed in mentor prop
    '2024': chartData, // You can extend this to other years
  };

  // Colors for each division (can be dynamic or predefined)
  const colors = [
    '#2c4d8a', '#5076ba', '#7ba3e8', '#c3d4f2', '#dbe7fb', '#d1d5db',
  ];

  // Get current year data (based on the selected year)
  const currentData = yearData[year] || [];

  const total = currentData.reduce((sum, item) => sum + item.value, 0);

  // Adjust the radius for the donut chart
  const radius = 80; // Size of the donut chart
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercentage = 0;
  const segments = currentData.map((item, index) => {
    const percentage = item.value / total;
    const segmentLength = circumference * percentage;
    const dashArray = `${segmentLength} ${circumference - segmentLength}`;
    const dashOffset = -circumference * accumulatedPercentage;
    accumulatedPercentage += percentage;

    return {
      ...item,
      dashArray,
      dashOffset,
      color: colors[index],
      percentage
    };
  });

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-l font-bold text-gray-800">Jumlah Mentor Per Divisi</h2>
        
        <div className="relative">
          <select 
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="appearance-none bg-white-50 rounded-md px-3 py-1.5 pr-8 text-gray-700 focus:outline-none border border-gray-200 text-sm"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 290 290">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="flex flex-row justify-between items-center">
        {/* Legend */}
        <div className="w-1/2 flex flex-col space-y-4">
          {currentData.map((division, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 mr-2 rounded-full" 
                style={{ backgroundColor: colors[index] }}
              />
              <span className="text-gray-600 text-sm">{division.name}</span>
            </div>
          ))}
        </div>
        
        {/* Donut Chart */}
        <div className="w-1/2 flex justify-end">
          <div className="w-48 h-48 relative">
            <svg width="100%" height="100%" viewBox="0 0 200 200">
              {segments.map((segment, index) => (
                <circle
                  key={index}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="30"
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={segment.dashOffset}
                  transform="rotate(-90 100 100)"
                />
              ))}
              <circle 
                cx="100" 
                cy="100" 
                r="35" // Circle at the center (white space)
                fill="white" 
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
