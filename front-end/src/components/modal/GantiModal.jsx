import React, { useState } from "react";
import { X } from "lucide-react";

// GantiModal Component
const GantiModal = ({ isOpen, onClose, onSimpan, data }) => {
  const [nama, setNama] = useState(data?.nama || "");
  const [divisi, setDivisi] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/40 bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md z-10 relative">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold">Ganti Divisi</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Masukkan Divisi</label>
            <div className="relative">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none bg-white"
                value={divisi}
                onChange={(e) => setDivisi(e.target.value)}
              >
                <option value="" disabled>Pilih Divisi</option>
                <option value="web">Web Development</option>
                <option value="mobile">Mobile Development</option>
                <option value="ui">UI/UX Designer</option>
                <option value="data">Data Analyst</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-red-400 text-white rounded-full hover:bg-red-500"
            >
              Batal
            </button>
            <button
              onClick={() => {
                onSimpan({ nama, divisi });
                onClose();
              }}
              className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GantiModal;
