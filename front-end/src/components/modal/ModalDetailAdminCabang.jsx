import React, { useEffect } from "react";

const ModalDetailAdminCabang = ({ isOpen, onClose, branch }) => {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // Prevent page scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !branch) return null;

  // Close modal when clicking on backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Profile Card */}
        <div className="flex flex-col items-center p-6">
          {/* Profile Image - changed to square */}
          <div className="w-32 h-32 mb-4 overflow-hidden border-4 border-white">
            <img
              src={`${import.meta.env.VITE_API_URL_FILE}/storage/${
                branch.foto?.find((f) => f.type === "profile")?.path ?? ""
              }`}
              alt={`${branch.user?.nama ?? "Admin"} Profile`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name and Role */}
          <h2 className="text-4xl font-bold text-black mt-2">
            {branch.user?.nama ?? "Nama Tidak Tersedia"}
          </h2>

          <p className="text-lg text-blue-500 mt-1">Admin Cabang</p>

          <div className="mt-6 w-full text-center">
            <p className="text-xl text-gray-500">{branch.user?.email ?? "-"}</p>
            <p className="text-xl text-gray-500 mt-2">
              {branch.user?.telepon ?? "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetailAdminCabang;
