import axios from "axios";
import React, { useEffect, useState } from "react";

const AddJobModal = ({ showModal, setShowModal, editingData = null, onSucces }) => {
  const [cabang, setCabang] = useState([]);
  const [divisi, setDivisi] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    tanggal_mulai: "",
    tanggal_selesai: "",
    id_cabang: "",
    id_divisi: "",
    max_kuota: "",
    requirement: "",
    jobdesc: "",
  });

  useEffect(() => {
    if (editingData) {
      const {
        tanggal_mulai,
        tanggal_selesai,
        id_cabang,
        id_divisi,
        max_kuota,
        requirement,
        jobdesc,
      } = editingData;

      setFormData({
        tanggal_mulai,
        tanggal_selesai,
        id_cabang,
        id_divisi,
        max_kuota,
        requirement,
        jobdesc,
      });
    } else {
      setFormData({
        tanggal_mulai: "",
        tanggal_selesai: "",
        id_cabang: "",
        id_divisi: "",
        max_kuota: "",
        requirement: "",
        jobdesc: "",
      });
    }

    setErrors({});
    setTouched({});
  }, [editingData]);

  const handleClose = () => setShowModal(false);

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
      setDivisi(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GetCabang();
    GetDivisi();
  }, []);

  const handleValue = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));

    if (name === "max_kuota" && (isNaN(value) || parseInt(value) <= 0)) {
      setErrors(prev => ({ ...prev, [name]: "Kuota harus berupa angka positif" }));
    } else {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  useEffect(() => {
    if (formData.tanggal_mulai && formData.tanggal_selesai) {
      const start = new Date(formData.tanggal_mulai);
      const end = new Date(formData.tanggal_selesai);
      if (end < start) {
        setErrors(prev => ({ ...prev, tanggal_selesai: "Tanggal selesai harus setelah tanggal mulai" }));
      } else {
        setErrors(prev => ({ ...prev, tanggal_selesai: "" }));
      }
    }
  }, [formData.tanggal_mulai, formData.tanggal_selesai]);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      { name: "tanggal_mulai", label: "Tanggal mulai" },
      { name: "tanggal_selesai", label: "Tanggal selesai" },
      { name: "id_cabang", label: "Cabang" },
      { name: "id_divisi", label: "Divisi" },
      { name: "max_kuota", label: "Jumlah kuota" },
      { name: "requirement", label: "Requirement" },
      { name: "jobdesc", label: "Deskripsi pekerjaan" },
    ];

    requiredFields.forEach(field => {
      if (!formData[field.name]) {
        newErrors[field.name] = `${field.label} wajib diisi`;
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.values({ ...errors, ...newErrors }).every(err => !err);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    if (!formData[name]) {
      setErrors(prev => ({ ...prev, [name]: `Field ini wajib diisi` }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const touchedAll = {};
    Object.keys(formData).forEach(k => { touchedAll[k] = true; });
    setTouched(touchedAll);

    if (!validateForm()) return;

    try {
      const url = editingData
        ? `${import.meta.env.VITE_API_URL}/lowongan/${editingData.id}`
        : `${import.meta.env.VITE_API_URL}/lowongan`;

      const method = editingData ? "put" : "post";

      const payload = {
        ...formData,
        max_kuota: parseInt(formData.max_kuota),
      };

      await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: payload,
      });

       setFormData({
        tanggal_mulai: "",
        tanggal_selesai: "",
        id_cabang: "",
        id_divisi: "",
        max_kuota: "",
        requirement: "",
        jobdesc: "",
      });
      setShowModal(false);
      onSucces();
    } catch (err) {
      console.error(err);
      setErrors(prev => ({
        ...prev,
        form: err.response?.data?.message || "Terjadi kesalahan saat menyimpan data",
      }));
    }
  };

  return (
    <div className={`fixed inset-0 bg-black/40 flex justify-center items-center z-[999] ${showModal ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="bg-white rounded-lg shadow-xl p-5 w-96 md:w-112 mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold">{editingData ? "Edit Lowongan" : "Tambah Lowongan"}</h2>
          <button onClick={handleClose} className="text-gray-500 text-xl">⨯</button>
        </div>

        {errors.form && (
          <div className="bg-red-50 text-red-600 p-2 rounded-md mb-3 text-xs">{errors.form}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Tanggal */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Mulai *</label>
              <input
                type="date"
                name="tanggal_mulai"
                value={formData.tanggal_mulai}
                onChange={handleValue}
                onBlur={handleBlur}
                className={`w-full border ${errors.tanggal_mulai && touched.tanggal_mulai ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs`}
              />
              {errors.tanggal_mulai && touched.tanggal_mulai && <p className="text-red-500 text-xs">{errors.tanggal_mulai}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Selesai *</label>
              <input
                type="date"
                name="tanggal_selesai"
                value={formData.tanggal_selesai}
                onChange={handleValue}
                onBlur={handleBlur}
                className={`w-full border ${errors.tanggal_selesai && touched.tanggal_selesai ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs`}
              />
              {errors.tanggal_selesai && touched.tanggal_selesai && <p className="text-red-500 text-xs">{errors.tanggal_selesai}</p>}
            </div>
          </div>

          {/* Cabang & Divisi */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Cabang *</label>
              <select
                name="id_cabang"
                value={formData.id_cabang}
                onChange={handleValue}
                onBlur={handleBlur}
                className={`w-full border ${errors.id_cabang && touched.id_cabang ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs bg-white`}
              >
                <option value="">Pilih Cabang</option>
                {cabang.map(c => <option key={c.id} value={c.id}>{c.nama}</option>)}
              </select>
              {errors.id_cabang && touched.id_cabang && <p className="text-red-500 text-xs">{errors.id_cabang}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Divisi *</label>
              <select
                name="id_divisi"
                value={formData.id_divisi}
                onChange={handleValue}
                onBlur={handleBlur}
                className={`w-full border ${errors.id_divisi && touched.id_divisi ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs bg-white`}
              >
                <option value="">Pilih Divisi</option>
                {divisi.map(d => <option key={d.id} value={d.id}>{d.nama}</option>)}
              </select>
              {errors.id_divisi && touched.id_divisi && <p className="text-red-500 text-xs">{errors.id_divisi}</p>}
            </div>
          </div>

          {/* Kuota */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Jumlah Kuota *</label>
            <input
              type="number"
              name="max_kuota"
              value={formData.max_kuota}
              onChange={handleValue}
              onBlur={handleBlur}
              min="1"
              className={`w-full border ${errors.max_kuota && touched.max_kuota ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs`}
              placeholder="Masukkan jumlah kuota"
            />
            {errors.max_kuota && touched.max_kuota && <p className="text-red-500 text-xs">{errors.max_kuota}</p>}
          </div>

          {/* Requirement */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Requirement *</label>
            <textarea
              name="requirement"
              value={formData.requirement}
              onChange={handleValue}
              onBlur={handleBlur}
              className={`w-full border ${errors.requirement && touched.requirement ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs`}
              rows="3"
              placeholder="Masukkan persyaratan"
            />
            {errors.requirement && touched.requirement && <p className="text-red-500 text-xs">{errors.requirement}</p>}
          </div>

          {/* Jobdesc */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi Pekerjaan *</label>
            <textarea
              name="jobdesc"
              value={formData.jobdesc}
              onChange={handleValue}
              onBlur={handleBlur}
              className={`w-full border ${errors.jobdesc && touched.jobdesc ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs`}
              rows="3"
              placeholder="Masukkan deskripsi pekerjaan"
            />
            {errors.jobdesc && touched.jobdesc && <p className="text-red-500 text-xs">{errors.jobdesc}</p>}
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={handleClose} className="bg-red-500 text-white px-5 py-3 rounded-md text-xs">Batal</button>
            <button type="submit" className="bg-blue-600 text-white px-5 py-3 rounded-md text-xs">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
