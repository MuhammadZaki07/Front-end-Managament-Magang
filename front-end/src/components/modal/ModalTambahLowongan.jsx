import React, { useState } from "react";

export default function ModalTambahLowongan({ isOpen, onClose }) {
  const [kuota, setKuota] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-lg text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Tambah Lowongan
        </h2>

        {/* Form */}
        <form className="space-y-4">
          {/* Tanggal Mulai & Selesai */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Tanggal Mulai</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Tanggal Selesai</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Cabang & Divisi */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Cabang</label>
              <select className="w-full border rounded-lg px-3 py-2 mt-1 text-sm">
                <option>Pilih Cabang</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Divisi</label>
              <select className="w-full border rounded-lg px-3 py-2 mt-1 text-sm">
                <option>Pilih Divisi</option>
              </select>
            </div>
          </div>

          {/* Jumlah Kuota */}
          <div>
            <label className="text-sm text-gray-600">Masukkan Jumlah Kuota</label>
            <input
              type="number"
              value={kuota}
              onChange={(e) => setKuota(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              placeholder="Masukkan Jumlah Kuota"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="text-sm text-gray-600">Deskripsi Lowongan</label>
            <textarea
              rows="3"
              maxLength="150"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Masukkan Deskripsi"
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm resize-none"
            ></textarea>
            <div className="text-right text-xs text-gray-400 mt-1">
              {deskripsi.length}/150
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-red-500 text-white text-sm hover:bg-red-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
