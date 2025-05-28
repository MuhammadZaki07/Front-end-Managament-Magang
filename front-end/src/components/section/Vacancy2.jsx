import { useState, useEffect } from 'react';
import { MapPin, Users, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function JobListingPage() {
  const [filterOpen, setFilterOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobVacancies, setJobVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showMoreDivisions, setShowMoreDivisions] = useState(false);
  const jobsPerPage = 8;
  const navigate = useNavigate();
  
  console.log(jobVacancies);
  
  // Fungsi untuk mengformat data lowongan dari API
  const mapJobData = (job) => ({
    id: job.id,
    title: job.divisi?.nama || "-",
    divisiId: job.divisi?.id || null,
    divisiNama: job.divisi?.nama || "-",
    company: job.perusahaan?.nama || "ppp",
    location: job.perusahaan
      ? `${job.perusahaan.kota}, ${job.perusahaan.provinsi}`
      : "Pekanbaru",
    posted: formatDate(job.tanggal_mulai),
    closing: formatDate(job.tanggal_selesai),
    badge: "Magang",
    applicants: job.total_pendaftar || 0,
    image: job.cabang?.foto?.find(f => f.type === "profil_cover")?.path
      ? `${import.meta.env.VITE_API_URL_FILE}/storage/${job.cabang.foto.find(f => f.type === "profil_cover").path}`
      : "/assets/img/Cover.png",
    duration: job.durasi ? `${job.durasi} Bulan` : ""
  });

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  // Mengambil data lowongan dari API dan mengekstrak data divisi
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/lowongan-all`
        );
        
        const jobs = (data?.data || []).map(mapJobData);
        setJobVacancies(jobs);
        setFilteredJobs(jobs);
        
        // Ekstrak divisi unik dari data lowongan
        const uniqueDivisions = [];
        const divisionIds = new Set();
        
        jobs.forEach(job => {
          if (job.divisiId && !divisionIds.has(job.divisiId)) {
            divisionIds.add(job.divisiId);
            uniqueDivisions.push({
              id: job.divisiId,
              nama: job.divisiNama
            });
          }
        });
        
        setDivisions(uniqueDivisions);
      } catch (error) {
        console.error("Gagal memuat data lowongan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Effect untuk memfilter lowongan berdasarkan divisi yang dipilih
  useEffect(() => {
    if (selectedDivisions.length === 0) {
      setFilteredJobs(jobVacancies);
    } else {
      const filtered = jobVacancies.filter(job => 
        selectedDivisions.includes(job.divisiId)
      );
      setFilteredJobs(filtered);
    }
    setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
  }, [selectedDivisions, jobVacancies]);

  // Fungsi untuk mengubah filter divisi
  const handleDivisionChange = (divisionIds) => {
  setSelectedDivisions(prev => {
    const allSelected = divisionIds.every(id => prev.includes(id));
    if (allSelected) {
      // uncheck semua
      return prev.filter(id => !divisionIds.includes(id));
    } else {
      // tambahkan yang belum ada
      const newIds = divisionIds.filter(id => !prev.includes(id));
      return [...prev, ...newIds];
    }
  });
};

  // Logic untuk pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Fungsi untuk mengganti halaman
  const goToPage = (pageNumber) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };

  // Fungsi untuk melihat detail lowongan
  const handleViewDetail = (jobId) => {
    navigate(`/vacancy/${jobId}`);
  };

  const groupedDivisions = divisions.reduce((acc, division) => {
    const lowerName = division.nama.toLowerCase();
    if (!acc[lowerName]) {
      acc[lowerName] = {
        nama: division.nama, // simpan versi original
        items: [],
      };
    }
    acc[lowerName].items.push(division);
    return acc;
  }, {});

// Ubah ke array untuk render
const groupedDivisionArray = Object.values(groupedDivisions);
  
  return (
    <div className="bg-white-100 min-h-screen p-10">
      <div className="bg-white rounded-lg p-4 mb-6 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Lowongan Pekerjaan</h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filter Sidebar */}
          <div className={`bg-white rounded-lg lg:w-64 relative left-[-3rem] ${filterOpen ? 'block' : 'hidden'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="font-medium">Filter</span>
              </div>
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <ChevronDown size={18} />
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3 text-gray-700">Divisi</h3>
              <div className="flex flex-col gap-2">
                {loading ? (
                  <div className="py-2 px-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                  </div>
                ) : groupedDivisionArray.length > 0 ? (
                  <>
                    {/* Tampilkan 5 divisi pertama */}
                    {groupedDivisionArray.map((group) => {
                      const divisionIds = group.items.map(d => d.id);
                      const division = group.items[0];
                      const count = group.items.length;
                      const isChecked = divisionIds.every(id => selectedDivisions.includes(id));

                      return (
                        <label key={division.id} className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded text-blue-600" 
                            checked={isChecked}
                            onChange={() => handleDivisionChange(divisionIds)}
                          />
                          <span className="text-sm">
                            {group.nama} {count > 1 ? `(${count})` : ""}
                          </span>
                        </label>
                      );
                    })}

                    {/* Dropdown "Lainnya" jika ada lebih dari 5 */}
                    {groupedDivisionArray.length > 5 && (
                      <div className="mt-1">
                        <button 
                          onClick={() => setShowMoreDivisions(!showMoreDivisions)}
                          className="flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium"
                        >
                          Lainnya
                          <ChevronDown size={16} className={`ml-1 transition-transform ${showMoreDivisions ? 'rotate-180' : ''}`} />
                        </button>

                        {showMoreDivisions && (
                          <div className="mt-2 pl-2 border-l-2 border-gray-200">
                            {groupedDivisionArray.slice(5).map((group) => {
                              const division = group.items[0];
                              const count = group.items.length;
                              return (
                                <label key={division.id} className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded">
                                  <input 
                                    type="checkbox" 
                                    className="h-4 w-4 rounded text-blue-600" 
                                    checked={selectedDivisions.includes(division.id)}
                                    onChange={() => handleDivisionChange(division.id)}
                                  />
                                  <span className="text-sm">
                                    {group.nama} {count > 1 ? `(${count})` : ""}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Tidak ada divisi tersedia</p>
                )}
              </div>
            </div>
        
            {/* Hapus tombol Terapkan Filter */}
          </div>
          
          {/* Job Listings */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-6 pl-24 min-h-56 max-w-[500px] mx-auto">
                    <div className="absolute left-0 -translate-y-1/2 -translate-x-1/4 w-40 h-36 bg-gray-200 animate-pulse rounded-xl"></div>
                    <div className="flex flex-col h-full">
                      <div className="mb-1 ml-15">
                        <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse mb-3"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-full animate-pulse mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse mt-auto"></div>
                      <div className="mt-4 flex justify-end">
                        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  {currentJobs.length > 0 ? (
                    currentJobs.map((job) => (
                      <div key={job.id} className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 pl-24 min-h-56 max-w-[500px] mx-auto">
                        {/* Company Image overlapping the card on the left */}
                        <div className="absolute left-0 -translate-y-1/3 -translate-x-1/4 w-40 h-36">
                          <img 
                            src={job.image} 
                            alt={`${job.title} - Gambar`} 
                            className="w-full h-full object-cover rounded-xl shadow-md"
                          />
                        </div>
                        
                        {/* Job Details */}
                        <div className="flex flex-col h-full">
                          <div className="mb-1 ml-10">
                            <h4 className="text-base font-bold text-gray-900 mb-2">{job.company}</h4>
                            <div className="flex items-center gap-1 text-gray-600 mb-2">
                              <MapPin size={14} className="text-gray-400" />
                              <span className="text-xs">{job.location}</span>
                            </div>
                            <div className="text-xs text-gray-700 mb-2">
                              {job.posted} - {job.closing}
                            </div>
                            
                          </div>
                          
                          <h3 className="text-sm font-bold text-gray-800 mb-3 -ml-22 mt-8">Magang di divisi {job.title}</h3>
                         
                          <div className="flex items-center text-gray-700 mt-auto -ml-22">
                            <Users size={14} className="mr-2 text-gray-500" />
                            <span className="text-sm">{job.applicants} Pelamar</span>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <button 
                              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg text-sm font-medium transition-colors flex items-center"
                              onClick={() => handleViewDetail(job.id)}
                            >
                              VIEW VACANCY
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-700">Tidak ada lowongan tersedia</h3>
                      <p className="text-gray-500 text-sm mt-1">Silakan coba lagi nanti atau ubah filter pencarian.</p>
                    </div>
                  )}
                </div>
                
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center gap-1">
                      {/* Tombol Previous */}
                      <button 
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center justify-center w-10 h-10 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      {/* Tombol Halaman */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`flex items-center justify-center w-10 h-10 rounded-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      {/* Tombol Next */}
                      <button 
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center justify-center w-10 h-10 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}