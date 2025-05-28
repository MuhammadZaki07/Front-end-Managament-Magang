// JobVacancyDetail.jsx - Komponen untuk halaman detail lowongan
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import {
  MapPin,
  Mail,
  ExternalLink,
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Users,
  ChevronRight
} from "lucide-react";
import PemberkasanModal from "../modal/PemberkasanModal";
import Loading from "../Loading";
import DataNotAvaliable from "../DataNotAvaliable";

export default function JobVacancyDetail() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [userMagangStatus, setUserMagangStatus] = useState(null);
  const [statusError, setStatusError] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Default image paths
  const DEFAULT_IMAGE = "/assets/img/Cover.png";

  // Default required documents (tidak bisa diubah)
  const DEFAULT_REQUIRED_DOCUMENTS = [
    "CV",
    "Surat Pernyataan Diri"
  ];

  const getImagePath = (job, type) => {
    let path = "";
    
    // Prioritas: ambil dari cabang.foto terlebih dahulu, lalu perusahaan.foto
    if (job?.cabang?.foto && Array.isArray(job.cabang.foto)) {
      const foto = job.cabang.foto.find((f) => f.type === type);
      if (foto) {
        path = foto.path;
      }
    }
    
    // Jika tidak ditemukan di cabang, cari di perusahaan
    if (!path && job?.perusahaan?.foto && Array.isArray(job.perusahaan.foto)) {
      const foto = job.perusahaan.foto.find((f) => f.type === type);
      if (foto) {
        path = foto.path;
      }
    }
    
    // Jika path kosong, gunakan default image
    return path ? `${import.meta.env.VITE_API_URL_FILE}/storage/${path}` : DEFAULT_IMAGE;
  };

  const mapJobData = (job) => ({
    id: job.id,
    position: job.divisi?.nama || "-",
    company: {
      name: job.perusahaan?.nama || "-",
      location: job.perusahaan?.alamat || "-",
      logo: getImagePath(job, "profile"), // untuk logo gunakan type "profile"
      email: job.perusahaan?.email || "-",
      website: job.perusahaan?.website || "-",
      description: job.perusahaan?.deskripsi || "-",
    },
    cabang: {
      nama: job.cabang?.nama || "-",
      kota: job.cabang?.kota || "-",
      provinsi: job.cabang?.provinsi || "-",
    },
    // Gunakan default documents alih-alih dari API
    documents: DEFAULT_REQUIRED_DOCUMENTS,
    importantDates: {
      duration: job.durasi + " Bulan",
      Pembukaan: job.tanggal_mulai,
      Penutupan: job.tanggal_selesai,
    },
    requirement: job.requirement?.split("\n") || [],
    jobdesc: job.jobdesc?.split("\n") || [],
    total_pendaftar: job.total_pendaftar || 0,
    cover: getImagePath(job, "profil_cover"), // untuk cover gunakan type "profil_cover"
  });

  // Fungsi untuk format tanggal penting
  const getImportantDates = (job) => {
    const { Pembukaan, Penutupan } = job.importantDates || {};

    if (!Pembukaan || !Penutupan) {
      return {
        duration: "Tidak tersedia",
        Pembukaan: "Tidak tersedia",
        Penutupan: "Tidak tersedia",
      };
    }

    const start = new Date(Pembukaan);
    const end = new Date(Penutupan);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        duration: "Tanggal tidak valid",
        Pembukaan: "Tanggal tidak valid",
        Penutupan: "Tanggal tidak valid",
      };
    }

    const duration = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    return {
      duration: `${duration} hari`,
      Pembukaan: start.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      Penutupan: end.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  };

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        // Idealnya, gunakan endpoint khusus untuk detail 1 lowongan
        // tapi untuk sekarang kita ambil semua lowongan dan filter berdasarkan ID
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/lowongan-all`
        );
        
        const allJobs = (data?.data || []).map(mapJobData);
        const selectedJob = allJobs.find(j => j.id.toString() === jobId);
        
        if (selectedJob) {
          setJob(selectedJob);
          
          // Tentukan lowongan terkait berdasarkan kriteria relevansi
          const otherJobs = allJobs.filter(j => j.id.toString() !== jobId);
          
          // Fungsi untuk menghitung skor relevansi
          const calculateRelevanceScore = (job) => {
            let score = 0;
            
            // Kesamaan posisi/divisi (paling relevan)
            if (job.position === selectedJob.position) {
              score += 10;
            } else if (job.position.includes(selectedJob.position) || 
                      selectedJob.position.includes(job.position)) {
              score += 5;
            }
            
            // Kesamaan perusahaan (sangat relevan)
            if (job.company.name === selectedJob.company.name) {
              score += 8;
            }
            
            // Kesamaan lokasi (cukup relevan)
            if (job.company.location === selectedJob.company.location) {
              score += 3;
            } else if (job.company.location.includes(selectedJob.company.location) || 
                      selectedJob.company.location.includes(job.company.location)) {
              score += 1;
            }
            
            return score;
          };
          
          // Urutkan lowongan berdasarkan skor relevansi
          const sortedRelatedJobs = otherJobs
            .map(job => ({
              ...job,
              relevanceScore: calculateRelevanceScore(job)
            }))
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 5)
            .map(({ relevanceScore, ...job }) => job); // Hapus relevanceScore dari hasil akhir
          
          setRelatedJobs(sortedRelatedJobs);
        } else {
          console.error("Lowongan tidak ditemukan");
        }
      } catch (error) {
        console.error("Gagal memuat detail lowongan:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch user's internship/magang status when user is logged in
    const fetchUserMagangStatus = async () => {
      if (!token || !user) return;
      
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/complete/magang`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // API merespons dengan data: "true" jika peserta sudah terdaftar magang
        // dan data: "false" jika peserta belum terdaftar magang
        const isTerdaftarMagang = response.data.data === "true";
        setUserMagangStatus(isTerdaftarMagang ? "terdaftar" : "belum_terdaftar");
      } catch (error) {
        console.error("Gagal memuat status magang user:", error);
      }
    };

    fetchJobDetail();
    fetchUserMagangStatus();
  }, [jobId, token, user]);

  const openModal = (e) => {
    e.preventDefault();
    setStatusError("");
    
    // Check if user is logged in
    if (!token || !user) {
      navigate("/auth/login");
      return;
    }
    
    // Check user's internship status
    if (userMagangStatus === "terdaftar") {
      setStatusError("Anda sudah terdaftar magang. Tidak dapat melamar lowongan baru.");
      return;
    }
    
    // If status is "belum_terdaftar" or null/undefined, allow them to apply
    setModalOpen(true);
  };
  
  const closeModal = () => setModalOpen(false);

  // Fungsi untuk menangani error gambar
  const handleImageError = (e) => {
    e.target.src = DEFAULT_IMAGE;
  };

  const RelatedJobCard = ({ job }) => {
    // Format tanggal untuk related job
    const relatedJobDates = getImportantDates(job);
    
    return (
      <Link to={`/vacancy/${job.id}`} className="block mb-6 last:mb-0">
        <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-4 pl-20 min-h-40">
          {/* Company Logo */}
          <div className="absolute left-0 -translate-y-1/3 -translate-x-1/4 w-24 h-20">
            <img 
              src={job.company.logo} 
              alt={`${job.company.name} - Logo`} 
              className="w-full h-full object-cover rounded-xl shadow-md"
              onError={handleImageError}
            />
          </div>
          
          {/* Job Details */}
          <div className="flex flex-col h-full">
            <div className="mb-1 ml-10">
              <h4 className="text-sm font-bold text-gray-900 mb-1">{job.company.name}</h4>
              <div className="flex items-center gap-1 text-gray-600 mb-1">
                <MapPin size={12} className="text-gray-400" />
                <span className="text-xs truncate">{job.company.location}</span>
              </div>
              <div className="text-xs text-[#667797] mb-1">
                {relatedJobDates.Pembukaan} - {relatedJobDates.Penutupan}
              </div>
            </div>
            
            <h3 className="text-base font-bold text-gray-800 mb-2 -ml-10">{job.position}</h3>
            
            <div className="flex items-center text-[#667797] mt-auto">
              <Users size={14} className="mr-2 text-gray-500" />
              <span className="text-sm">{job.total_pendaftar || 0} Pelamar</span>
            </div>
            
            <div className="mt-3 flex justify-end">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-lg text-xs font-medium transition-colors flex items-center"
              >
                VIEW VACANCY
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 mt-10">
        <div className="w-full h-screen bg-gray-200 animate-pulse rounded-xl"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-6 py-8 mt-10">
        <DataNotAvaliable />
        <h1 className="text-4xl font-bold text-center py-10">
          Lowongan Tidak Ditemukan
        </h1>
        <div className="flex justify-center">
          <Link 
            to="/vacancy" 
            className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Kembali ke Daftar Lowongan
          </Link>
        </div>
      </div>
    );
  }

  const importantDates = getImportantDates(job);
  
  return (
    <div className="container mx-auto px-6 py-8 mt-10">
      <div className="mb-6">
        <Link 
          to="/vacancy" 
          className="text-blue-600 hover:underline flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Kembali ke Daftar Lowongan
        </Link>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Bagian kiri (2/3) - Detail lowongan */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg border border-gray-200 p-6 mx-2 my-2">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8">
              <div className="flex flex-col flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {job.position}
                </h1>
                <p className="text-[#667797] font-medium mb-2">
                  {job.company.name}
                </p>
                <p className="text-gray-600 text-sm flex items-center mb-4">
                  <MapPin size={14} className="mr-1" />
                  {job.company.location}
                </p>

                {statusError && (
                  <div className="flex items-center p-3 mb-4 bg-red-100 text-red-700 rounded-md">
                    <AlertCircle size={16} className="mr-2" />
                    <span>{statusError}</span>
                  </div>
                )}

                <button
                  className={`text-sm font-bold py-2 px-6 rounded-md w-fit ${
                    userMagangStatus === "terdaftar"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  onClick={openModal}
                  disabled={userMagangStatus === "terdaftar"}
                >
                  LAMAR LOWONGAN
                </button>
              </div>
              
              <div className="md:w-1/4 flex justify-end mt-4 md:mt-0">
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="h-24 w-auto object-contain"
                  onError={handleImageError}
                />
              </div>
            </div>

            <div className="border-b border-gray-300 mb-8"></div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Tentang Perusahaan
              </h2>
              <p className="text-[#667797]">
                {job.company.description}
              </p>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6">
                <div className="flex items-center mb-2 md:mb-0">
                  <Mail size={16} className="text-gray-500 mr-2" />
                  <span className="text-[#667797]">
                    {job.company.email}
                  </span>
                </div>
                <div className="flex items-center">
                  <ExternalLink size={16} className="text-gray-500 mr-2" />
                  <a
                    href={`https://${job.company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#667797] hover:underline"
                  >
                    {job.company.website}
                  </a>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-300 mb-8"></div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <MapPin size={20} className="text-gray-600 mr-2" />
                Lokasi Penempatan
              </h2>
              <p className="text-[#667797] pl-7">
                {job.cabang?.nama !== "-" ? job.cabang.nama : job.company.name}
                {job.cabang?.kota !== "-" && job.cabang?.provinsi !== "-" && (
                  <span className="ml-10">
                    ({job.cabang.kota}, {job.cabang.provinsi})
                  </span>
                )}
              </p>
            </div>

            <div className="border-b border-gray-300 mb-8"></div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Dokumen Yang Dibutuhkan
              </h2>
              <ul className="flex flex-wrap gap-8 pl-5 list-disc text-[#667797]">
                {DEFAULT_REQUIRED_DOCUMENTS.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            </div>

            <div className="border-b border-gray-300 mb-8"></div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Tanggal Penting
              </h2>
              {importantDates && (
                <div className="pl-5">
                  <div className="grid grid-cols-1 md:grid-cols-[200px_auto] text-[#667797] mb-2">
                    <span className="font-medium">Durasi</span>
                    <span>: {importantDates.duration}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[200px_auto] text-[#667797] mb-2">
                    <span className="font-medium">Pembukaan</span>
                    <span>: {importantDates.Pembukaan}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[200px_auto] text-[#667797] mb-2">
                    <span className="font-medium">Penutupan</span>
                    <span>: {importantDates.Penutupan}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-b border-gray-300 mb-8"></div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Rincian Lowongan
              </h2>

              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3 pl-5">
                  Persyaratan :
                </h3>
                <ol className="list-decimal pl-12 text-[#667797] space-y-2 text-justify">
                  {job.requirement.map((req, index) => (
                    <li key={index} className="text-justify">{req}</li>
                  ))}
                </ol>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3 pl-5">
                  Jobdesk :
                </h3>
                <ol className="list-decimal pl-12 text-[#667797] space-y-2 text-justify">
                  {job.jobdesc.map((jobdesc, index) => (
                    <li key={index} className="text-justify">{jobdesc}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bagian kanan (1/3) - Daftar 5 lowongan terkait */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg p-6 -mt-15">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Lowongan Terkait
            </h2>
            
            {loading ? (
              <div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-4 pl-20 min-h-40 mb-6 last:mb-0">
                    <div className="absolute left-0 -translate-y-1/3 -translate-x-1/4 w-24 h-20 bg-gray-200 animate-pulse rounded-xl"></div>
                    <div className="mb-1 ml-6">
                      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                      <div className="h-5 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse mb-3"></div>
                    <div className="flex justify-end">
                      <div className="h-8 bg-gray-200 rounded w-28 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : relatedJobs.length > 0 ? (
              <div>
                {relatedJobs.map((relatedJob) => (
                  <RelatedJobCard key={relatedJob.id} job={relatedJob} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">
                Tidak ada lowongan terkait saat ini
              </p>
            )}
            
            <div className="mt-6 text-center">
              <Link 
                to="/vacancy" 
                className="text-blue-600 hover:underline text-sm flex items-center justify-center"
              >
                Lihat semua lowongan
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <PemberkasanModal
          isOpen={modalOpen}
          onClose={closeModal}
          jobData={job}
        />
      )}
    </div>
  );
}