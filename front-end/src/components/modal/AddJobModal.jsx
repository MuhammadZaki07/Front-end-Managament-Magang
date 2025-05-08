import axios from "axios";
import React, { useEffect, useState } from "react";

const AddJobModal = ({ showModal, setShowModal, editingData = null, onSucces }) => {
  const [duration, setDuration] = useState([]);
  const [cabang, setCabang] = useState([]);
  const [divisi, setDevisi] = useState([]);
  const maxWords = 150;

  const [requirementCount, setRequirementCount] = useState(0);
  const [jobdescCount, setJobdescCount] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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
    setErrors({});
    setTouched({});
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
    
    // Handle specific field validations
    if (name === "max_kuota") {
      // Only allow positive numbers
      if (value && (isNaN(value) || parseInt(value) <= 0)) {
        setErrors(prev => ({ ...prev, [name]: "Kuota harus berupa angka positif" }));
      } else {
        setErrors(prev => ({ ...prev, [name]: "" }));
      }
    }
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  useEffect(() => {
    setRequirementCount(countWords(formData.requirement));
    
    // Validate requirement field
    if (formData.requirement && !isNaN(formData.requirement)) {
      setErrors(prev => ({ ...prev, requirement: "Requirement harus berupa teks" }));
    } else if (touched.requirement && requirementCount > 0 && requirementCount < maxWords) {
      setErrors(prev => ({ ...prev, requirement: `Minimal ${maxWords} kata` }));
    } else {
      setErrors(prev => ({ ...prev, requirement: "" }));
    }
  }, [formData.requirement, touched.requirement]);

  useEffect(() => {
    setJobdescCount(countWords(formData.jobdesc));
    
    // Validate jobdesc field
    if (formData.jobdesc && !isNaN(formData.jobdesc)) {
      setErrors(prev => ({ ...prev, jobdesc: "Deskripsi pekerjaan harus berupa teks" }));
    } else if (touched.jobdesc && jobdescCount > 0 && jobdescCount < maxWords) {
      setErrors(prev => ({ ...prev, jobdesc: `Minimal ${maxWords} kata` }));
    } else {
      setErrors(prev => ({ ...prev, jobdesc: "" }));
    }
  }, [formData.jobdesc, touched.jobdesc]);

  // Validate dates when either date changes
  useEffect(() => {
    if (formData.tanggal_mulai && formData.tanggal_selesai) {
      const startDate = new Date(formData.tanggal_mulai);
      const endDate = new Date(formData.tanggal_selesai);
      
      if (endDate < startDate) {
        setErrors(prev => ({ 
          ...prev, 
          tanggal_selesai: "Tanggal selesai harus setelah tanggal mulai" 
        }));
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
      { name: "durasi", label: "Durasi magang" },
      { name: "requirement", label: "Requirement" },
      { name: "jobdesc", label: "Deskripsi pekerjaan" }
    ];
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!formData[field.name]) {
        newErrors[field.name] = `${field.label} wajib diisi`;
      }
    });
    
    // Check requirement and jobdesc word count
    if (formData.requirement && requirementCount < maxWords) {
      newErrors.requirement = `Minimal ${maxWords} kata`;
    }
    
    if (formData.jobdesc && jobdescCount < maxWords) {
      newErrors.jobdesc = `Minimal ${maxWords} kata`;
    }
    
    // Merge with existing errors
    setErrors(prev => ({ ...prev, ...newErrors }));
    
    // Form is valid if there are no errors
    return Object.values(newErrors).every(error => !error) && 
           Object.values(errors).every(error => !error);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate required fields on blur
    if (!formData[name]) {
      setErrors(prev => ({ ...prev, [name]: `Field ini wajib diisi` }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // Validate form
    const isValid = validateForm();
    
    if (!isValid) {
      return;
    }

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
      onSucces();
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      if (error.response?.data?.message) {
        // Handle API error messages
        setErrors(prev => ({ ...prev, form: error.response.data.message }));
      } else {
        setErrors(prev => ({ ...prev, form: "Terjadi kesalahan saat menyimpan data" }));
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/40 flex justify-center items-center z-[999] ${
        showModal ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white rounded-lg shadow-xl p-5 w-96 md:w-112 mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold">
            {editingData ? "Edit Lowongan" : "Tambah Lowongan"}
          </h2>
          <button onClick={handleClose} className="text-gray-500 text-xl">
            ⨯
          </button>
        </div>

        {errors.form && (
          <div className="bg-red-50 text-red-600 p-2 rounded-md mb-3 text-xs">
            {errors.form}
          </div>
        )}

        <form className="mt-1" onSubmit={handleSubmit}>
          {/* Tanggal */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal_mulai"
                className={`w-full border ${
                  errors.tanggal_mulai && touched.tanggal_mulai ? "border-red-500" : "border-gray-300"
                } rounded-md py-2 px-3 text-xs`}
                onChange={handleValue}
                onBlur={handleBlur}
                value={formData.tanggal_mulai}
              />
              {errors.tanggal_mulai && touched.tanggal_mulai && (
                <p className="text-red-500 text-xs mt-1">{errors.tanggal_mulai}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tanggal Selesai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal_selesai"
                className={`w-full border ${
                  errors.tanggal_selesai && touched.tanggal_selesai ? "border-red-500" : "border-gray-300"
                } rounded-md py-2 px-3 text-xs`}
                onChange={handleValue}
                onBlur={handleBlur}
                value={formData.tanggal_selesai}
              />
              {errors.tanggal_selesai && touched.tanggal_selesai && (
                <p className="text-red-500 text-xs mt-1">{errors.tanggal_selesai}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Cabang <span className="text-red-500">*</span>
              </label>
              <select
                name="id_cabang"
                className={`w-full border ${
                  errors.id_cabang && touched.id_cabang ? "border-red-500" : "border-gray-300"
                } rounded-md py-2 px-3 text-xs bg-white`}
                onChange={handleValue}
                onBlur={handleBlur}
                value={formData.id_cabang}
              >
                <option value="">Pilih Cabang</option>
                {cabang.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                ))}
              </select>
              {errors.id_cabang && touched.id_cabang && (
                <p className="text-red-500 text-xs mt-1">{errors.id_cabang}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Divisi <span className="text-red-500">*</span>
              </label>
              <select
                name="id_divisi"
                className={`w-full border ${
                  errors.id_divisi && touched.id_divisi ? "border-red-500" : "border-gray-300"
                } rounded-md py-2 px-3 text-xs bg-white`}
                onChange={handleValue}
                onBlur={handleBlur}
                value={formData.id_divisi}
              >
                <option value="">Pilih Divisi</option>
                {divisi.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                ))}
              </select>
              {errors.id_divisi && touched.id_divisi && (
                <p className="text-red-500 text-xs mt-1">{errors.id_divisi}</p>
              )}
            </div>
          </div>

          {/* Kuota & Durasi */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Jumlah Kuota <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="max_kuota"
                value={formData.max_kuota}
                className={`w-full border ${
                  errors.max_kuota && touched.max_kuota ? "border-red-500" : "border-gray-300"
                } rounded-md py-2 px-3 text-xs`}
                onChange={handleValue}
                onBlur={handleBlur}
                placeholder="Masukkan Jumlah Kuota"
                min="1"
              />
              {errors.max_kuota && touched.max_kuota && (
                <p className="text-red-500 text-xs mt-1">{errors.max_kuota}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Durasi Magang <span className="text-red-500">*</span>
              </label>
              <select
                name="durasi"
                className={`w-full border ${
                  errors.durasi && touched.durasi ? "border-red-500" : "border-gray-300"
                } rounded-md py-2 px-3 text-xs bg-white`}
                onChange={handleValue}
                onBlur={handleBlur}
                value={formData.durasi}
              >
                <option value="">Pilih Durasi</option>
                {duration.map((item) => (
                  <option key={item} value={item}>
                    {item} Bulan
                  </option>
                ))}
              </select>
              {errors.durasi && touched.durasi && (
                <p className="text-red-500 text-xs mt-1">{errors.durasi}</p>
              )}
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Requirements Lowongan <span className="text-red-500">*</span>
            </label>
            <textarea
              className={`w-full border rounded-md py-2 px-3 text-xs ${
                errors.requirement && touched.requirement 
                  ? "border-red-500" 
                  : requirementCount < maxWords 
                    ? "border-gray-300" 
                    : "border-gray-300"
              }`}
              name="requirement"
              value={formData.requirement}
              onChange={handleValue}
              onBlur={handleBlur}
              placeholder="Masukkan persyaratan"
              rows="3"
            />
            <div className="flex justify-between mt-1 text-xs">
              <span className={requirementCount < maxWords ? "text-gray-600" : "text-gray-400"}>
                Minimal Kata: {maxWords}
              </span>
              <span className={requirementCount < maxWords ? "text-gray-600" : "text-gray-400"}>
                {requirementCount}/{maxWords}
              </span>
            </div>
            {errors.requirement && touched.requirement && (
              <p className="text-red-500 text-xs mt-1">{errors.requirement}</p>
            )}
          </div>

          {/* Deskripsi Pekerjaan */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Deskripsi Pekerjaan <span className="text-red-500">*</span>
            </label>
            <textarea
              className={`w-full border rounded-md py-2 px-3 text-xs ${
                errors.jobdesc && touched.jobdesc
                  ? "border-red-500" 
                  : jobdescCount < maxWords 
                    ? "border-gray-400" 
                    : "border-gray-300"
              }`}
              name="jobdesc"
              value={formData.jobdesc}
              onChange={handleValue}
              onBlur={handleBlur}
              placeholder="Masukkan deskripsi"
              rows="3"
            />
            <div className="flex justify-between mt-1 text-xs">
              <span className={jobdescCount < maxWords ? "text-gray-600" : "text-gray-400"}>
                Minimal Kata: {maxWords}
              </span>
              <span className={jobdescCount < maxWords ? "text-gray-600" : "text-gray-400"}>
                {jobdescCount}/{maxWords}
              </span>
            </div>
            {errors.jobdesc && touched.jobdesc && (
              <p className="text-red-500 text-xs mt-1">{errors.jobdesc}</p>
            )}
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