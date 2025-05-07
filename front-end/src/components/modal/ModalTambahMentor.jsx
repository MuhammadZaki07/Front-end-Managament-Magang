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
  const MAX_FILE_SIZE = 2 * 1024 * 1024;

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

    // Reset error jika valid
    setFileErrors((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
    return true;
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];

      // Validasi ukuran file
      if (!validateFileSize(file, name)) {
        // Reset input jika file terlalu besar
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

      // Perbarui nama file yang ditampilkan
      setFileNames((prev) => ({
        ...prev,
        [name]: file.name,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["name", "email", "phoneNumber", "division"];

    if (mode === "add") {
      requiredFields.push("password");
    }

    const isValid = requiredFields.every((field) => (formData[field] ? true : false));

    if (!isValid) {
      alert("Semua field wajib diisi!");
      return;
    }

    // Validasi ukuran file sekali lagi
    if (formData.mentorPhoto && !validateFileSize(formData.mentorPhoto, "mentorPhoto")) return;
    if (formData.headerPhoto && !validateFileSize(formData.headerPhoto, "headerPhoto")) return;

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
        <div className="px-6 py-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nama</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Masukkan Nama" required />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Masukkan Email" required />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Nomor Telepon</label>
              <input type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Masukkan Nomor Telepon" required />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Masukkan Password"
                required={mode === "add" && !editingMentor}
              />
            </div>

            <FileUpload label="Foto Mentor" name="mentorPhoto" fileName={fileNames.mentorPhoto} onChange={handleFileChange} errorMessage={fileErrors.mentorPhoto} />

            <FileUpload label="Foto Header" name="headerPhoto" fileName={fileNames.headerPhoto} onChange={handleFileChange} errorMessage={fileErrors.headerPhoto} />

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Divisi</label>
              <select name="division" value={formData.division} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
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
            </div>

            <div className="flex justify-end space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Batal
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
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
      <label className="flex-shrink-0 cursor-pointer px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-600 hover:bg-gray-100">
        Choose File
        <input type="file" name={name} onChange={onChange} className="hidden" accept="image/*" />
      </label>
      <span className="flex-grow px-3 py-3 border border-gray-300 border-l-0 rounded-r-md bg-white overflow-hidden w-full text-xs truncate">{fileName || "No File Chosen"}</span>
    </div>
    {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
    <p className="text-gray-500 text-xs mt-1">Ukuran maksimal: 2MB</p>
  </div>
);

export default ModalTambahMentor;
