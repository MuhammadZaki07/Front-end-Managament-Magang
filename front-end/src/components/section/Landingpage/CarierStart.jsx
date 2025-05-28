import { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, Users, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function JobListingPage() {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [jobVacancies, setJobVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  
  const jobsPerPage = 3; // Show only 3 latest jobs
  const navigate = useNavigate();

  // Utility functions
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "-";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.warn('Error formatting date:', error);
      return dateString;
    }
  }, []);

  // Data mapping function
  const mapJobData = useCallback((job) => {
    const defaultImage = "/assets/img/Cover.png";
    const coverPhoto = job.perusahaan?.foto?.find(f => f.type === "profil_cover");
    const imageUrl = coverPhoto?.path 
      ? `${import.meta.env.VITE_API_URL_FILE}/storage/${coverPhoto.path}`
      : defaultImage;

    return {
      id: job.id,
      title: job.divisi?.nama || "Posisi Tidak Tersedia",
      divisiId: job.divisi?.id || null,
      divisiNama: job.divisi?.nama || "Divisi Tidak Tersedia",
      company: job.perusahaan?.nama || "PT. HIMIKA TEKNOLOGI INDONESIA",
      location: job.perusahaan?.alamat || "Pekanbaru",
      posted: formatDate(job.tanggal_mulai),
      closing: formatDate(job.tanggal_selesai),
      badge: "Magang",
      applicants: job.total_pendaftar || 0,
      image: imageUrl,
      duration: job.durasi ? `${job.durasi} Bulan` : "6 Bulan"
    };
  }, [formatDate]);

  // Fetch jobs data
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/lowongan-all`,
        { timeout: 10000 } // 10 second timeout
      );
      
      if (!data?.data || !Array.isArray(data.data)) {
        throw new Error('Format data tidak valid');
      }
      
      const jobs = data.data
        .map(mapJobData)
        .sort((a, b) => new Date(b.posted) - new Date(a.posted)) // Sort by latest date
        .slice(0, 4); // Take only the first 3 latest jobs
      setJobVacancies(jobs);
      
      // Extract unique divisions
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
      
      setDivisions(uniqueDivisions.sort((a, b) => a.nama.localeCompare(b.nama)));
      
    } catch (error) {
      console.error("Gagal memuat data lowongan:", error);
      setError(
        error.code === 'ECONNABORTED' 
          ? 'Koneksi timeout. Silakan coba lagi.'
          : error.response?.data?.message || 'Gagal memuat data lowongan. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  }, [mapJobData]);

  // Filter jobs based on selected divisions
  const filteredJobs = useMemo(() => {
    if (selectedDivisions.length === 0) {
      return jobVacancies;
    }
    return jobVacancies.filter(job => selectedDivisions.includes(job.divisiId));
  }, [selectedDivisions, jobVacancies]);

  // Since we only show 3 jobs, no pagination needed
  const currentJobs = filteredJobs;

  // Effects
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Reset to first page when filter changes - not needed for 3 items only
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [selectedDivisions]);

  // Event handlers
  const handleDivisionChange = useCallback((divisionId) => {
    setSelectedDivisions(prev => {
      if (prev.includes(divisionId)) {
        return prev.filter(id => id !== divisionId);
      } else {
        return [...prev, divisionId];
      }
    });
  }, []);

  // Since we only show 3 jobs, we don't need goToPage function
  // const goToPage = useCallback((pageNumber) => {
  //   const validPage = Math.max(1, Math.min(pageNumber, totalPages));
  //   setCurrentPage(validPage);
  //   
  //   // Scroll to top when changing pages
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // }, [totalPages]);

  const handleViewDetail = useCallback((jobId) => {
    if (!jobId) {
      console.error('Job ID tidak valid');
      return;
    }
    navigate(`/vacancy/${jobId}`);
  }, [navigate]);

  const handleRetry = useCallback(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-6 pl-24 min-h-56 max-w-[400px] mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 w-32 h-28 bg-gray-200 animate-pulse rounded-xl" />
          <div className="flex flex-col h-full">
            <div className="mb-1 ml-8">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse mb-1" />
              <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse mb-3" />
            </div>
            <div className="h-5 bg-gray-200 rounded w-full animate-pulse mb-3" />
            <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse mt-auto" />
            <div className="mt-4 flex justify-end">
              <div className="h-8 bg-gray-200 rounded w-28 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render error state
  const renderError = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-12">
      <AlertCircle className="h-16 w-16 text-red-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">Gagal Memuat Data</h3>
      <p className="text-gray-500 text-sm text-center mb-4 max-w-md">{error}</p>
      <button
        onClick={handleRetry}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  );

  // Render empty state
  const renderEmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-12">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-16 w-16 text-gray-300 mb-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
      </svg>
      <h3 className="text-lg font-medium text-gray-700">Tidak ada lowongan tersedia</h3>
      <p className="text-gray-500 text-sm mt-1">
        {selectedDivisions.length > 0 
          ? 'Tidak ada lowongan untuk filter yang dipilih. Coba ubah filter pencarian.'
          : 'Belum ada lowongan tersedia saat ini. Silakan coba lagi nanti.'
        }
      </p>
    </div>
  );

  // Render job card
  const renderJobCard = (job) => (
    <article key={job.id} className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-2 pl-20 min-h-56 max-w-[400px] mx-auto">
      {/* Company Image */}
      <div className="absolute left-0 top-1/4 -translate-y-1/2 -translate-x-1/4 w-32 h-28">
        <img 
          src={job.image} 
          alt={`Logo ${job.company}`}
          className="w-full h-full object-cover rounded-xl shadow-md"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/assets/img/Cover.png";
          }}
        />
      </div>
      
      {/* Job Details */}
      <div className="flex flex-col h-full">
        <div className="mb-1 ml-8">
          <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{job.company}</h4>
          <div className="flex items-center gap-1 text-gray-600 mb-2">
            <MapPin size={12} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
            <span className="text-xs">{job.location}, Indonesia</span>
          </div>
          <div className="text-xs text-gray-700 mb-2">
            <time dateTime={job.posted}>{job.posted}</time> - <time dateTime={job.closing}>{job.closing}</time>
          </div>
          <div className="inline-block bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full mb-3">
            {job.duration}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 mb-3 -ml-8 line-clamp-2">{job.title}</h3>
        
        <div className="flex items-center text-gray-700 mt-auto -ml-8">
          <Users size={12} className="mr-2 text-gray-500 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm">{job.applicants} Pelamar</span>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button 
            className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white py-2 px-4 rounded-lg text-xs font-medium transition-colors flex items-center"
            onClick={() => handleViewDetail(job.id)}
            aria-label={`Lihat detail lowongan ${job.title} di ${job.company}`}
          >
            VIEW VACANCY
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="ml-2"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
      
    </article>
    
  );

  // Render pagination - not needed for 3 items only
  // const renderPagination = () => {
  //   return null;
  // };

  return (
    <div className="flex-1">
      {loading && renderLoadingSkeleton()}
      
      {error && !loading && renderError()}
      
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentJobs.length > 0 ? (
              currentJobs.map(renderJobCard)
            ) : (
              renderEmptyState()
            )}
          </div>
        </>
      )}
    </div>
  );
}