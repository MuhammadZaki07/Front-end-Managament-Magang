import React, { useEffect, useState } from "react";
import {
  X,
  Building,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Globe,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const JobDetail = ({ job, onClose, onEdit, onSucces, loading }) => {
  // State untuk tracking job data lokal
  const [jobData, setJobData] = useState(() => {
    return Array.isArray(job) ? job[0] : job;
  });

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose && onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Update jobData ketika prop job berubah
  useEffect(() => {
    const newJobData = Array.isArray(job) ? job[0] : job;
    setJobData(newJobData);
  }, [job]);

  // Debug log untuk melihat struktur job yang diterima
  console.log("JobDetail received job:", job);
  
  if (!jobData) {
    console.log("No job data available");
    return null;
  }
  
  const handleTutupClick = () => {
    // Gunakan SweetAlert2 untuk konfirmasi tutup lowongan
    Swal.fire({
      title: 'Konfirmasi Tutup Lowongan',
      text: 'Apakah Anda yakin ingin menutup lowongan ini? Tindakan ini tidak dapat dibatalkan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Tutup Lowongan',
      cancelButtonText: 'Batal',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateStatus(jobData.id);
      }
    });
  };

  const handleUpdateStatus = async (id) => {
    // Show loading indicator
    Swal.fire({
      title: 'Menutup Lowongan',
      text: 'Mohon tunggu...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/lowongan/${id}/tutup`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      // Update status lokal langsung supaya tampilan berubah
      setJobData(prevData => ({
        ...prevData,
        status: 0 // Set status menjadi 0 (Selesai)
      }));
      
      // Close loading indicator
      Swal.close();
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Lowongan berhasil ditutup',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        // Panggil onSucces untuk update parent component
        onSucces();
        // Tidak perlu onClose() karena user mungkin ingin melihat status yang sudah berubah
      });
      
    } catch (error) {
      console.log(error);
      
      // Close loading indicator
      Swal.close();
      
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error.response?.data?.message || 'Terjadi kesalahan saat menutup lowongan',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  // Simplified close detail function - no SweetAlert
  const handleCloseDetail = () => {
    onClose && onClose();
  };

  // Simplified edit function - no SweetAlert
  const handleEditClick = () => {
    onEdit && onEdit(jobData);
  };

  // Format tanggal untuk durasi lowongan
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Helper function untuk mendapatkan nilai total pendaftar yang aman
  const getTotalPendaftar = () => {
    return jobData.total_pendaftar ?? 0;
  };

  // Helper function untuk mendapatkan max kuota yang aman
  const getMaxKuota = () => {
    return jobData.max_kuota ?? 0;
  };

  // Helper function untuk mendapatkan nama perusahaan
  const getCompanyName = () => {
    return jobData.perusahaan?.perusahaan?.nama || "Nama Perusahaan Tidak Tersedia";
  };

  // Helper function untuk mendapatkan lokasi
  const getLocation = () => {
    const cabangKota = jobData.cabang?.kota;
    const cabangProvinsi = jobData.cabang?.provinsi;
    const perusahaanKota = jobData.perusahaan?.perusahaan?.kota;
    const perusahaanProvinsi = jobData.perusahaan?.perusahaan?.provinsi;
    
    // Prioritas: cabang dulu, baru perusahaan
    const kota = cabangKota || perusahaanKota;
    const provinsi = cabangProvinsi || perusahaanProvinsi;
    
    if (kota && provinsi) {
      return `${kota}, ${provinsi}`;
    } else if (kota) {
      return kota;
    } else if (provinsi) {
      return provinsi;
    }
    return 'Lokasi tidak tersedia';
  };

  // Helper function untuk mendapatkan website
  const getWebsite = () => {
    return jobData.perusahaan?.perusahaan?.website;
  };

  // Helper function untuk mendapatkan nama cabang
  const getCabangName = () => {
    return jobData.cabang?.nama || 'Cabang tidak tersedia';
  };

  // Helper function untuk mendapatkan nama divisi
  const getDivisiName = () => {
    return jobData.divisi?.nama || 'Divisi tidak tersedia';
  };

  // Helper function untuk mendapatkan bidang usaha
  const getBidangUsaha = () => {
    return jobData.cabang?.bidang_usaha || jobData.perusahaan?.perusahaan?.bidang_usaha || 'Bidang usaha tidak tersedia';
  };

  // Simplified website click handler - no SweetAlert
  const handleWebsiteClick = (e) => {
    e.preventDefault();
    const website = getWebsite();
    const url = website.startsWith("http") ? website : `https://${website}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg h-fit w-full">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-500">Memuat detail...</span>
        </div>
      )}

      {/* Main Content */}
      {!loading && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Detail Lowongan</h2>
            <button onClick={handleCloseDetail} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4 relative">
            <img
              src="/assets/img/Container.png"
              alt={getCompanyName()}
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="relative -mt-8 flex justify-center">
              <div className="w-16 h-16 bg-white rounded-full p-1 shadow-md">
                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                  <Building className="text-blue-500 w-8 h-8" />
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-center text-lg font-bold mt-2">
            {getCabangName()}
          </h3>
          <p className="text-center text-sm text-gray-500 mb-1">
            {jobData.cabang?.provinsi || jobData.perusahaan?.perusahaan?.provinsi || 'Provinsi tidak tersedia'}, Indonesia
          </p>
          <p className="text-center text-xs text-gray-600 mb-6">
            Perusahaan ini bergerak di bidang {getBidangUsaha()}
          </p>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Informasi Detail</h4>

            {/* Status Lowongan */}
            <div className="flex items-center mb-3">
              <div className="flex items-center gap-2 w-1/2">
                <div className="w-5 h-5 text-blue-500">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-500">Status:</span>
              </div>
              <div className="w-1/2">
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    jobData.status === 1
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {jobData.status === 0 ? "Selesai" : "Berlangsung"}
                </span>
              </div>
            </div>

            {/* Total Pendaftar */}
            <div className="flex items-center mb-3">
              <div className="flex items-center gap-2 w-1/2">
                <div className="w-5 h-5 text-blue-500">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-500">Pendaftar:</span>
              </div>
              <div className="w-1/2 text-sm font-medium">
                <span className="text-blue-600">{getTotalPendaftar()}</span>
                <span className="text-gray-400"> / {getMaxKuota()} orang</span>
              </div>
            </div>

            {/* Website */}
            {getWebsite() && (
              <div className="flex items-center mb-3 gap-2">
                <div className="w-5 h-5 text-blue-500">
                  <Globe className="w-5 h-5" />
                </div>
                <button
                  onClick={handleWebsiteClick}
                  className="text-sm font-medium text-sky-500 underline hover:text-sky-600 break-all text-left"
                >
                  {getWebsite()}
                </button>
              </div>
            )}

            {/* Requirements */}
            {jobData.requirement && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Persyaratan:</h5>
                <p className="text-xs text-gray-600 whitespace-pre-wrap">
                  {jobData.requirement}
                </p>
              </div>
            )}

            {/* Job Description */}
            {jobData.jobdesc && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Job Desk:</h5>
                <p className="text-xs text-gray-600 whitespace-pre-wrap">
                  {jobData.jobdesc}
                </p>
              </div>
            )}
          </div>

          {jobData.status === 1 && (
            <div className="mt-8 flex gap-2">
              <button
                onClick={handleTutupClick}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50 flex-1 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 flex-1 transition-colors"
              >
                Edit
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobDetail;