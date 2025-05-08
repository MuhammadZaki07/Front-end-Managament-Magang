import { ArrowRight, MapPin, Calendar, Mail, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
// Import the PemberkasanModal component
import PemberkasanModal from "../../components/modal/PemberkasanModal";

// Sample job vacancy data
const jobVacancies = [
  {
    id: 1,
    company: {
      name: "PT. HUMMA TEKNOLOGI INDONESIA",
      location: "Malang, Indonesia",
      email: "recruitment@hummaindonesia.id",
      website: "hummaindonesia.id",
      coverImage: "/assets/img/Cover.png",
      logo: "/assets/img/logolowongan.png",
      description: "PT Humma Teknologi Indonesia adalah perusahaan teknologi terkemuka yang bergerak di bidang pengembangan software, konsultasi IT, dan solusi digital untuk berbagai industri.",
    },
    position: "Magang di Divisi Akuntansi",
    period: "15 Mei 2025 - 15 Juli 2025",
    duration: "6 Bulan",
    applicants: 67,
    positions: 1,
    documents: ["CV", "Surat Pernyataan Diri"],
    importantDates: {
      duration: "6 Bulan",
      Pembukaan: "15 Juli 2025",
      Penutupan: "18 Juli 2025",
    },
    requirements: [
      "Mahasiswa semester 5-7 jurusan Akuntansi",
      "Menguasai dasar-dasar akuntansi dan pajak",
      "Familiar dengan software akuntansi (Accurate/Zahir)",
      "Teliti dan mampu bekerja dengan deadline",
      "Dapat bekerja fulltime selama periode magang",
      "Memiliki kemampuan komunikasi yang baik",
      "Mampu bekerja dalam tim maupun individu",
    ],
    benefits: ["Uang transportasi", "Sertifikat magang", "Pelatihan dan mentoring", "Kesempatan berkarir", "Lingkungan kerja yang supportive", "Networking dengan profesional industri"],
  },
  {
    id: 2,
    company: {
      name: "PT. KIMIA FARMA TBK",
      location: "Jakarta, Indonesia",
      email: "recruitment@kimiafarmacorp.id",
      website: "kimiafarmacorp.id",
      coverImage: "/assets/img/Cover.png",
      logo: "/assets/img/logolowongan.png",
      description: "PT Kimia Farma Tbk adalah perusahaan farmasi terkemuka di Indonesia yang bergerak di bidang produksi, distribusi, dan penjualan obat-obatan serta produk kesehatan lainnya.",
    },
    position: "Magang di Divisi Marketing",
    period: "1 Juni 2025 - 1 Desember 2025",
    duration: "6 Bulan",
    applicants: 42,
    positions: 2,
    documents: ["CV", "Portfolio", "Surat Rekomendasi"],
    importantDates: {
      duration: "6 Bulan",
      Pembukaan: "25 Mei 2025",
      Penutupan: "30 Mei 2025",
    },
    requirements: [
      "Mahasiswa semester 5-7 jurusan Marketing atau Komunikasi",
      "Menguasai tools digital marketing",
      "Memiliki pengalaman mengelola social media",
      "Creative dan inovatif",
      "Mampu bekerja dalam tim dengan deadline ketat",
      "Memiliki kemampuan komunikasi yang baik",
    ],
    benefits: ["Uang transportasi", "Uang makan", "Sertifikat magang", "Pelatihan profesional", "Kesempatan berkarir", "Exposure ke industri farmasi"],
  },
  {
    id: 3,
    company: {
      name: "PT. BANK MANDIRI PERSERO",
      location: "Surabaya, Indonesia",
      email: "careers@bankmandiri.co.id",
      website: "bankmandiri.co.id",
      coverImage: "/assets/img/Cover.png",
      logo: "/assets/img/logolowongan.png",
      description:
        "PT Bank Mandiri Persero adalah bank terbesar di Indonesia dalam hal aset, pinjaman, dan deposit. Bank ini didirikan pada tanggal 2 Oktober 1998 sebagai bagian dari program restrukturisasi perbankan pemerintah Indonesia.",
    },
    position: "Magang di Divisi Digital Banking",
    period: "1 Juli 2025 - 31 Desember 2025",
    duration: "6 Bulan",
    applicants: 135,
    positions: 3,
    documents: ["CV", "Transkrip Nilai", "Surat Keterangan Mahasiswa"],
    importantDates: {
      duration: "6 Bulan",
      Pembukaan: "15 Juni 2025",
      Penutupan: "20 Juni 2025",
    },
    requirements: [
      "Mahasiswa tingkat akhir jurusan IT, Sistem Informasi, atau Teknik Informatika",
      "Memiliki kemampuan coding (Java/Python/JavaScript)",
      "Familiar dengan konsep database dan API",
      "Memahami prinsip UI/UX",
      "Mampu bekerja dalam tim multidisiplin",
      "Bersedia bekerja fulltime di kantor",
    ],
    benefits: ["Tunjangan bulanan", "Sertifikat magang", "Pengalaman di industri perbankan", "Mentoring dari profesional IT Banking", "Akses ke training internal", "Kesempatan untuk direkrut sebagai karyawan tetap"],
  },
];

export default function JobVacancyLayout() {
  const [selectedJob, setSelectedJob] = useState(jobVacancies[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false); // State for controlling modal visibility
  const jobsPerPage = 3;
  const jobDetailRef = useRef(null);
  
  // Calculate total pages
  const totalPages = Math.ceil(jobVacancies.length / jobsPerPage);
  
  // Get current jobs
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobVacancies.slice(indexOfFirstJob, indexOfLastJob);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    // Scroll job detail to top when a new job is selected
    if (jobDetailRef.current) {
        jobDetailRef.current.scrollTop = 0;
    }
  };
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // If current selected job is not in the current page, select the first job of the new page
    const jobsOnNewPage = jobVacancies.slice((pageNumber - 1) * jobsPerPage, pageNumber * jobsPerPage);
    if (!jobsOnNewPage.find(job => job.id === selectedJob.id)) {
      setSelectedJob(jobsOnNewPage[0]);
      // Also scroll to top when changing pages
      if (jobDetailRef.current) {
        jobDetailRef.current.scrollTop = 0;
      }
    }
  };

  // Function to open the modal
  const openModal = () => {
    setModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white mt-10 p-6">
      {/* Left Column - Job Cards (1/3 width) */}
      <div className="w-full md:w-1/3 bg-white overflow-y-auto px-6 py-9">
        
        {currentJobs.map((job) => (
          <div 
            key={job.id} 
            className={`mb-8 cursor-pointer ${selectedJob.id === job.id ? 'ring-2 ring-blue-500 rounded-xl' : ''}`}
            onClick={() => handleSelectJob(job)}
          >
            <div className="relative bg-white rounded-xl shadow-md overflow-hidden">
              {/* Company Image - Larger and positioned to overlap the top of the card */}
              <div className="relative">
                <div className="h-36 w-full overflow-hidden">
                  <img 
                    src={job.company.coverImage} 
                    alt="Company Cover" 
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              
              {/* Card Content */}
              <div className="p-4">
                {/* Company Details */}
                <div className="mb-3">
                  <h2 className="text-lg font-bold text-gray-800">{job.company.name}</h2>
                  <p className="text-gray-600 text-sm">{job.company.location}</p>
                  <p className="text-gray-600 text-sm">{job.period}</p>
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs rounded-full mt-2">{job.duration}</span>
                </div>
                
                {/* Job Title and Position Info - Now below the image */}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <h3 className="text-xl font-bold text-gray-900">{job.position}</h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    {job.positions} Posisi • {job.applicants} Pelamar
                  </p>
                </div>
                
                {/* Button */}
                <div className="flex justify-end mt-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-blue-700">
                    VIEW VACANCY
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-4">
          {/* Previous button */}
          <button 
            className={`w-8 h-8 flex items-center justify-center rounded-md border ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          
          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button 
              key={number}
              className={`w-8 h-8 flex items-center justify-center rounded-md border ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          ))}
          
          {/* Next button */}
          <button 
            className={`w-8 h-8 flex items-center justify-center rounded-md border ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      {/* Right Column - Job Details (2/3 width) */}
      <div 
      ref={jobDetailRef} 
      className="w-full md:w-2/3 border border-gray-300 bg-white rounded-lg overflow-y-auto p-20 mt-8">
        {selectedJob && (
          <>
{/* Header with logo */}
<div className="flex flex-col md:flex-row-reverse justify-between items-start mb-6">
  {/* Logo di kanan */}
  <div className="mb-4 md:mb-0 md:w-1/4 flex justify-end">
    <img
      src={selectedJob.company.logo}
      alt={selectedJob.company.name}
      className="h-20 w-auto object-contain"
    />
  </div>

  {/* Info di kiri */}
  <div className="flex flex-col flex-1">
    <h1 className="text-2xl font-bold text-gray-800 mb-2">{selectedJob.position}</h1>
    <p className="text-blue-600 font-medium mb-2">{selectedJob.company.name}</p>
    <p className="text-gray-600 text-sm flex items-center mb-4">
      <MapPin size={14} className="mr-1" />
      {selectedJob.company.location}
    </p>

    <button 
      className="bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-blue-700 w-fit"
      onClick={openModal}
    >
      APPLY VACANCY
    </button>
  </div>
</div>

            
            <div className="border-b border-gray-300 mb-5"></div>
            
            {/* Company Description */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Tentang Perusahaan</h2>
              <p className="text-gray-700 text-sm">{selectedJob.company.description}</p>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 text-sm">
                <div className="flex items-center mb-2 md:mb-0">
                  <Mail size={16} className="text-gray-500 mr-2" />
                  <span className="text-gray-700">{selectedJob.company.email}</span>
                </div>
                <div className="flex items-center">
                  <ExternalLink size={16} className="text-gray-500 mr-2" />
                  <a href={`https://${selectedJob.company.website}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline">
                    {selectedJob.company.website}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="border-b border-gray-300 mb-5"></div>
            
            {/* Required Documents */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Dokumen Yang Dibutuhkan</h2>
              <ul className="flex flex-wrap gap-8 pl-5 list-disc text-sm text-gray-700">
                {selectedJob.documents.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            </div>
            
            <div className="border-b border-gray-300 mb-5"></div>
            
            {/* Important Dates */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Tanggal Penting</h2>
              <div className="pl-5">
                <div className="grid grid-cols-[200px_auto] text-sm text-gray-700 mb-1">
                  <span>Durasi</span>
                  <span>: {selectedJob.importantDates.duration}</span>
                </div>
                <div className="grid grid-cols-[200px_auto] text-sm text-gray-700 mb-1">
                  <span>Pembukaan</span>
                  <span>: {selectedJob.importantDates.Pembukaan}</span>
                </div>
                <div className="grid grid-cols-[200px_auto] text-sm text-gray-700 mb-1">
                  <span>Penutupan</span>
                  <span>: {selectedJob.importantDates.Penutupan}</span>
                </div>
              </div>
            </div>
            
            <div className="border-b border-gray-300 mb-5"></div>
            
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Rincian Lowongan</h2>
              
              {/* Requirements */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-2 pl-5">Requirements :</h3>
                <ol className="list-decimal pl-12 text-sm text-gray-700 space-y-2">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ol>
              </div>
              
              {/* Benefits */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-2 pl-5">Benefits :</h3>
                <ol className="list-decimal pl-12 text-sm text-gray-700 space-y-2">
                  {selectedJob.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ol>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Render the PemberkasanModal component */}
      {modalOpen && (
        <PemberkasanModal 
          isOpen={modalOpen} 
          onClose={closeModal}
          jobData={selectedJob} // Pass the selected job data to the modal
        />
      )}
    </div>
  );
}