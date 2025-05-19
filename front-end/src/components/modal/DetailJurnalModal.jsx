import React, { useState } from "react";
import { X } from "lucide-react";

const DetailJurnalModal = ({ isOpen, onClose, event, onEditClick }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!isOpen || !event) return null;

  // Check if edit button should be shown (within 1 hour of creation)
  const shouldShowEditButton = () => {
    const createdAt = new Date(event.extendedProps?.created_at);
    const now = new Date();
    const hoursElapsed = (now - createdAt) / (1000 * 60 * 60);
    return hoursElapsed < 1; // Mengubah dari 24 jam menjadi 1 jam
  };

  // Handle click outside modal
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };
  
  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999] modal-overlay"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-white rounded-lg w-full max-w-2xl overflow-hidden shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{event.extendedProps?.originalData?.nama || "Tidak ada nama"}</h2>
              <p className="text-gray-500 text-sm">{event.extendedProps?.originalData?.sekolah || "Tidak ada sekolah"}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm mt-4 mb-2 font-medium">Judul</p>
          <p className="text-sm text-gray-600">{event.title}</p>
          <p className="text-sm mt-4 mb-2 font-medium">Bukti Kegiatan</p>
        </div>

        <div className="w-full">
          {event.extendedProps?.bukti ? (
            <img
              src={`${import.meta.env.VITE_API_URL_FILE}/storage/${event.extendedProps.bukti}`}
              alt="Bukti kegiatan"
              className="w-auto h-60 object-cover mx-auto rounded-lg"
              style={{ maxWidth: "90%" }}
            />
          ) : (
            <div className="w-full h-60 bg-gray-200 flex items-center justify-center rounded">
              <p className="text-gray-500">Tidak ada bukti kegiatan</p>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="mb-3">
            <p className="text-sm font-medium">Tanggal</p>
            <p className="text-sm text-gray-600">{event.startStr}</p>
          </div>

          <div className="overflow-y-auto h-auto">
            <p className="text-sm font-medium mb-1">Kegiatan</p>
            <p className="text-sm text-gray-600">
              {event.extendedProps?.deskripsi?.length > 200 && !showFullDescription
                ? `${event.extendedProps.deskripsi.slice(0, 200)}...`
                : event.extendedProps?.deskripsi}
            </p>
            {event.extendedProps?.deskripsi?.length > 200 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-500 text-sm mt-1 hover:underline"
              >
                {showFullDescription ? "Sembunyikan" : "Selengkapnya"}
              </button>
            )}
          </div>

          {/* Tombol edit hanya tampil jika belum lewat 1 jam */}
          <div className="flex gap-3 justify-end mt-6">
            {shouldShowEditButton() ? (
              <button
                onClick={() => onEditClick(event?.extendedProps.originalData)}
                className="px-6 py-2 rounded-full bg-orange-400 text-white font-medium hover:bg-orange-500"
              >
                Edit
              </button>
            ) : (
              <p className="text-sm text-gray-500 italic mt-1">
                
              </p>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailJurnalModal;