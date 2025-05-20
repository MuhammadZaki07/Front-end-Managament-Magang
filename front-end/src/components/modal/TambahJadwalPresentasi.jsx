import React, { useState, useEffect } from "react";

const AddEventModal = ({ show, onClose, onSubmit }) => {
  const [animateModal, setAnimateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    quota: "",
    startTime: "",
    endTime: "",
    zoomLink: "",
    location: "",
  });

  // Apply animation effect when modal opens
  useEffect(() => {
    if (show) {
      // Use setTimeout to allow the modal to render before animating
      setTimeout(() => {
        setAnimateModal(true);
      }, 10);
    } else {
      setAnimateModal(false);
    }
  }, [show]);

  // Reset form data when modal closes
  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        setFormData({
          title: "",
          quota: "",
          startTime: "",
          endTime: "",
          zoomLink: "",
          location: "",
        });
        setSelectedStatus("");
      }, 300);
    }
  }, [show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setAnimateModal(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match the duration of the transition
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      status: selectedStatus,
    });
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
      <div className={`bg-white w-full max-w-3xl rounded-2xl p-6 transition-all duration-300 transform ${animateModal ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Tambah Jadwal Presentasi</h3>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form className="space-y-2 text-sm" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium">
              Judul Presentasi <span className="text-red-500">(Required)</span>
            </label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Judul Presentasi" className="w-full border border-[#D5DBE7] rounded-lg p-2 mt-1" maxLength={100} required />
            <p className="text-right text-xs text-gray-500 mt-1">{formData.title.length} / 100</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Kuota</label>
              <input type="number" name="quota" value={formData.quota} onChange={handleInputChange} className="w-full border border-[#D5DBE7] rounded-lg p-2" placeholder="Masukkan Kuota" />
            </div>
            <div>
              <label className="block font-medium">Status Presentasi</label>
              <select className="w-full border border-[#D5DBE7] rounded-lg p-2" onChange={(e) => setSelectedStatus(e.target.value)} value={selectedStatus}>
                <option value="">Pilih status presentasi</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Jam Presentasi</label>
              <div className="flex gap-2">
                <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="w-full border border-[#D5DBE7] rounded-lg p-2" />
                <span className="self-center">-</span>
                <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="w-full border border-[#D5DBE7] rounded-lg p-2" />
              </div>
            </div>

            {/* Conditional rendering based on selected status */}
            {selectedStatus === "online" && (
              <div>
                <label className="block font-medium">Link Zoom</label>
                <input type="text" name="zoomLink" value={formData.zoomLink} onChange={handleInputChange} className="w-full border border-[#D5DBE7] rounded-lg p-2" placeholder="Masukkan Link Zoom" />
              </div>
            )}

            {selectedStatus === "offline" && (
              <div>
                <label className="block font-medium">Lokasi</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full border border-[#D5DBE7] rounded-lg p-2" placeholder="Masukkan Lokasi" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-sm rounded-full border border-blue-500 text-blue-500 hover:bg-blue-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm rounded-full bg-blue-500 text-white hover:bg-blue-600">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
