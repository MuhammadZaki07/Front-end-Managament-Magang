import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Chart from 'react-apexcharts'; // langsung import tanpa dynamic


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
          {/* ApexCharts component */}
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


const JobDetail = ({ job, onClose }) => {
  if (!job) return null;
  
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Detail Lowongan</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="mb-4">
        <img 
          src="/assets/img/Cover.png" 
          alt="Company" 
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
        <div className="relative -mt-8 flex justify-center">
          <div className="w-16 h-16 bg-white rounded-full p-1 shadow-md">
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <i className="bi bi-building text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      
      <h3 className="text-center text-lg font-bold mt-2">{job.company}</h3>
      <p className="text-center text-sm text-gray-500 mb-6">{job.location}</p>
      
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Informasi Detail</h4>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 text-blue-500"><i className="bi bi-bar-chart-line-fill"></i></div>
            <span className="text-sm text-gray-500">Status Lowongan:</span>
          </div>
          <p className="pl-7 text-sm font-medium">
            <span className={`px-2 py-1 rounded-full text-xs ${
              job.status === "Berlangsung" 
                ? "bg-orange-100 text-orange-500" 
                : "bg-emerald-100 text-emerald-500"
            }`}>
              {job.status}
            </span>
          </p>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 text-blue-500">👥</div>
            <span className="text-sm text-gray-500">Total Pendaftar:</span>
          </div>
          <p className="pl-7 text-sm font-medium">{job.pendaftar}</p>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 text-blue-500">📅</div>
            <span className="text-sm text-gray-500">Durasi Lowongan:</span>
          </div>
          <p className="pl-7 text-sm font-medium">{job.durasi}</p>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 text-blue-500">📍</div>
            <span className="text-sm text-gray-500">Lokasi Penempatan:</span>
          </div>
          <p className="pl-7 text-sm font-medium">{job.lokasiPenempatan}</p>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 text-blue-500">🌐</div>
            <span className="text-sm text-gray-500">Website:</span>
          </div>
          <p className="pl-7 text-sm font-medium">{job.website}</p>
        </div>
      </div>
      
      <div className="mt-8 flex gap-2">
        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50 flex-1">
          Tutup Lowongan
        </button>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 flex-1">
          Edit
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [sortStatus, setSortStatus] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const jobData = [
    {
      id: 1,
      title: "Total Lowongan",
      count: 20,
      color: "orange",
      iconType: "people",
      chartData: [10, 12, 15, 14, 16, 17, 18, 20],
      company: "PT. HUMMA TECHNOLOGY INDONESIA",
      location: "Malang, Indonesia",
      address: "Jl. Pemuda Kaffa Blok. 20 No.5",
      quota: "250 Orang",
      status: "Berlangsung",
      pendaftar: "60/150",
      durasi: "15 Juni - 15 Juli 2025",
      lokasiPenempatan: "Surabaya, Indonesia",
      website: "hummatech.co.id",
    },
    {
      id: 2,
      title: "Total Lowongan Aktif",
      count: 20,
      color: "indigo",
      iconType: "display",
      chartData: [5, 7, 9, 10, 12, 15, 18, 20],
      company: "PT. HUMMA TECHNOLOGY INDONESIA",
      location: "Malang, Indonesia",
      address: "Jl. Pemuda Kaffa Blok. 20 No.5",
      quota: "250 Orang",
      status: "Selesai",
      pendaftar: "150/150",
      durasi: "10 Mei - 10 Juni 2025",
      lokasiPenempatan: "Jakarta, Indonesia",
      website: "hummatech.co.id",
    },
    {
      id: 3,
      title: "Total Lowongan Tidak Aktif",
      count: 20,
      color: "emerald",
      iconType: "graduate",
      chartData: [20, 18, 16, 15, 12, 10, 8, 5],
      company: "PT. HUMMA TECHNOLOGY INDONESIA",
      location: "Malang, Indonesia",
      address: "Jl. Pemuda Kaffa Blok. 20 No.5",
      quota: "250 Orang",
      status: "Berlangsung",
      pendaftar: "75/150",
      durasi: "1 Juli - 1 Agustus 2025",
      lokasiPenempatan: "Bandung, Indonesia",
      website: "hummatech.co.id",
    },
  ];

  // Table data
  const tableData = [
    {
      id: 1,
      company: "PT. HUMMA TECHNOLOGY INDONESIA",
      location: "Malang",
      address: "Jl. Pemuda Kaffa Blok. 20 No.5",
      quota: "250 Orang",
      status: "Berlangsung",
      pendaftar: "60/150",
      durasi: "15 Juni - 15 Juli 2025",
      lokasiPenempatan: "Surabaya, Indonesia",
      website: "hummatech.co.id",
    },
    {
      id: 2,
      company: "PT. HUMMA TECHNOLOGY INDONESIA",
      location: "Malang",
      address: "Jl. Pemuda Kaffa Blok. 20 No.5",
      quota: "250 Orang",
      status: "Selesai",
      pendaftar: "150/150",
      durasi: "10 Mei - 10 Juni 2025",
      lokasiPenempatan: "Jakarta, Indonesia",
      website: "hummatech.co.id",
    },
    {
      id: 3,
      company: "PT. HUMMA TECHNOLOGY INDONESIA",
      location: "Malang",
      address: "Jl. Pemuda Kaffa Blok. 20 No.5",
      quota: "250 Orang",
      status: "Berlangsung",
      pendaftar: "75/150",
      durasi: "1 Juli - 1 Agustus 2025",
      lokasiPenempatan: "Bandung, Indonesia",
      website: "hummatech.co.id",
    },
  ];

 const filteredData = sortStatus === 'All'
    ? tableData
    : tableData.filter((job) => job.status === sortStatus);

  // Handle chevron click in table
  const handleChevronClick = (jobId) => {
    const jobDetails = tableData.find(job => job.id === jobId);
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(null); // Close detail if already open
    } else {
      setSelectedJob(jobDetails); // Open detail for selected job
    }
  };

  // Close detail panel
  const handleCloseDetail = () => {
    setSelectedJob(null);
  };

  // Handle card click
  const handleCardClick = (job) => {
    if (selectedJob && selectedJob.id === job.id) {
      setSelectedJob(null);
    } else {
      setSelectedJob(job);
    }
  };

  return (
    <div className="max-w-9xl mx-auto p-4">
      <div className={`flex transition-all duration-500 ${selectedJob ? 'flex-row' : 'flex-col'}`}>
        <div className={`${selectedJob ? 'w-9/12 pr-4' : 'w-full'} transition-all duration-300`}>
          <div className={`grid ${selectedJob ? 'grid-cols-3' : 'grid-cols-1 md:grid-cols-3'} gap-4 mb-6`}>
            {jobData.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onClick={() => handleCardClick(job)}
                isActive={selectedJob && selectedJob.id === job.id}
              />
            ))}
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden mt-4">
            <div className="flex items-center justify-between mb-2 p-4">
              <h1 className="text-lg font-semibold">Cabang Perusahaan</h1>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowModal(true)}
                  className="bg-white text-gray-700 border border-gray-300 rounded-md px-3 py-1 text-xs flex items-center"
                >
                  <span className="mr-1">+</span>
                  <span>Tambah Lowongan</span>
                </button>
                <div className="flex items-center">
                  <span className="mr-2 text-xs">Sort by:</span>
                  <select 
                    className="border border-gray-300 rounded-md px-2 py-1 text-xs"
                    value={sortStatus}
                    onChange={(e) => setSortStatus(e.target.value)}
                  >
                    <option value="All">Semua</option>
                    <option value="Berlangsung">Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Nama Perusahaan</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Alamat</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Jumlah Kuota</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Status Lowongan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 border-t border-gray-100">
                      <td className="p-4">
                        <div className="font-semibold">{job.company}</div>
                        <div className="text-sm text-gray-500">{job.location}</div>
                      </td>
                      <td className="p-4 text-sm">{job.address}</td>
                      <td className="p-4 text-sm">{job.quota}</td>
                      <td className="p-4 flex items-center gap-2">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                          job.status === "Berlangsung"
                            ? "bg-orange-100 text-orange-500"
                            : "bg-emerald-100 text-emerald-500"
                        }`}>
                          {job.status}
                        </span>
                        <ChevronRight
                          onClick={() => handleChevronClick(job.id)}
                          className={`w-4 h-4 cursor-pointer transition-transform ${
                            selectedJob && selectedJob.id === job.id ? 'rotate-90 text-orange-500' : 'text-gray-400'
                          }`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {selectedJob && (
          <div className="w-1/3 transition-all duration-300">
            <JobDetail job={selectedJob} onClose={handleCloseDetail} />
          </div>
        )}
      </div>
    </div>
  );
}