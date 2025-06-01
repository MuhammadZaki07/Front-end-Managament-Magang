import React, { useEffect, useState } from "react";
import { ChevronRight, Plus, Filter } from "lucide-react";
import JobCard from "../../components/cards/JobCard";
import JobDetail from "../../components/cards/JobDetail";
import AddJobModal from "../../components/modal/AddJobModal";
import axios from "axios";
import Loading from "../../components/Loading";
import Swal from "sweetalert2";

export default function Lowongan() {
  const [sortStatus, setSortStatus] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobDetail, setSelectedJobDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [lowongan, setLowongan] = useState([]);
  const [editingData, setEditingData] = useState(null);

  const GetData = async () => {
    try {
      Swal.fire({
        title: 'Memuat data...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/lowongan`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLowongan(res.data.data);
      Swal.close();
    } catch (error) {
      console.log("Error fetching data:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal memuat data lowongan'
      });
    } finally {
      setLoading(false);
    }
  };

  const GetJobDetail = async (jobId) => {
    try {
      setDetailLoading(true);
      console.log(`Fetching detail for job ID: ${jobId}`); // Debug log
      
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/lowongan/${jobId}/detail`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      console.log("Detail response:", res.data); // Debug log
      
      // Check if response has the expected structure
      if (res.data && res.data.data) {
        setSelectedJobDetail(res.data.data);
      } else {
        // If detail endpoint doesn't exist or returns different structure,
        // fallback to using the basic job data from the list
        const basicJob = lowongan.find(job => job.id === jobId);
        setSelectedJobDetail(basicJob);
        console.log("Using basic job data as fallback:", basicJob);
      }
    } catch (error) {
      console.log("Error fetching job detail:", error);
      
      // Check if it's a 404 error (endpoint doesn't exist)
      if (error.response && error.response.status === 404) {
        console.log("Detail endpoint not found, using basic job data");
        const basicJob = lowongan.find(job => job.id === jobId);
        setSelectedJobDetail(basicJob);
      } else {
        // Show error for other types of errors
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal memuat detail lowongan'
        });
        
        // Still set basic job data as fallback
        const basicJob = lowongan.find(job => job.id === jobId);
        setSelectedJobDetail(basicJob);
      }
    } finally {
      setDetailLoading(false);
    }
  };

  // Function untuk update status job di list tanpa fetch ulang semua data
  const updateJobStatus = (jobId, newStatus) => {
    setLowongan(prevLowongan => 
      prevLowongan.map(job => 
        job.id === jobId 
          ? { ...job, status: newStatus }
          : job
      )
    );

    // Update selectedJob jika itu yang sedang dipilih
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prevJob => ({ ...prevJob, status: newStatus }));
    }

    // Update selectedJobDetail jika ada
    if (selectedJobDetail && selectedJobDetail.id === jobId) {
      setSelectedJobDetail(prevDetail => ({ ...prevDetail, status: newStatus }));
    }
  };

  const { totalLowonganBerlangsung, totalLowonganSelesai } = lowongan.reduce(
    (acc, job) => {
      if (job.status == true) {
        acc.totalLowonganBerlangsung += 1;
      } else if (job.status == false) {
        acc.totalLowonganSelesai += 1;
      }
      return acc;
    },
    { totalLowonganBerlangsung: 0, totalLowonganSelesai: 0 }
  );

  useEffect(() => {
    GetData();
  }, []);

  const summaryCardsData = [
    {
      id: 1,
      title: "Total Lowongan",
      count: lowongan.length,
      color: "blue",
      iconType: "people",
      chartData: [10, 12, 15, 14, 16, 17, 18, 20],
    },
    {
      id: 2,
      title: "Total Lowongan Berlangsung",
      count: totalLowonganBerlangsung,
      color: "indigo",
      iconType: "chart",
      chartData: [5, 7, 10, 12, 13, 15, 14, 15],
    },
    {
      id: 3,
      title: "Total Lowongan Selesai",
      count: totalLowonganSelesai,
      color: "cyan",
      iconType: "document",
      chartData: [2, 3, 3, 4, 4, 5, 5, 5],
    },
  ];

  const filteredData =
    sortStatus === "All"
      ? lowongan
      : lowongan.filter((job) => job.status === Number(sortStatus));

  const handleChevronClick = async (jobId) => {
    if (selectedJob && selectedJob.id === jobId) {
      // Close detail if clicking same job
      setSelectedJob(null);
      setSelectedJobDetail(null);
    } else {
      // Find job from list and set it immediately
      const job = lowongan.find((job) => job.id === jobId);
      setSelectedJob(job);
      
      // Set basic job data first, then fetch detailed data
      setSelectedJobDetail(job);
      
      // Fetch detailed data
      await GetJobDetail(jobId);
    }
  };

  const handleEditJob = (job) => {
    // Use detailed data if available, otherwise use basic data
    setEditingData(selectedJobDetail || job);
    setShowModal(true);
  };

  const handleCloseDetail = () => {
    setSelectedJob(null);
    setSelectedJobDetail(null);
  };

  const handleModalSuccess = () => {
    GetData();
    // If detail is open, refresh detail data
    if (selectedJob) {
      GetJobDetail(selectedJob.id);
    }
  };

  // Function untuk handle success dari JobDetail dengan update status
  const handleJobDetailSuccess = () => {
    // Jika ada selectedJob, berarti ada job yang statusnya berubah
    if (selectedJob) {
      // Update status di list menjadi 0 (selesai)
      updateJobStatus(selectedJob.id, 0);
    }
    
    // Tetap panggil GetData untuk sinkronisasi dengan server (optional)
    // GetData();
  };

  if (loading) return <Loading />;

  return (
    <div className="">
      <div className="max-w-7xl mx-auto p-2">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Manajemen Lowongan
              </h1>
              <p className="text-gray-600">
                Kelola semua lowongan pekerjaan perusahaan
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Aktif</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalLowonganBerlangsung}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex transition-all duration-500 gap-6 ${
            selectedJob ? "flex-row" : "flex-col"
          }`}
        >
          <div
            className={`${
              selectedJob ? "w-2/3" : "w-full"
            } transition-all duration-300`}
          >
            {/* Summary Cards */}
            <div
              className={`grid ${
                selectedJob ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-3"
              } gap-4 mb-8`}
            >
              {summaryCardsData.map((summaryCard) => (
                <JobCard
                  key={summaryCard.id}
                  job={summaryCard}
                  isActive={false}
                />
              ))}
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              {/* Header Card */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">
                      Daftar Lowongan Pekerjaan
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {filteredData.length} lowongan ditemukan
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowModal(true)}
                      className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-200 border border-blue-200 rounded-lg px-4 py-2.5 text-sm font-medium flex items-center shadow-sm hover:shadow-md"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Lowongan
                    </button>
                    
                    {/* Filter Dropdown */}
                    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                      <Filter className="w-4 h-4 text-white mr-2" />
                      <select
                        className="bg-transparent text-white text-sm border-none outline-none cursor-pointer"
                        value={sortStatus}
                        onChange={(e) => setSortStatus(e.target.value)}
                      >
                        <option value="All" className="text-gray-900">Semua Status</option>
                        <option value="1" className="text-gray-900">Berlangsung</option>
                        <option value="0" className="text-gray-900">Selesai</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-white border-b border-gray-400">
                      <th className="text-left p-4 text-sm font-semibold text-blue-900">
                        No
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-blue-900">
                       Cabang
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-blue-900">
                        Divisi
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-blue-900">
                        Alamat
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-blue-900">
                        Kuota
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-blue-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-50">
                    {filteredData.map((job, index) => (
                      <tr
                        key={job.id}
                        className={`hover:bg-blue-50/30 transition-all duration-200 ${
                          selectedJob && selectedJob.id === job.id
                            ? "bg-blue-50 border-l-4 border-blue-500"
                            : ""
                        }`}
                      >
                        <td className={`p-3 ${selectedJob ? 'text-xs' : 'text-sm'} font-medium text-gray-700`}>
                          <div className={`${selectedJob ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-xs'} text-black flex items-center justify-center font-semibold`}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className={`font-medium text-gray-900 ${selectedJob ? 'text-xs' : 'text-sm'}`}>
                            {job.cabang?.nama || 'Cabang tidak tersedia'}
                          </div>
                        </td>
                        <td className={`p-3 ${selectedJob ? 'hidden lg:table-cell' : ''}`}>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full ${selectedJob ? 'text-xs' : 'text-xs'} font-medium bg-blue-100 text-blue-800`}>
                            {job.divisi?.nama || 'Umum'}
                          </span>
                        </td>
                        <td className={`p-3 ${selectedJob ? 'text-xs' : 'text-sm'} text-black max-w-xs truncate ${selectedJob ? 'hidden xl:table-cell' : ''}`}>
                          {job.cabang?.provinsi && job.cabang?.kota 
                            ? `${job.cabang.kota}, ${job.cabang.provinsi}` 
                            : 'Alamat tidak tersedia'}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                            <span className={`${selectedJob ? 'text-xs' : 'text-sm'} font-medium text-gray-900`}>
                              {selectedJob ? job.max_kuota : `${job.max_kuota} orang`}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-between">
                            <span
                              className={`inline-flex items-center px-2 py-1 ${selectedJob ? 'text-xs' : 'text-xs'} font-semibold rounded-full ${
                                job.status === 1
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  job.status === 1 ? "bg-green-400" : "bg-gray-400"
                                }`}
                              ></div>
                              {selectedJob ? (job.status === 0 ? "Selesai" : "Aktif") : (job.status === 0 ? "Selesai" : "Berlangsung")}
                            </span>
                            <button
                              onClick={() => handleChevronClick(job.id)}
                              className={`ml-2 p-1 rounded-lg transition-all duration-200 hover:bg-blue-100 ${
                                selectedJob && selectedJob.id === job.id
                                  ? "bg-blue-100 text-blue-600"
                                  : "text-gray-400 hover:text-blue-600"
                              }`}
                              disabled={detailLoading}
                            >
                              <ChevronRight
                                className={`${selectedJob ? 'w-3 h-3' : 'w-4 h-4'} transition-transform duration-200 ${
                                  selectedJob && selectedJob.id === job.id
                                    ? "rotate-90"
                                    : ""
                                } ${detailLoading ? 'animate-spin' : ''}`}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Empty State */}
                {filteredData.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Filter className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Tidak ada lowongan ditemukan
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Coba ubah filter atau tambah lowongan baru
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Detail Sidebar */}
          {selectedJob && !showModal && (
            <div className="w-1/3 min-w-0">
              <div className="sticky top-6">
                <JobDetail
                  job={selectedJobDetail || selectedJob} // Use detailed data if available
                  onClose={handleCloseDetail}
                  onEdit={() => handleEditJob(selectedJob)}
                  onSucces={handleJobDetailSuccess} // Update function untuk handle status change
                  loading={detailLoading}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        <AddJobModal
          showModal={showModal}
          setShowModal={setShowModal}
          editingData={editingData}
          onSucces={handleModalSuccess}
        />
      </div>
    </div>
  );
}