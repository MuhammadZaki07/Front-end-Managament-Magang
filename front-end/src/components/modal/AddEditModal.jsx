import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import axios from "axios";

export default function AddEditModal({
  show,
  onClose,
  editingPartner,
  formData,
  setFormData,
  onSave,
  categories,
}) {
  const [loading, setLoading] = useState(false);
  const [newJurusan, setNewJurusan] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  // Validate form on every change, but only set errors if showErrors is true
  useEffect(() => {
    const newErrors = validateForm();
    setIsFormValid(Object.keys(newErrors).length === 0);
    
    // Only update visible errors if showErrors is true
    if (showErrors) {
      setErrors(newErrors);
    }
  }, [formData, showErrors]);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate nama
    if (!formData.nama || formData.nama.trim() === "") {
      newErrors.nama = "Nama mitra tidak boleh kosong";
    } else if (formData.nama.length < 3) {
      newErrors.nama = "Nama mitra minimal 3 karakter";
    }
    
    // Validate alamat
    if (!formData.alamat || formData.alamat.trim() === "") {
      newErrors.alamat = "Alamat tidak boleh kosong";
    }
    
    // Validate telepon
    if (!formData.telepon || formData.telepon.trim() === "") {
      newErrors.telepon = "Nomor telepon tidak boleh kosong";
    } else if (!/^[0-9+\-\s]{5,15}$/.test(formData.telepon)) {
      newErrors.telepon = "Nomor telepon tidak valid (5-15 digit)";
    }
    
    // Validate jenis_institusi
    if (!formData.jenis_institusi || formData.jenis_institusi.trim() === "") {
      newErrors.jenis_institusi = "Jenis institusi harus dipilih";
    }
    
    // Validate jurusan
    if (!formData.jurusan || formData.jurusan.length === 0) {
      newErrors.jurusan = "Minimal satu jurusan harus ditambahkan";
    }
    
    return newErrors;
  };

  const handleFormChange = (e) => {
    const { name, value, files, type } = e.target;

    if (name === "foto_header" || name === "logo") {
      const file = files[0];
      if (file) {
        if (file.type.startsWith("image/")) {
          if (file.size > 5 * 1024 * 1024) { // 5MB limit
            if (showErrors) {
              setErrors(prev => ({...prev, [name]: "Ukuran file maksimal 5MB"}));
            }
            return;
          }
          setFormData((f) => ({ ...f, [name]: file }));
          if (showErrors) {
            setErrors(prev => {
              const newErrors = {...prev};
              delete newErrors[name];
              return newErrors;
            });
          }
        } else {
          if (showErrors) {
            setErrors(prev => ({...prev, [name]: "File harus berupa gambar (jpg, jpeg, png, dll)"}));
          }
        }
      }
    } else if (name === "jurusan" && type === "select-one") {
      const selectedMajor = value;
      if (selectedMajor && !formData.jurusan.includes(selectedMajor)) {
        setFormData((f) => ({
          ...f,
          jurusan: [...f.jurusan, selectedMajor],
        }));
        if (showErrors) {
          setErrors(prev => {
            const newErrors = {...prev};
            delete newErrors.jurusan;
            return newErrors;
          });
        }
      }
    } else {
      setFormData((f) => ({ ...f, [name]: value }));
      // Clear error for this field if it exists and showErrors is true
      if (showErrors && errors[name]) {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const removeJurusan = (jurusanToRemove) => {
    const updatedJurusan = formData.jurusan.filter(jurusan => jurusan !== jurusanToRemove);
    setFormData((prev) => ({
      ...prev,
      jurusan: updatedJurusan
    }));
    
    // Check if jurusan is now empty and show error if showErrors is true
    if (showErrors && updatedJurusan.length === 0) {
      setErrors(prev => ({...prev, jurusan: "Minimal satu jurusan harus ditambahkan"}));
    }
  };

  const savePartner = async (e) => {
    e.preventDefault();
    
    // Show errors and validate before saving
    setShowErrors(true);
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      // Scroll to first error
      setTimeout(() => {
        const firstErrorField = document.querySelector('.error-message');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }
    
    setLoading(true);

    const formPayload = new FormData();
    formPayload.append("nama", formData.nama);
    formPayload.append("alamat", formData.alamat);
    formPayload.append("telepon", formData.telepon);
    formPayload.append("jenis_institusi", formData.jenis_institusi);
    // formPayload.append("website", formData.website || "");

    if (formData.foto_header) {
      formPayload.append("foto_header", formData.foto_header);
    }

    if (formData.logo) {
      formPayload.append("logo", formData.logo);
    }

    formData.jurusan.forEach((j, idx) => {
      formPayload.append(`jurusan[${idx}]`, j);
    });

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    };

    try {
      const url = editingPartner
        ? `${import.meta.env.VITE_API_URL}/mitra/${
            editingPartner.id
          }?_method=PUT`
        : `${import.meta.env.VITE_API_URL}/mitra`;
      await axios.post(url, formPayload, { headers });

      onClose();
      onSave();
    } catch (err) {
      console.error(
        "Gagal menyimpan mitra:",
        err.response?.data || err.message
      );
      
      // Handle validation errors from server
      if (err.response?.data?.errors) {
        const serverErrors = err.response.data.errors;
        const formattedErrors = {};
        
        // Convert server errors to our format
        Object.keys(serverErrors).forEach(key => {
          formattedErrors[key] = Array.isArray(serverErrors[key]) 
            ? serverErrors[key][0] 
            : serverErrors[key];
        });
        
        setErrors(prev => ({...prev, ...formattedErrors}));
      } else {
        // General error
        alert("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-800">
            {editingPartner ? "Edit Mitra" : "Tambah Mitra"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-3 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nama Mitra <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleFormChange}
                placeholder="Masukkan nama mitra"
                className={`w-full py-2.5 px-3 border ${
                  showErrors && errors.nama ? "border-red-500" : "border-gray-300"
                } rounded-md text-xs`}
              />
              {showErrors && errors.nama && (
                <p className="text-red-500 text-xs mt-1 flex items-center error-message">
                  <AlertCircle size={12} className="mr-1" /> {errors.nama}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                No.Telp <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="telepon"
                value={formData.telepon}
                onChange={handleFormChange}
                placeholder="Masukkan No.Telp disini"
                className={`w-full py-2.5 px-3 border ${
                  showErrors && errors.telepon ? "border-red-500" : "border-gray-300"
                } rounded-md text-xs`}
              />
              {showErrors && errors.telepon && (
                <p className="text-red-500 text-xs mt-1 flex items-center error-message">
                  <AlertCircle size={12} className="mr-1" /> {errors.telepon}
                </p>
              )}
            </div>
            {/* <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Website institusi
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleFormChange}
                placeholder="Masukkan link disini"
                className="w-full py-2.5 px-3 border border-gray-300 rounded-md text-xs"
              />
            </div> */}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Alamat <span className="text-red-500">*</span>
            </label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleFormChange}
              placeholder="Masukkan alamat disini"
              className={`w-full py-2.5 px-3 border ${
                showErrors && errors.alamat ? "border-red-500" : "border-gray-300"
              } rounded-md text-xs`}
              rows={3}
            />
            {showErrors && errors.alamat && (
              <p className="text-red-500 text-xs mt-1 flex items-center error-message">
                <AlertCircle size={12} className="mr-1" /> {errors.alamat}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Jurusan <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
              {formData.jurusan.map((jurusan, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full flex items-center"
                >
                  {jurusan}
                  <button
                    type="button"
                    onClick={() => removeJurusan(jurusan)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Tambahkan jurusan baru, tekan Enter"
              className={`w-full py-2.5 px-3 border ${
                showErrors && errors.jurusan ? "border-red-500" : "border-gray-300"
              } rounded-md text-xs`}
              value={newJurusan}
              onChange={(e) => setNewJurusan(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && newJurusan.trim() !== "") {
                  e.preventDefault();
                  if (!formData.jurusan.includes(newJurusan.trim())) {
                    setFormData((prev) => ({
                      ...prev,
                      jurusan: [...prev.jurusan, newJurusan.trim()],
                    }));
                    // Clear any jurusan error if showErrors is true
                    if (showErrors && errors.jurusan) {
                      setErrors(prev => {
                        const newErrors = {...prev};
                        delete newErrors.jurusan;
                        return newErrors;
                      });
                    }
                  }
                  setNewJurusan("");
                }
              }}
            />
            {showErrors && errors.jurusan && (
              <p className="text-red-500 text-xs mt-1 flex items-center error-message">
                <AlertCircle size={12} className="mr-1" /> {errors.jurusan}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Foto Cover
              </label>
              <div className={`w-full py-2.5 px-3 border ${
                showErrors && errors.foto_header ? "border-red-500" : "border-gray-300"
              } rounded-md text-xs flex justify-between items-center`}>
                <span className="text-gray-500 truncate">
                  {formData.foto_header
                    ? formData.foto_header.name || "File selected"
                    : "No File Chosen"}
                </span>
                <label className="cursor-pointer bg-gray-200 px-2 py-1 rounded text-xs">
                  Choose File
                  <input
                    type="file"
                    name="foto_header"
                    accept="image/*"
                    onChange={handleFormChange}
                    className="hidden"
                  />
                </label>
              </div>
              {showErrors && errors.foto_header && (
                <p className="text-red-500 text-xs mt-1 flex items-center error-message">
                  <AlertCircle size={12} className="mr-1" /> {errors.foto_header}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Logo
              </label>
              <div className={`w-full py-2.5 px-3 border ${
                showErrors && errors.logo ? "border-red-500" : "border-gray-300"
              } rounded-md text-xs flex justify-between items-center`}>
                <span className="text-gray-500 truncate">
                  {formData.logo
                    ? formData.logo.name || "File selected"
                    : "No File Chosen"}
                </span>
                <label className="cursor-pointer bg-gray-200 px-2 py-1 rounded text-xs">
                  Choose File
                  <input
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleFormChange}
                    className="hidden"
                  />
                </label>
              </div>
              {showErrors && errors.logo && (
                <p className="text-red-500 text-xs mt-1 flex items-center error-message">
                  <AlertCircle size={12} className="mr-1" /> {errors.logo}
                </p>
              )}
            </div>
            <div className="ml-1 space-y-3">
              <label className="block text-xs font-medium text-gray-700 mb-3">
                Jenis Institusi <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((institution) => (
                  <label
                    key={institution}
                    className="flex items-center text-xs"
                  >
                    <input
                      type="radio"
                      id={institution}
                      name="jenis_institusi"
                      value={institution}
                      checked={formData.jenis_institusi === institution}
                      onChange={handleFormChange}
                      className="mr-1"
                    />
                    {institution}
                  </label>
                ))}
              </div>
              {showErrors && errors.jenis_institusi && (
                <p className="text-red-500 text-xs mt-1 flex items-center error-message">
                  <AlertCircle size={12} className="mr-1" /> {errors.jenis_institusi}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-blue-600 hover:bg-gray-50 transition"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={savePartner}
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition flex items-center ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}