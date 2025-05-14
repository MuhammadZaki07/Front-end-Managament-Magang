import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import Card from "../../components/cards/Card";
import CardAbsensi from "../../components/cards/CardAbsensi";
import TableAbsensi from "../../components/cards/TableAbsensi";
import IzinModal from "../../components/ui/IzinModal";
import axios from "axios";

// New success modal component
const SuccessModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div className="bg-white rounded-lg p-6 w-80 max-w-md shadow-xl transform transition-all">
        <div className="text-center">
          {/* Success icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg 
              className="h-6 w-6 text-green-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          {/* Message */}
          <h3 className="mt-4 text-lg font-medium text-gray-900">Berhasil!</h3>
          <p className="mt-2 text-sm text-gray-500">
            {message || "Absensi berhasil dicatat."}
          </p>
          
          {/* Close button */}
          <div className="mt-5">
            <Button 
              onClick={onClose}
              className="w-full"
            >
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Absensi = () => {
  const [isIzinModalOpen, setIsIzinModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [tableKey, setTableKey] = useState(0); // Key to force table refresh
  
  const dummyAbsensi = [
    {
      bgColor: "bg-indigo-500",
      Title: "Hadir",
      sum: 24,
      src: "graduate",
    },
    {
      bgColor: "bg-emerald-300",
      Title: "Izin",
      sum: 3,
      src: "certificateLogo",
    },
    {
      bgColor: "bg-sky-500",
      Title: "Alpa",
      sum: 2,
      src: "book",
    },
    {
      bgColor: "bg-orange-500",
      Title: "Terlambat",
      sum: 5,
      src: "mens",
    },
  ];

  const handleAbsen = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/kehadiran`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Handle successful response
      if (response.status >= 200 && response.status < 300) {
        // Set success message based on response or use default
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setSuccessMessage(
          response.data?.message || 
          `Absensi berhasil dicatat pada pukul ${currentTime}`
        );
        
        // Show success modal
        setIsSuccessModalOpen(true);
        
        // Refresh the attendance table
        setTableKey(prevKey => prevKey + 1);
      }
    } catch (error) {
      console.error("Error during absensi:", error);
      
      // Show error message based on response
      let errorMsg = "Terjadi kesalahan saat melakukan absensi.";
      
      if (error.response) {
        // Handle different error statuses
        switch (error.response.status) {
          case 401:
            errorMsg = "Sesi login telah berakhir. Silakan login kembali.";
            break;
          case 403:
            errorMsg = "Anda tidak memiliki izin untuk melakukan absensi.";
            break;
          case 422:
            errorMsg = error.response.data?.message || "Data absensi tidak valid.";
            break;
          case 429:
            errorMsg = "Anda telah mencoba terlalu banyak. Silakan coba lagi nanti.";
            break;
          default:
            errorMsg = error.response.data?.message || errorMsg;
        }
      } else if (error.request) {
        errorMsg = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      }
      
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-13 px-12">
        {dummyAbsensi.map((item, index) => (
          <CardAbsensi
            key={index}
            bgColor={item.bgColor}
            Title={item.Title}
            sum={item.sum}
            src={item.src}
          />
        ))}
      </div>
      <div className="mt-10 px-10">
        <div className="flex justify-end gap-2">
          <Button 
            onClick={handleAbsen}
            disabled={loading}
          >
            {loading ? "Absen sedang diproses..." : "Absen"}
          </Button>
          <Button
            bgColor="bg-orange-400"
            onClick={() => setIsIzinModalOpen(true)}
            disabled={loading}
          >
            Izin
          </Button>
          <Button bgColor="bg-emerald-400">PDF</Button>
        </div>
        
        {/* Pass the key to force re-render when attendance is submitted */}
        <TableAbsensi key={tableKey} />
      </div>
      
      {/* Izin Modal */}
      <IzinModal
        isOpen={isIzinModalOpen}
        onClose={() => setIsIzinModalOpen(false)}
      />
      
      {/* Success Modal */}
      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        message={successMessage}
      />
    </section>
  );
};

export default Absensi;