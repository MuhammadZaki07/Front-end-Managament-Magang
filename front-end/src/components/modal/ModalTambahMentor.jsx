import React, { useEffect, useState } from "react";
import axios from "axios";

const ModalTambahMentor = ({ isOpen, onClose, onSuccess, mode = "add", mentorData = null }) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    mentorPhoto: null,
    headerPhoto: null,
    branch: "",
    division: "",
    phoneNumber: "",
    password: "",
    id_cabang: "1",
  });
  const [divisions, setDivisions] = useState([]);
  const [editingMentor, setEditingMentor] = useState(null);

  // Tambahkan state untuk menyimpan nama file
  const [fileNames, setFileNames] = useState({
    mentorPhoto: "No File Chosen",
    headerPhoto: "No File Chosen",
  });

  // State untuk error pesan
  const [fileErrors, setFileErrors] = useState({
    mentorPhoto: "",
    headerPhoto: "",
  });

  // Batas ukuran file maksimum (dalam bytes): 2MB = 2 * 1024 * 1024 bytes
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

  useEffect(() => {
    if (isOpen) {
      const fetchDivisions = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/divisi`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setDivisions(response.data.data || []);
        } catch (error) {
          console.error("Error fetching divisions:", error);
        }
      };

      fetchDivisions();

      if (mode === "edit" && mentorData) {
        setFormData({
          email: mentorData.user.email || "",
          name: mentorData.user.nama || "",
          mentorPhoto: null,
          headerPhoto: null,
          branch: mentorData.branch || "",
          division: mentorData.divisi?.id || "",
          phoneNumber: mentorData.user.telepon || "",
          password: "",
        });

        // Set nama file jika ada data dari mentor yang diedit
        const mentorPhotoName = mentorData.foto && mentorData.foto[0]?.path ? getFileNameFromPath(mentorData.foto[0].path) : "No File Chosen";

        const headerPhotoName = mentorData.divisi.foto && mentorData.divisi.foto[0]?.path ? getFileNameFromPath(mentorData.divisi.foto[0].path) : "No File Chosen";

        setFileNames({
          mentorPhoto: mentorPhotoName,
          headerPhoto: headerPhotoName,
        });

        // Reset error messages
        setFileErrors({
          mentorPhoto: "",
          headerPhoto: "",
        });

        setEditingMentor(mentorData);
      } else {
        setFormData({
          email: "",
          name: "",
          mentorPhoto: null,
          headerPhoto: null,
          branch: "",
          division: "",
          phoneNumber: "",
          password: "",
        });
        setFileNames({
          mentorPhoto: "No File Chosen",
          headerPhoto: "No File Chosen",
        });
        setFileErrors({
          mentorPhoto: "",
          headerPhoto: "",
        });
        setEditingMentor(null);
      }
    }
  }, [isOpen, mode, mentorData]);

  // Fungsi untuk mengambil nama file dari path
  const getFileNameFromPath = (path) => {
    if (!path) return "No File Chosen";
    // Ambil nama file dari path
    const parts = path.split("/");
    return parts[parts.length - 1];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error message for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateFileSize = (file, fieldName) => {
    // Cek apakah file ada
    if (!file) return true;

    // Cek ukuran file
    if (file.size > MAX_FILE_SIZE) {
      setFileErrors((prev) => ({
        ...prev,
        [fieldName]: `Ukuran file terlalu besar. Maksimal 2MB.`,
      }));
      return false;
    }

    // Validasi tipe file (hanya gambar)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setFileErrors((prev) => ({
        ...prev,
        [fieldName]: `Format file tidak didukung. Gunakan format JPG, PNG, atau GIF.`,
      }));
      return false;
    }
    
    // Validate file dimensions if possible (using a Promise)
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function() {
        const width = this.width;
        const height = this.height;
        
        // Validate minimum dimensions (e.g., at least 100x100 pixels)
        if (width < 100 || height < 100) {
          setFileErrors((prev) => ({
            ...prev,
            [fieldName]: `Ukuran gambar terlalu kecil. Minimal 100x100 piksel.`,
          }));
          resolve(false);
          return;
        }
        
        // Reset error jika valid
        setFileErrors((prev) => ({
          ...prev,
          [fieldName]: "",
        }));
        resolve(true);
      };
      
      img.onerror = function() {
        setFileErrors((prev) => ({
          ...prev,
          [fieldName]: `Gambar tidak dapat diproses. Silakan coba gambar lain.`,
        }));
        resolve(false);
      };
      
      // Create object URL for the file
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    
    // Reset error message whenever attempting a new upload
    setFileErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    
    if (files && files.length > 0) {
      const file = files[0];
      
      // Format file size for display
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      try {
        // Validasi ukuran file dan format (now returns a Promise)
        const isValid = await validateFileSize(file, name);
        
        if (!isValid) {
          // Reset input jika validasi gagal
          e.target.value = "";
          setFileNames((prev) => ({
            ...prev,
            [name]: "No File Chosen",
          }));
          return;
        }

        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));

        // Perbarui nama file yang ditampilkan dengan ukuran file
        setFileNames((prev) => ({
          ...prev,
          [name]: `${file.name} (${fileSizeMB} MB)`,
        }));
      } catch (error) {
        console.error("Error validating file:", error);
        e.target.value = "";
        setFileNames((prev) => ({
          ...prev,
          [name]: "No File Chosen",
        }));
        setFileErrors((prev) => ({
          ...prev,
          [name]: "Terjadi kesalahan saat memvalidasi file",
        }));
      }
    }
  };

  // State untuk form validation
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    division: ""
  });

  // Validate all fields
  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      division: ""
    };
    let isValid = true;

    // Validate name (minimal 3 karakter)
    if (!formData.name) {
      errors.name = "Nama wajib diisi";
      isValid = false;
    } else if (formData.name.length < 3) {
      errors.name = "Nama minimal 3 karakter";
      isValid = false;
    } else if (formData.name.length > 50) {
      errors.name = "Nama maksimal 50 karakter";
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email wajib diisi";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Format email tidak valid";
      isValid = false;
    }

    // Validate phone number (tepat 13 digit)
    const phoneRegex = /^\d{12}$/;
    if (!formData.phoneNumber) {
      errors.phoneNumber = "Nomor telepon wajib diisi";
      isValid = false;
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Nomor telepon harus terdiri dari 12 digit";
      isValid = false;
    }

    // Validate password (if required)
    if (mode === "add" || formData.password) {
      if (mode === "add" && !formData.password) {
        errors.password = "Password wajib diisi";
        isValid = false;
      } else if (formData.password && formData.password.length < 6) {
        errors.password = "Password minimal 6 karakter";
        isValid = false;
      }
    }

    // Validate division
    if (!formData.division) {
      errors.division = "Divisi wajib dipilih";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!validateForm()) {
      return;
    }

    // Validasi ukuran file sekali lagi sebelum submit
    try {
      let hasFileError = false;
      
      if (formData.mentorPhoto) {
        const mentorPhotoValid = await validateFileSize(formData.mentorPhoto, "mentorPhoto");
        if (!mentorPhotoValid) hasFileError = true;
      }
      
      if (formData.headerPhoto) {
        const headerPhotoValid = await validateFileSize(formData.headerPhoto, "headerPhoto");
        if (!headerPhotoValid) hasFileError = true;
      }
      
      if (hasFileError) {
        alert("Ada masalah dengan ukuran atau format file. Mohon periksa kembali.");
        return;
      }
    } catch (error) {
      console.error("Error validating files:", error);
      alert("Terjadi kesalahan saat memvalidasi file. Mohon periksa kembali.");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("nama", formData.name);
    formPayload.append("email", formData.email);
    formPayload.append("telepon", formData.phoneNumber);
    formPayload.append("id_divisi", formData.division);
    formPayload.append("id_cabang", "2");

    if (mode === "add" && formData.password) {
      formPayload.append("password", formData.password);
    }

    if (formData.mentorPhoto) {
      formPayload.append("profile", formData.mentorPhoto);
    }

    if (formData.headerPhoto) {
      formPayload.append("cover", formData.headerPhoto);
    }

    try {
      if (editingMentor) {
        formPayload.append("_method", "PUT");

        await axios.post(`${import.meta.env.VITE_API_URL}/mentor/${editingMentor.id}`, formPayload, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        onSuccess();
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/mentor`, formPayload, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      onClose();
      onSuccess();
      setEditingMentor(null);
    } catch (error) {
      console.error("Error submitting mentor data:", error);
      // Tampilkan pesan error dari server jika ada
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Gagal menyimpan data mentor. Silakan coba lagi.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h3 className="font-bold text-lg text-blue-800">{mode === "edit" ? "Edit Mentor" : "Tambah Mentor"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nama <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className={`w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Masukkan Nama (3-50 karakter)" 
                  maxLength={50}
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className={`w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="contoh@email.com" 
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Nomor Telepon <span className="text-red-500">*</span></label>
              <input 
                type="tel" 
                name="phoneNumber" 
                value={formData.phoneNumber} 
                onChange={handleChange} 
                className={`w-full px-3 py-2 border ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="13 digit nomor telepon" 
                maxLength={13}
              />
              {formErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>}
              <p className="text-gray-500 text-xs mt-1">Contoh: 0812345678901 (tepat 13 digit)</p>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Password {mode === "add" ? <span className="text-red-500">*</span> : "(Kosongkan jika tidak ingin mengubah)"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Masukkan Password (min. 6 karakter)"
                minLength={mode === "add" ? 6 : undefined}
              />
              {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
            </div>

            <FileUpload 
              label="Foto Mentor" 
              name="mentorPhoto" 
              fileName={fileNames.mentorPhoto} 
              onChange={handleFileChange} 
              errorMessage={fileErrors.mentorPhoto} 
            />

            <FileUpload 
              label="Foto Header" 
              name="headerPhoto" 
              fileName={fileNames.headerPhoto} 
              onChange={handleFileChange} 
              errorMessage={fileErrors.headerPhoto} 
            />

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Divisi <span className="text-red-500">*</span></label>
              <select 
                name="division" 
                value={formData.division} 
                onChange={handleChange} 
                className={`w-full px-3 py-2 border ${formErrors.division ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="" disabled>
                  Pilih Divisi
                </option>
                {divisions.length > 0 ? (
                  divisions.map((division) => (
                    <option key={division.id} value={division.id}>
                      {division.nama}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Tidak ada divisi
                  </option>
                )}
              </select>
              {formErrors.division && <p className="text-red-500 text-xs mt-1">{formErrors.division}</p>}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Komponen FileUpload yang sudah diperbaiki
const FileUpload = ({ label, name, fileName, onChange, errorMessage }) => (
  <div className="mb-4">
    <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
    <div className="flex items-center">
      <label className="flex-shrink-0 cursor-pointer px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
        Choose File
        <input type="file" name={name} onChange={onChange} className="hidden" accept="image/jpeg,image/png,image/gif,image/jpg" />
      </label>
      <span className="flex-grow px-3 py-3 border border-gray-300 border-l-0 rounded-r-md bg-white overflow-hidden w-full text-xs truncate">{fileName || "No File Chosen"}</span>
    </div>
    {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
    <p className="text-gray-500 text-xs mt-1">Ukuran maksimal: 2MB. Format yang didukung: JPG, PNG, GIF</p>
  </div>
);

export default ModalTambahMentor;