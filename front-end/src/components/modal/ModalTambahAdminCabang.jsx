import React, { useState, useEffect } from "react";
import axios from "axios";

const ModalTambahAdminCabang = ({ isOpen, onClose, branchToEdit,onSucces }) => {
  const isEditMode = Boolean(branchToEdit);

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
  }, [branchToEdit, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [fieldName]: file }));
      if (fieldName === "adminPhoto") {
        setAdminPhotoName(file.name);
      } else if (fieldName === "headerPhoto") {
        setHeaderPhotoName(file.name);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formPayload = new FormData();
    formPayload.append("nama", formData.nama);
    formPayload.append("email", formData.email);
    formPayload.append("telepon", formData.phoneNumber);
    formPayload.append("id_cabang", formData.id_cabang);
  
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
        onSucces()
        // window.location.href="http://localhost:5173/perusahaan/admin"
      } else {
        console.log("Gagal menyimpan data admin.");
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat menyimpan admin:", error);
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

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="grid grid-cols-2 gap-5">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">Masukkan Nama</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan Nama Disini"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">Masukkan Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">Foto Admin</label>
              <div className="flex">
                <label className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-l-md text-xs text-gray-700 cursor-pointer">
                  <span>Choose File</span>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "adminPhoto")}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                <div className="flex-1 px-4 py-2 border border-gray-300 border-l-0 rounded-r-md bg-gray-50 text-gray-500 text-xs overflow-hidden">
                  {adminPhotoName}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">Foto Header</label>
              <div className="flex">
                <label className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-l-md text-xs text-gray-700 cursor-pointer">
                  <span>Choose File</span>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "headerPhoto")}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                <div className="flex-1 px-4 py-2 border border-gray-300 border-l-0 rounded-r-md bg-gray-50 text-gray-500 text-xs overflow-hidden">
                  {headerPhotoName}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan Password Disini"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required={!isEditMode}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">Masukkan Nomor HP</label>
              <input
                type="number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Masukkan Nomor HP"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
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
