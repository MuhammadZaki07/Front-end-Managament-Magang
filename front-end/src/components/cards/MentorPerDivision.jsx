import React, { useState } from 'react';

export default function MentorPerDivisionChart({ mentor }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const chartData = mentor?.map(item => ({
    name: item.nama_divisi,
    value: item.total_mentor,
  }));

  const colors = [
    '#2c4d8a', '#5076ba', '#7ba3e8', '#c3d4f2', '#dbe7fb', '#d1d5db',
  ];

  const dummyData = [
  { name: 'Divisi A', value: 5 },
  { name: 'Divisi B', value: 3 },
  { name: 'Divisi C', value: 4 },
  { name: 'Divisi D', value: 2 },
];
  const currentData = chartData || dummyData;

  const total = currentData.reduce((sum, item) => sum + item.value, 0);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const gap = 1; 

  let accumulatedPercentage = 0;
  const segments = currentData.map((item, index) => {
    const percentage = item.value / total;
    const segmentLength = circumference * percentage;
    const adjustedSegmentLength = segmentLength - gap > 0 ? segmentLength - gap : segmentLength;

      const dashArray = `${adjustedSegmentLength} ${circumference - adjustedSegmentLength}`;
      const dashOffset = -circumference * accumulatedPercentage + (gap / 2);
    accumulatedPercentage += percentage;

    return {
      ...item,
      dashArray,
      dashOffset,
      color: colors[index],
      percentage,
    };
  });

  // Tooltip style
  const tooltipStyle = {
    position: 'absolute',
    pointerEvents: 'none',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: 12,
    whiteSpace: 'nowrap',
    transform: 'translate(-50%, -120%)',
    top: tooltipPos.y,
    left: tooltipPos.x,
    transition: 'opacity 0.2s',
    opacity: hoverIndex !== null ? 1 : 0,
    zIndex: 1000,
  };

  // Handler to set tooltip position relative to svg container
  const handleMouseEnter = (index, event) => {
    setHoverIndex(index);
    // Calculate position relative to container
    const svgRect = event.currentTarget.ownerSVGElement.getBoundingClientRect();
    const x = event.clientX - svgRect.left;
    const y = event.clientY - svgRect.top;
    setTooltipPos({ x, y });
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-400/[0.5] p-4 w-full max-w-xl min-h-3/5 relative hover:shadow-blue-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-l font-bold text-gray-800">Jumlah Mentor Per Divisi</h2>
      </div>
      
      <div className="flex flex-col-reverse items-center">
        {/* Legend */}
        <div className="gap-10 flex flex-row ">
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
        <div className="w-1/2 flex justify-end relative">
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
                  strokeWidth="50"
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={segment.dashOffset}
                  transform="rotate(-90 100 100)"
                  onMouseEnter={(e) => handleMouseEnter(index, e)}
                  onMouseMove={(e) => handleMouseEnter(index, e)}
                  onMouseLeave={handleMouseLeave}
                  style={{ cursor: 'pointer' }}
                />
              ))}
              <circle 
                cx="100" 
                cy="100" 
                r="35" 
                fill="white" 
              />
            </svg>

            {/* Tooltip */}
            {hoverIndex !== null && (
              <div style={tooltipStyle}>
                <strong>{segments[hoverIndex].name}</strong><br />
                {segments[hoverIndex].value} mentor
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
