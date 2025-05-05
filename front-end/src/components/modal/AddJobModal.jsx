import axios from "axios";
import React, { useEffect, useState } from "react";

const AddJobModal = ({ showModal, setShowModal, editingData = null }) => {
  const [duration, setDuration] = useState([]);
  const [cabang, setCabang] = useState([]);
  const [divisi, setDevisi] = useState([]);
  const maxWords = 150;

  const [requirementCount, setRequirementCount] = useState(0);
  const [jobdescCount, setJobdescCount] = useState(0);

  const [formData, setFormData] = useState({
    tanggal_mulai: "",
    tanggal_selesai: "",
    id_cabang: "",
    id_divisi: "",
    max_kuota: "",
    durasi: "",
    requirement: "",
    jobdesc: "",
    kategori: "",
  });

  useEffect(() => {
    if (editingData) {
      setFormData(editingData);
    } else {
      setFormData({
        tanggal_mulai: "",
        tanggal_selesai: "",
        id_cabang: "",
        id_divisi: "",
        max_kuota: "",
        durasi: "",
        requirement: "",
        jobdesc: "",
        kategori: "",
      });
    }
  }, [editingData]);

  const handleClose = () => setShowModal(false);

  const LoopingDurationMagang = () => {
    const durationList = Array.from({ length: 12 }, (_, i) => i + 1);
    setDuration(durationList);
  };

  const GetCabang = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cabang`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCabang(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const GetDivisi = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/divisi`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDevisi(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GetCabang();
    GetDivisi();
    LoopingDurationMagang();
  }, []);

  const handleValue = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  useEffect(() => {
    setRequirementCount(countWords(formData.requirement));
  }, [formData.requirement]);

  useEffect(() => {
    setJobdescCount(countWords(formData.jobdesc));
  }, [formData.jobdesc]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingData
        ? `${import.meta.env.VITE_API_URL}/lowongan/${formData.id}`
        : `${import.meta.env.VITE_API_URL}/lowongan`;

      const method = editingData ? "put" : "post";

     await axios({
        method,
        url,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: formData,
      });
      
      setShowModal(false);
    } catch (error) {
      console.error("Gagal menyimpan:", error);
    }
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

        <form className="mt-1" onSubmit={handleSubmit}>
          {/* Tanggal */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                name="tanggal_mulai"
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-xs"
                onChange={handleValue}
                value={formData.tanggal_mulai}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tanggal Selesai
              </label>
              <input
                type="date"
                name="tanggal_selesai"
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-xs"
                onChange={handleValue}
                value={formData.tanggal_selesai}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Cabang
              </label>
              <select
                name="id_cabang"
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-xs bg-white"
                onChange={handleValue}
                value={formData.id_cabang}
              >
                <option value="">Pilih Cabang</option>
                {cabang.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Divisi
              </label>
              <select
                name="id_divisi"
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-xs bg-white"
                onChange={handleValue}
                value={formData.id_divisi}
              >
                <option value="">Pilih Divisi</option>
                {divisi.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Kuota & Durasi */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Jumlah Kuota
              </label>
              <input
                type="number"
                name="max_kuota"
                value={formData.max_kuota}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-xs"
                onChange={handleValue}
                placeholder="Masukkan Jumlah Kuota"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Durasi Magang
              </label>
              <select
                name="durasi"
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-xs bg-white"
                onChange={handleValue}
                value={formData.durasi}
              >
                <option value="">Pilih Durasi</option>
                {duration.map((item) => (
                  <option key={item} value={item}>
                    {item} Bulan
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Requirements Lowongan
            </label>
            <textarea
              className={`w-full border rounded-md py-2 px-3 text-xs ${
                requirementCount < maxWords
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              name="requirement"
              value={formData.requirement}
              onChange={handleValue}
              placeholder="Masukkan persyaratan"
              rows="3"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>Minimal Kata: {maxWords}</span>
              <span>
                {requirementCount}/{maxWords}
              </span>
            </div>
          </div>

          {/* Deskripsi Pekerjaan */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Deskripsi Pekerjaan
            </label>
            <textarea
              className={`w-full border rounded-md py-2 px-3 text-xs ${
                jobdescCount < maxWords ? "border-red-500" : "border-gray-300"
              }`}
              name="jobdesc"
              value={formData.jobdesc}
              onChange={handleValue}
              placeholder="Masukkan deskripsi"
              rows="3"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>Minimal Kata: {maxWords}</span>
              <span>
                {jobdescCount}/{maxWords}
              </span>
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
