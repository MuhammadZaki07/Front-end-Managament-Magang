import React from "react";

const AddJobModal = ({ showModal, setShowModal }) => {
  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/40 flex justify-center items-center z-[999] ${
        showModal ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white rounded-lg shadow-xl p-5 w-96 md:w-112 mx-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold">Tambah Lowongan</h2>
          <button onClick={handleClose} className="text-gray-500 text-xl">
            ⨯
          </button>
        </div>

        <form className="mt-1">
          {/* Tanggal */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <div className="relative">
              <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-xs"
                  placeholder="Tanggal Selesai"
                />
                <span className="absolute right-2 top-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                  </svg>
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tanggal Selesai
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-xs"
                  placeholder="Tanggal Selesai"
                />
                <span className="absolute right-2 top-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Cabang dan Divisi */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Cabang
              </label>
              <div className="relative">
                <select className="w-full border border-gray-300 rounded-md py-2 px-3 text-xs appearance-none bg-white">
                  <option value="">Pilih Cabang</option>
                  <option value="jakarta">Jakarta</option>
                  <option value="bandung">Bandung</option>
                  <option value="surabaya">Surabaya</option>
                </select>
                <span className="absolute right-2 top-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                  </svg>
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Divisi
              </label>
              <div className="relative">
                <select className="w-full border border-gray-300 rounded-md py-2 px-3 text-xs appearance-none bg-white">
                  <option value="">Pilih Divisi</option>
                  <option value="it">IT</option>
                  <option value="marketing">Marketing</option>
                  <option value="finance">Finance</option>
                </select>
                <span className="absolute right-2 top-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Jumlah Kuota */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Masukkan Jumlah Kuota
            </label>
            <div className="relative">
              <input
                type="number"
                className="w-3/4 border border-gray-300 rounded-md py-2 px-3 text-xs"
                placeholder="Masukkan Jumlah Kuota"
              />
     
            </div>
          </div>

          {/* Durasi Magang */}
          <div className="mb-3">
  <label className="block text-xs font-medium text-gray-700 mb-1">
    Durasi Magang
  </label>
  <div className="relative">
    
    <select className="w-3/4 border border-gray-300 rounded-md py-2 px-3 text-xs appearance-none bg-white">
      <option value="">Masukkan Durasi Magang</option>
      <option value="1">1 Bulan</option>
      <option value="3">3 Bulan</option>
      <option value="6">6 Bulan</option>
    </select>
  </div>
</div>



          {/* Requirements Lowongan */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Requirements Lowongan
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-xs"
              placeholder="Masukkan Deskripsi"
              rows="3"
            ></textarea>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">Minimal Kata</span>
              <span className="text-xs text-gray-400">0/150</span>
            </div>
          </div>

          {/* Deskripsi Pekerjaan */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Deskripsi Pekerjaan
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-xs"
              placeholder="Masukkan Deskripsi"
              rows="3"
            ></textarea>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">Minimal Kata</span>
              <span className="text-xs text-gray-400">0/150</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="bg-red-500 text-white px-5 py-3 rounded-md text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-3 rounded-md text-xs"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;