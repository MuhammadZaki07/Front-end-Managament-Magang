import React, { useState, useEffect } from "react";
import axios from "axios";

const ModalTambahAdminCabang = ({ isOpen, onClose, branchToEdit, onSucces }) => {
  const isEditMode = Boolean(branchToEdit);
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

  const [formData, setFormData] = useState({
    nama: "",
    password: "",
    branch: "",
    adminPhoto: null,
    headerPhoto: null,
    email: "",
    phoneNumber: "",
    id_cabang: 2,
  });

  const [adminPhotoName, setAdminPhotoName] = useState("No File Chosen");
  const [headerPhotoName, setHeaderPhotoName] = useState("No File Chosen");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isEditMode && branchToEdit) {
      setFormData({
        nama: branchToEdit.user?.nama || "",
        email: branchToEdit.user?.email || "",
        phoneNumber: branchToEdit.user?.telepon || "",
        password: "",
        adminPhoto: null,
        headerPhoto: null,
        id_cabang: branchToEdit.id_cabang || 2,
      });
    } else {
      setFormData({
        nama: "",
        password: "",
        branch: "",
        adminPhoto: null,
        headerPhoto: null,
        email: "",
        phoneNumber: "",
        id_cabang: 2,
      });
      setAdminPhotoName("No File Chosen");
      setHeaderPhotoName("No File Chosen");
    }
    // Reset errors and touched states when modal opens/closes or editing mode changes
    setErrors({});
    setTouched({});
  }, [branchToEdit, isEditMode, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Clear error for this field when user makes changes
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setErrors((prev) => ({ 
          ...prev, 
          [fieldName]: "Ukuran file tidak boleh lebih dari 2MB" 
        }));
        return;
      }
      
      // Validate file type (optional)
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ 
          ...prev, 
          [fieldName]: "Hanya file gambar yang diperbolehkan" 
        }));
        return;
      }
      
      // Clear error if file is valid
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
      
      // Update form data with file
      setFormData((prev) => ({ ...prev, [fieldName]: file }));
      
      // Update file name display
      if (fieldName === "adminPhoto") {
        setAdminPhotoName(file.name);
      } else if (fieldName === "headerPhoto") {
        setHeaderPhotoName(file.name);
      }
    }
    
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields
    if (!formData.nama.trim()) {
      newErrors.nama = "Nama wajib diisi";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    
    if (!isEditMode && !formData.password) {
      newErrors.password = "Password wajib diisi";
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Nomor HP wajib diisi";
    } else if (!/^\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Nomor HP hanya boleh berisi angka";
    }
    
    // Keep any existing file errors
    if (errors.adminPhoto) newErrors.adminPhoto = errors.adminPhoto;
    if (errors.headerPhoto) newErrors.headerPhoto = errors.headerPhoto;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Basic validation on blur
    if (name === "nama" && !formData.nama.trim()) {
      setErrors((prev) => ({ ...prev, nama: "Nama wajib diisi" }));
    } else if (name === "email") {
      if (!formData.email.trim()) {
        setErrors((prev) => ({ ...prev, email: "Email wajib diisi" }));
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setErrors((prev) => ({ ...prev, email: "Format email tidak valid" }));
      }
    } else if (name === "password" && !isEditMode && !formData.password) {
      setErrors((prev) => ({ ...prev, password: "Password wajib diisi" }));
    } else if (name === "phoneNumber") {
      if (!formData.phoneNumber) {
        setErrors((prev) => ({ ...prev, phoneNumber: "Nomor HP wajib diisi" }));
      } else if (!/^\d+$/.test(formData.phoneNumber)) {
        setErrors((prev) => ({ ...prev, phoneNumber: "Nomor HP hanya boleh berisi angka" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = ["nama", "email", "password", "phoneNumber", "adminPhoto", "headerPhoto"];
    const allTouched = {};
    allFields.forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
  
    const formPayload = new FormData();
    formPayload.append("nama", formData.nama);
    formPayload.append("email", formData.email);
    formPayload.append("telepon", formData.phoneNumber);
    // formPayload.append("id_cabang", "2");
  
    if (formData.password) {
      formPayload.append("password", formData.password);
    }
  
    if (formData.adminPhoto) {
      formPayload.append("profile", formData.adminPhoto);
    }
  
    if (formData.headerPhoto) {
      formPayload.append("cover", formData.headerPhoto);
    }
  
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    };

    try {
      const url = isEditMode
        ? `/api/admin/${branchToEdit.id}?_method=PUT`
        : "/api/admin";
  
      const response = await axios.post(url, formPayload, { headers });
  
      if (response.status === 200 || response.status === 201) {
        onClose();
        onSucces();
      } else {
        setErrors((prev) => ({ ...prev, form: "Gagal menyimpan data admin." }));
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat menyimpan admin:", error);
      let errorMessage = "Terjadi kesalahan saat menyimpan data";
      
      // Handle specific API error messages if available
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setErrors((prev) => ({ ...prev, form: errorMessage }));
    }
  };  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto relative z-10">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {isEditMode ? "Edit Admin" : "Tambah Admin"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {errors.form && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-4" encType="multipart/form-data">
          <div className="grid grid-cols-2 gap-5">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">
                Masukkan Nama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Masukkan Nama Disini"
                className={`w-full px-3 py-2 border ${
                  errors.nama && touched.nama ? "border-red-500" : "border-gray-300"
                } rounded-md`}
              />
              {errors.nama && touched.nama && (
                <p className="text-red-500 text-xs mt-1">{errors.nama}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">
                Masukkan Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Masukkan Email"
                className={`w-full px-3 py-2 border ${
                  errors.email && touched.email ? "border-red-500" : "border-gray-300"
                } rounded-md`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">
                Foto Admin <span className="text-gray-500 text-xs">(Maks. 2MB)</span>
              </label>
              <div className="flex">
                <label className={`flex items-center justify-center px-4 py-2 bg-white border ${
                  errors.adminPhoto ? "border-red-500" : "border-gray-300"
                } rounded-l-md text-xs text-gray-700 cursor-pointer`}>
                  <span>Choose File</span>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "adminPhoto")}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                <div className={`flex-1 px-4 py-2 border border-l-0 ${
                  errors.adminPhoto ? "border-red-500" : "border-gray-300"
                } rounded-r-md bg-gray-50 text-gray-500 text-xs overflow-hidden`}>
                  {adminPhotoName}
                </div>
              </div>
              {errors.adminPhoto && (
                <p className="text-red-500 text-xs mt-1">{errors.adminPhoto}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">
                Foto Header <span className="text-gray-500 text-xs">(Maks. 2MB)</span>
              </label>
              <div className="flex">
                <label className={`flex items-center justify-center px-4 py-2 bg-white border ${
                  errors.headerPhoto ? "border-red-500" : "border-gray-300"
                } rounded-l-md text-xs text-gray-700 cursor-pointer`}>
                  <span>Choose File</span>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "headerPhoto")}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                <div className={`flex-1 px-4 py-2 border border-l-0 ${
                  errors.headerPhoto ? "border-red-500" : "border-gray-300"
                } rounded-r-md bg-gray-50 text-gray-500 text-xs overflow-hidden`}>
                  {headerPhotoName}
                </div>
              </div>
              {errors.headerPhoto && (
                <p className="text-red-500 text-xs mt-1">{errors.headerPhoto}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">
                Password {!isEditMode && <span className="text-red-500">*</span>}
                {isEditMode && <span className="text-gray-500 text-xs">(Kosongkan jika tidak diubah)</span>}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Masukkan Password Disini"
                className={`w-full px-3 py-2 border ${
                  errors.password && touched.password ? "border-red-500" : "border-gray-300"
                } rounded-md`}
              />
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">
                Masukkan Nomor HP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Masukkan Nomor HP"
                className={`w-full px-3 py-2 border ${
                  errors.phoneNumber && touched.phoneNumber ? "border-red-500" : "border-gray-300"
                } rounded-md`}
              />
              {errors.phoneNumber && touched.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="sticky bottom-0 bg-white py-3 flex justify-end space-x-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-red-400 text-white rounded-md hover:bg-red-500"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTambahAdminCabang;