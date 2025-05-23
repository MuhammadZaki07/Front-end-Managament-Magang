import React, { useEffect, useState } from "react";
import {
  X,
  Building,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Instagram,
  Globe,
  Linkedin,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const JobDetail = ({ job, onClose, onEdit,onSucces }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  console.log(job);
  
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

  if (!job) return null;
  const handleTutupClick = () => {
    setShowConfirmationModal(true);
  };

  const handleUpdateStatus = async (id) => {
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
      onClose()
      onSucces()
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg h-fit sticky top-4 w-1/3">
      {/* Main Content */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Detail Lowongan</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-4 relative">
        <img
          src="/assets/img/Container.png"
          alt={job.perusahaan.nama}
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
        {job.perusahaan.nama}
      </h3>
      <p className="text-center text-sm text-gray-500 mb-2">
        {job.cabang.kota}
      </p>
      <p className="text-center text-xs text-gray-600 mb-6">{job.jobdesc}</p>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Informasi Detail</h4>

        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2 w-1/2">
            <div className="w-5 h-5 text-blue-500">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-sm text-gray-500">Status Lowongan:</span>
          </div>
          <div className="w-1/2">
            <span
              className={`px-2 py-1 rounded-lg text-xs ${
                job.status === "1"
                  ? "bg-orange-100 text-orange-500"
                  : "bg-emerald-100 text-emerald-500"
              }`}
            >
              {job.status === 0 ? "Selsai" : "Berlangsung"}
            </span>
          </div>
        </div>

        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2 w-1/2">
            <div className="w-5 h-5 text-blue-500">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-sm text-gray-500">Durasi Lowongan:</span>
          </div>
          <div className="w-1/2 text-sm font-medium">{job.durasi} Bulan</div>
        </div>

        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2 w-1/2">
            <div className="w-5 h-5 text-blue-500">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-sm text-gray-500">Lokasi Penempatan:</span>
          </div>
          <div className="w-1/2 text-sm font-medium">{job.cabang.kota}</div>
        </div>

        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2 w-1/2">
            <div className="w-5 h-5 text-blue-500">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-sm text-gray-500">Website:</span>
          </div>
          <Link
            to={
              job.perusahaan.website?.startsWith("http")
                ? job.perusahaan.website
                : `https://${job.perusahaan.website || ""}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="w-1/2 text-sm font-medium text-sky-500 underline"
          >
            Website {job.perusahaan.nama}
          </Link>
        </div>
      </div>

      {job.status === 1 && (
        <div className="mt-8 flex gap-2">
          <button
            onClick={handleTutupClick}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50 flex-1"
          >
            Tutup
          </button>
          <button
            onClick={() => onEdit && onEdit(job)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 flex-1"
          >
            Edit
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[99999]">
          <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="text-red-500 w-6 h-6" />
              </div>
            </div>

            <h3 className="text-lg font-medium text-center mb-2">
              Konfirmasi Tutup
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Apakah Anda yakin ingin menutup lowongan ini? Tindakan ini tidak
              dapat dibatalkan.
            </p>

            <div className="flex gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50 flex-1"
              >
                Batal
              </button>
              <button
                onClick={() => handleUpdateStatus(job.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 flex-1"
              >
                Ya, Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
