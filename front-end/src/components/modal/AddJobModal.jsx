import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2

const AddJobModal = ({ showModal, setShowModal, editingData = null, onSucces }) => {
  const [cabang, setCabang] = useState([]);
  const [divisi, setDivisi] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingDivisi, setLoadingDivisi] = useState(false); // Loading state untuk divisi
  const [checkingDuplicate, setCheckingDuplicate] = useState(false); // Loading state untuk pengecekan duplikasi

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

      // Load divisi untuk cabang yang sedang diedit
      if (id_cabang) {
        GetDivisiByBranch(id_cabang);
      }
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
      setDivisi([]); // Reset divisi saat form direset
    }

    setErrors({});
    setTouched({});
  }, [editingData]);

  const handleClose = () => {
    // Use SweetAlert2 for confirmation if form has been modified
    const isFormModified = Object.values(formData).some(val => val !== "");
    
    if (isFormModified) {
      Swal.fire({
        title: 'Konfirmasi',
        text: 'Perubahan yang Anda buat belum disimpan. Yakin ingin menutup?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, tutup',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          setShowModal(false);
        }
      });
    } else {
      setShowModal(false);
    }
  };

  const GetCabang = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cabang`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCabang(res.data.data);
    } catch (error) {
      console.error(error);
      // Show error alert for API failure
      Swal.fire({
        icon: 'error',
        title: 'Gagal memuat data',
        text: 'Tidak dapat memuat data cabang. Silakan coba lagi nanti.',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  // Fungsi baru untuk mengambil divisi berdasarkan cabang
  const GetDivisiByBranch = async (cabangId) => {
    if (!cabangId) {
      setDivisi([]);
      return;
    }

    setLoadingDivisi(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/divisi/cabang/${cabangId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDivisi(res.data.data);
    } catch (error) {
      console.error(error);
      setDivisi([]);
      // Show error alert for API failure
      Swal.fire({
        icon: 'error',
        title: 'Gagal memuat data',
        text: 'Tidak dapat memuat data divisi. Silakan coba lagi nanti.',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoadingDivisi(false);
    }
  };

  // Fungsi untuk mengecek apakah ada lowongan yang sedang berlangsung untuk cabang dan divisi yang sama
  const checkActiveLowongan = async (cabangId, divisiId) => {
    if (!cabangId || !divisiId) {
      setErrors(prev => ({ ...prev, id_divisi: "" }));
      return true; // Skip validation jika salah satu kosong
    }

    setCheckingDuplicate(true);
    try {
      console.log('Checking duplicate for cabang:', cabangId, 'divisi:', divisiId);
      
      // Ambil semua data lowongan
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/lowongan`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      const lowonganList = res.data.data || res.data; // Sesuaikan dengan struktur response API
      console.log('Lowongan list:', lowonganList);
      
      // Cek apakah ada lowongan yang masih berlangsung (status = 1) untuk cabang dan divisi yang sama
      const activeLowongan = lowonganList.find(lowongan => {
        console.log('Checking lowongan:', lowongan);
        
        // Skip jika sedang edit dan ini adalah record yang sama
        if (editingData && lowongan.id === editingData.id) {
          console.log('Skipping same record during edit');
          return false;
        }
        
        // Ambil ID cabang dan divisi dari nested object atau property langsung
        let lowonganCabangId, lowonganDivisiId;
        
        if (lowongan.cabang && lowongan.cabang.id) {
          lowonganCabangId = lowongan.cabang.id.toString();
        } else if (lowongan.id_cabang) {
          lowonganCabangId = lowongan.id_cabang.toString();
        }
        
        if (lowongan.divisi && lowongan.divisi.id) {
          lowonganDivisiId = lowongan.divisi.id.toString();
        } else if (lowongan.id_divisi) {
          lowonganDivisiId = lowongan.id_divisi.toString();
        }
        
        const inputCabangId = cabangId.toString();
        const inputDivisiId = divisiId.toString();
        
        console.log('Comparing:', {
          lowonganCabangId,
          lowonganDivisiId,
          inputCabangId,
          inputDivisiId,
          status: lowongan.status,
          cabangObject: lowongan.cabang,
          divisiObject: lowongan.divisi
        });
        
        // Cek apakah cabang dan divisi sama
        const isSameBranchDivision = 
          lowonganCabangId === inputCabangId && 
          lowonganDivisiId === inputDivisiId;
        
        if (!isSameBranchDivision) {
          console.log('Different branch/division, skipping');
          return false;
        }
        
        // Cek apakah lowongan masih berlangsung (status = 1)
        // status 1 = berlangsung, status 0 = selesai/tutup
        const isActive = lowongan.status === 1 || lowongan.status === "1";
        
        console.log('Same branch/division found with status:', lowongan.status, 'isActive:', isActive);
        
        return isActive;
      });
      
      console.log('Active lowongan found:', activeLowongan);
      
      if (activeLowongan) {
        const errorMessage = "Sudah ada lowongan yang sedang berlangsung untuk cabang dan divisi ini. Lowongan baru hanya bisa dibuat jika status lowongan sebelumnya sudah selesai.";
        setErrors(prev => ({ 
          ...prev, 
          id_divisi: errorMessage
        }));
        return false;
      } else {
        setErrors(prev => ({ ...prev, id_divisi: "" }));
        return true;
      }
    } catch (error) {
      console.error('Error checking active lowongan:', error);
      // Jika gagal mengambil data, tampilkan error dan tidak allow submit
      const errorMessage = "Gagal memvalidasi data lowongan. Silakan coba lagi.";
      setErrors(prev => ({ ...prev, id_divisi: errorMessage }));
      return false;
    } finally {
      setCheckingDuplicate(false);
    }
  };

  useEffect(() => {
    GetCabang();
  }, []);

  const handleValue = (e) => {
    const { name, value } = e.target;
    
    // Jika yang berubah adalah cabang, reset divisi dan load divisi baru
    if (name === "id_cabang") {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        id_divisi: "" // Reset divisi saat cabang berubah
      }));
      
      // Load divisi berdasarkan cabang yang dipilih
      GetDivisiByBranch(value);
      
      // Clear error divisi karena divisi direset
      setErrors(prev => ({ ...prev, id_divisi: "" }));
    } else if (name === "id_divisi") {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Check untuk duplikasi lowongan aktif setelah state di-update
      if (value && formData.id_cabang) {
        // Gunakan setTimeout untuk memastikan state sudah terupdate
        setTimeout(() => {
          checkActiveLowongan(formData.id_cabang, value);
        }, 100);
      } else {
        setErrors(prev => ({ ...prev, id_divisi: "" }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    setTouched(prev => ({ ...prev, [name]: true }));

    if (name === "max_kuota" && (isNaN(value) || parseInt(value) <= 0)) {
      setErrors(prev => ({ ...prev, [name]: "Kuota harus berupa angka positif" }));
    } else if (name !== "id_divisi") { // Skip clear error untuk id_divisi karena akan dihandle di checkActiveLowongan
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

    // Merge dengan existing errors (termasuk error duplikasi)
    const allErrors = { ...errors, ...newErrors };
    setErrors(allErrors);
    
    // Return false jika ada error apapun
    return Object.values(allErrors).every(err => !err);
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

    // Validasi form terlebih dahulu
    if (!validateForm()) {
      // Show validation error alert
      Swal.fire({
        icon: 'error',
        title: 'Validasi Gagal',
        text: 'Silakan periksa kembali form isian Anda',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Lakukan pengecekan final untuk duplikasi sebelum submit
    console.log('Final duplicate check before submit');
    const isDuplicateValid = await checkActiveLowongan(formData.id_cabang, formData.id_divisi);
    
    if (!isDuplicateValid) {
      console.log('Duplicate validation failed, stopping submit');
      Swal.fire({
        icon: 'error',
        title: 'Validasi Gagal',
        text: 'Sudah ada lowongan yang sedang berlangsung untuk cabang dan divisi yang dipilih. Lowongan baru hanya bisa dibuat jika status lowongan sebelumnya sudah selesai.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Show loading state
    setLoading(true);
    
    // Show loading indicator with SweetAlert2
    Swal.fire({
      title: 'Menyimpan Data',
      text: 'Mohon tunggu...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const url = editingData
        ? `${import.meta.env.VITE_API_URL}/lowongan/${editingData.id}`
        : `${import.meta.env.VITE_API_URL}/lowongan`;

      const method = editingData ? "put" : "post";

      const payload = {
        ...formData,
        max_kuota: parseInt(formData.max_kuota),
      };

      console.log('Submitting payload:', payload);

      await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: payload,
      });

      // Close loading indicator
      Swal.close();
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: editingData 
          ? 'Data lowongan berhasil diperbarui' 
          : 'Lowongan baru berhasil ditambahkan',
        confirmButtonColor: '#3085d6'
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
      console.error('Submit error:', err);
      
      // Close loading indicator
      Swal.close();
      
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.response?.data?.message || "Terjadi kesalahan saat menyimpan data",
        confirmButtonColor: '#3085d6'
      });
      
      setErrors(prev => ({
        ...prev,
        form: err.response?.data?.message || "Terjadi kesalahan saat menyimpan data",
      }));
    } finally {
      setLoading(false);
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
                disabled={!formData.id_cabang || loadingDivisi || checkingDuplicate}
                className={`w-full border ${errors.id_divisi && touched.id_divisi ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs bg-white ${(!formData.id_cabang || loadingDivisi || checkingDuplicate) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">
                  {checkingDuplicate ? "Memvalidasi..." :
                   loadingDivisi ? "Memuat divisi..." : 
                   !formData.id_cabang ? "Pilih cabang" : 
                   "Pilih Divisi"}
                </option>
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
            <button 
              type="button" 
              onClick={handleClose} 
              className="bg-red-500 text-white px-5 py-3 rounded-md text-xs"
              disabled={loading || checkingDuplicate}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-5 py-3 rounded-md text-xs"
              disabled={loading || checkingDuplicate || Object.values(errors).some(err => err)}
            >
              {loading ? 'Menyimpan...' : checkingDuplicate ? 'Memvalidasi...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;