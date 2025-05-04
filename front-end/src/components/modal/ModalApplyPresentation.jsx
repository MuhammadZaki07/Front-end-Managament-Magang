import React, { useEffect, useState } from "react";

const ModalApplyPresentation = ({ isOpen, onClose, data }) => {
  const [showModal, setShowModal] = useState(false);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      setShowModal(true);
      window.addEventListener("keydown", handleKeyDown);
    } else {
      setShowModal(false);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white w-[550px] rounded-xl overflow-hidden shadow-lg relative transform transition-all duration-300 ${
          showModal ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        {/* HEADER */}
        <div className="relative bg-blue-200">
          <img
            src="/assets/img/banner/BannerModalApplyPresentation.png"
            alt="Banner"
            className="object-cover mx-auto"
          />
          {/* Avatar di bawah banner */}
          <div className="absolute left-20 -bottom-14 transform -translate-x-1/2 z-10">
            <img
              src="/assets/img/user-img.png"
              className="w-28 h-28 rounded-full object-cover shadow-md"
              alt="Avatar"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="pt-20 px-8 pb-6">
          <h2 className="text-2xl font-semibold text-left mb-2">
            {data?.title}
          </h2>
          <p className="text-gray-500">Persiapkan dirimu untuk mengikuti presentasi!</p>

          <div className="space-y-4 py-10">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">
                Hari dan Tanggal
              </span>
              <span className="text-sm">{data?.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">
                Waktu dan Durasi
              </span>
              <span className="text-sm">{data?.time}</span>
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-500 mb-1">
                Project
              </label>
              <select className="bg-white rounded-lg border text-sm border-slate-300/[0.8] py-2 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 peer">
                <option value="">-- Pilih Project --</option>
                <option value="project-1">Project 1</option>
                <option value="project-2">Project 2</option>
                <option value="project-3">Project 3</option>
              </select>
            </div>
          </div>

          {/* ACTION */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 mr-2 text-sm text-gray-600 hover:text-red-500"
            >
              Batal
            </button>
            <button className="px-5 py-2 bg-sky-800 text-white text-sm rounded-lg hover:bg-sky-700 transition">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalApplyPresentation;
