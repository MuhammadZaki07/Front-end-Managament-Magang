import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

// Import komponen yang sudah dipecah
import JobCard from "../../components/cards/JobCard";
import JobDetail from "../../components/cards/JobDetail";
import AddJobModal from "../../components/modal/AddJobModal"; 

// Komponen utama untuk dashboard lowongan
export default function Lowongan() {
  const [sortStatus, setSortStatus] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Data untuk kartu ringkasan (summary cards) - hanya berisi informasi untuk tampilan kartu
  const summaryCardsData = [
    {
      id: 1,
      title: "Total Lowongan",
      count: 20,
      color: "orange",
      iconType: "people",
      chartData: [10, 12, 15, 14, 16, 17, 18, 20],
    },
    {
      id: 2,
      title: "Total Lowongan Berlangsung",
      count: 105,
      color: "yellow",
      iconType: "chart",
      chartData: [5, 7, 10, 12, 13, 15, 14, 15],
    },
    {
      id: 3,
      title: "Total Lowongan Selesai",
      count: 5,
      color: "blue",
      iconType: "document",
      chartData: [2, 3, 3, 4, 4, 5, 5, 5],
    }
  ];

  // Data untuk tabel lowongan
  const tableData = [
    {
      id: 1,
      company: "PT. HUMMA TECHNOLOGY INDONESIA",
      location: "Malang",
      description: "Perusahaan ini bergerak di bidang Informasi dan Teknologi untuk perkembangan Industri",
      address: "Jl. Pemuda Kaffa Blok. 20 No.5",
      quota: "250 Orang",
      status: "Berlangsung",
      pendaftar: "60/150",
      durasi: "15 Juni - 15 Juli 2025",
      lokasiPenempatan: "Surabaya, Indonesia",
      website: "hummatech.co.id",
    },
    // Data lainnya...
  ];

  // Filter table data based on selected status filter
  const filteredData = sortStatus === "All" ? tableData : tableData.filter((job) => job.status === sortStatus);

  // Removed handleCardClick since cards should not be clickable

  const handleChevronClick = (jobId) => {
    // Toggle selection: If already selected, deselect it. Otherwise, select the job
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(null);
    } else {
      const job = tableData.find((job) => job.id === jobId);
      setSelectedJob(job);
    }
  };
  
  // Fungsi untuk menutup panel detail, akan diteruskan ke JobDetail
  const handleCloseDetail = () => {
    setSelectedJob(null);
  };
  
  // Untuk memastikan bahwa card summary tidak lagi dikaitkan dengan detail lowongan

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className={`flex transition-all duration-500 ${selectedJob ? "flex-row" : "flex-col"}`}>
        <div className={`${selectedJob ? "w-2/3 pr-4" : "w-full"} transition-all duration-300`}>
          {/* Job Summary Cards - using summaryCardsData */}
          <div className={`grid ${selectedJob ? "grid-cols-3" : "grid-cols-1 md:grid-cols-3"} gap-4 mb-6`}>
            {summaryCardsData.map((summaryCard) => (
              <JobCard 
                key={summaryCard.id} 
                job={summaryCard}
                 
                // Non-clickable cards
                isActive={false} 
              />
            ))}
          </div>

          {/* Job Listings Table */}
          <div className="bg-white rounded-xl overflow-hidden mt-4 shadow-sm">
            <div className="flex items-center justify-between p-4">
              <h1 className="text-lg font-semibold">Cabang Perusahaan</h1>
              <div className="flex items-center space-x-2">
                <button onClick={() => setShowModal(true)} className="bg-white text-gray-700 border border-gray-300 rounded-md px-3 py-1 text-xs flex items-center hover:bg-gray-50">
                  <span className="mr-1">+</span>
                  <span>Tambah Lowongan</span>
                </button>
                {/* Sort by dropdown */}
                <div className="flex items-center">
                  <span className="mr-2 text-xs">Sort by:</span>
                  <select className="border border-gray-300 rounded-md px-2 py-1 text-xs" value={sortStatus} onChange={(e) => setSortStatus(e.target.value)}>
                    <option value="All">Semua</option>
                    <option value="Berlangsung">Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
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
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${job.status === "Berlangsung" ? "bg-orange-100 text-orange-500" : "bg-emerald-100 text-emerald-500"}`}>{job.status}</span>
                        <ChevronRight 
                          onClick={() => handleChevronClick(job.id)} 
                          className={`w-4 h-4 cursor-pointer transition-transform ${selectedJob && selectedJob.id === job.id ? "rotate-90 text-orange-500" : "text-gray-400"}`} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tampilkan Detail Job */}
        {selectedJob && !showModal && (
          <JobDetail 
            job={selectedJob} 
            onClose={handleCloseDetail} // Menambahkan prop onClose
          />
        )}
      </div>

      {/* Tampilkan Modal AddJobModal */}
      <AddJobModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}