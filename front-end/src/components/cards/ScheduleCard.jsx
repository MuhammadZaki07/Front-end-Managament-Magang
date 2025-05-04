import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function ScheduleCard() {
  const [days, setDays] = useState({
    senin: false,
    selasa: false,
    rabu: false,
    kamis: false,
    jumat: false
  });

  // Initial times for each day
  const [times, setTimes] = useState({
    senin: {
      masuk: { start: "07.00", end: "07.00" },
      istirahat: { start: "07.00", end: "07.00" },
      kembali: { start: "07.00", end: "07.00" },
      pulang: { start: "07.00", end: "07.00" }
    },
    selasa: {
      masuk: { start: "08.00", end: "12.00" },
      istirahat: { start: "12.00", end: "13.00" },
      kembali: { start: "12.35", end: "13.00" },
      pulang: { start: "13.00", end: "16.00" }
    },
    rabu: {
      masuk: { start: "08.00", end: "12.00" },
      istirahat: { start: "12.00", end: "13.00" },
      kembali: { start: "12.35", end: "13.00" },
      pulang: { start: "13.00", end: "16.00" }
    },
    kamis: {
      masuk: { start: "08.00", end: "12.00" },
      istirahat: { start: "12.00", end: "13.00" },
      kembali: { start: "12.35", end: "13.00" },
      pulang: { start: "13.00", end: "16.00" }
    },
    jumat: {
      masuk: { start: "08.00", end: "12.00" },
      istirahat: { start: "12.00", end: "13.00" },
      kembali: { start: "12.35", end: "13.00" },
      pulang: { start: "13.00", end: "16.00" }
    }
  });

  const toggleDay = (day) => {
    setDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const updateTime = (day, type, field, value) => {
    setTimes(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: {
          ...prev[day][type],
          [field]: value
        }
      }
    }));
  };

  const timeOptions = [
    "07.00", "07.30", "08.00", "08.30", "09.00", "09.30", "10.00", 
    "10.30", "11.00", "11.30", "12.00", "12.30", "12.35", "13.00", 
    "13.30", "14.00", "14.30", "15.00", "15.30", "16.00", "16.30", "17.00"
  ];

  const dayNames = {
    senin: 'Senin',
    selasa: 'Selasa',
    rabu: 'Rabu',
    kamis: 'Kamis',
    jumat: 'Jum\'at'
  };

  const renderTimeSelector = (day, type, field, value) => {
    return (
      <div className="relative">
        <select 
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md appearance-none pr-6 hover:border-gray-400 focus:border-indigo-500 focus:outline-none transition-colors"
          value={value}
          onChange={(e) => updateTime(day, type, field, e.target.value)}
        >
          {timeOptions.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-1 top-1.5 text-gray-400 pointer-events-none" size={12} />
      </div>
    );
  };

  return (
<div className="bg-white-100 rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 w-full max-w-2xl">
<div className="flex flex-col gap-2">
        {/* Loop through all days */}
        {Object.keys(days).map((day) => (
          <div key={day} className="border border-gray-200 rounded-lg p-2">
            {!days[day] ? (
              // Collapsed view when toggle is off
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-8 h-4 rounded-full flex items-center ${days[day] ? 'bg-indigo-600' : 'bg-gray-300'} relative cursor-pointer hover:opacity-80 transition-opacity`}
                    onClick={() => toggleDay(day)}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full absolute ${days[day] ? 'right-0.5' : 'left-0.5'} transition-all`}></div>
                  </div>
                  <span className="font-medium">{dayNames[day]}</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-32 text-center text-xs text-gray-500">
                    {times[day].masuk.start} - {times[day].masuk.end}
                  </div>
                  <div className="w-32 text-center text-xs text-gray-500">
                    {times[day].istirahat.start} - {times[day].istirahat.end}
                  </div>
                  <div className="w-32 text-center text-xs text-gray-500">
                    {times[day].kembali.start} - {times[day].kembali.end}
                  </div>
                  <div className="w-32 text-center text-xs text-gray-500">
                    {times[day].pulang.start} - {times[day].pulang.end}
                  </div>
                  <ChevronDown className="text-gray-400 ml-2" size={12} />
                </div>
              </div>
            ) : (
              // Expanded view when toggle is on
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-8 h-4 rounded-full flex items-center ${days[day] ? 'bg-indigo-600' : 'bg-gray-300'} relative cursor-pointer hover:opacity-80 transition-opacity`}
                    onClick={() => toggleDay(day)}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full absolute ${days[day] ? 'right-0.5' : 'left-0.5'} transition-all`}></div>
                  </div>
                  <span className="font-medium">{dayNames[day]}</span>
                </div>

                {/* Time fields with better spacing */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Labels column */}
                  <div className="col-span-2">
                    <div className="mb-3">
                      <label className="text-xs font-medium">Jam Masuk</label>
                    </div>
                    <div className="mb-3">
                      <label className="text-xs font-medium">Jam Istirahat</label>
                    </div>
                    <div className="mb-3">
                      <label className="text-xs font-medium">Jam Kembali</label>
                    </div>
                    <div className="mb-3">
                      <label className="text-xs font-medium">Jam Pulang</label>
                    </div>
                  </div>

                  {/* Start time column */}
                  <div className="col-span-2">
                    <div className="mb-2">
                      {renderTimeSelector(day, 'masuk', 'start', times[day].masuk.start)}
                    </div>
                    <div className="mb-2">
                      {renderTimeSelector(day, 'istirahat', 'start', times[day].istirahat.start)}
                    </div>
                    <div className="mb-2">
                      {renderTimeSelector(day, 'kembali', 'start', times[day].kembali.start)}
                    </div>
                    <div className="mb-2">
                      {renderTimeSelector(day, 'pulang', 'start', times[day].pulang.start)}
                    </div>
                  </div>

                  {/* Dash column */}
                  <div className="flex flex-col items-center">
                    <div className="mb-2 h-8 flex items-center">
                      <span className="text-sm font-medium">-</span>
                    </div>
                    <div className="mb-2 h-8 flex items-center">
                      <span className="text-sm font-medium">-</span>
                    </div>
                    <div className="mb-2 h-8 flex items-center">
                      <span className="text-sm font-medium">-</span>
                    </div>
                    <div className="mb-2 h-8 flex items-center">
                      <span className="text-sm font-medium">-</span>
                    </div>
                  </div>

                  {/* End time column */}
                  <div className="col-span-2">
                    <div className="mb-2">
                      {renderTimeSelector(day, 'masuk', 'end', times[day].masuk.end)}
                    </div>
                    <div className="mb-2">
                      {renderTimeSelector(day, 'istirahat', 'end', times[day].istirahat.end)}
                    </div>
                    <div className="mb-2">
                      {renderTimeSelector(day, 'kembali', 'end', times[day].kembali.end)}
                    </div>
                    <div className="mb-2">
                      {renderTimeSelector(day, 'pulang', 'end', times[day].pulang.end)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}