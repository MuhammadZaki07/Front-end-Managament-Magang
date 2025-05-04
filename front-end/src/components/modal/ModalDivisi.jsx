import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalDivisi = ({ showModal, setShowModal, editingDivision = null, onSuccess }) => {
  const [newDivision, setNewDivision] = useState({ name: '', categories: [] });
  const [categoryInput, setCategoryInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (editingDivision) {
      setNewDivision({
        name: editingDivision.nama || '',
        categories: editingDivision.kategori?.map((k) => k.nama) || [],
      });
    } else {
      setNewDivision({ name: '', categories: [] });
      setSelectedFile(null);
    }
  }, [editingDivision]);

  const handleCategoryInputChange = (e) => setCategoryInput(e.target.value);

  const handleCategoryKeyPress = (e) => {
    if (e.key === 'Enter' && categoryInput.trim()) {
      e.preventDefault();
      setNewDivision((prev) => ({
        ...prev,
        categories: [...prev.categories, categoryInput.trim()],
      }));
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (category) => {
    setNewDivision((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('nama', newDivision.name);
    newDivision.categories.forEach((cat, i) =>
      formData.append(`kategori_proyek[${i}]`, cat)
    );
    formData.append("id_cabang","2")
    if (selectedFile) formData.append('foto_cover', selectedFile);
    if (editingDivision) formData.append('_method', 'PUT');

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/divisi${editingDivision ? `/${editingDivision.id}` : ''}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      onSuccess(res.data.data);
      setShowModal(false);
    } catch (error) {
      console.error('Error saving divisi:', error);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowModal(false)}></div>
      <div className="bg-white rounded-lg w-full max-w-md mx-4 z-50">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">{editingDivision ? 'Edit Divisi' : 'Tambahkan Divisi Baru'}</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nama Divisi</label>
            <input
              type="text"
              name="nama"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={newDivision.name}
              onChange={(e) => setNewDivision({ ...newDivision, name: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Kategori Project</label>
            <input
              type="text"
              className="w-full border px-3 py-2 text-sm rounded-md"
              value={categoryInput}
              onChange={handleCategoryInputChange}
              onKeyPress={handleCategoryKeyPress}
              placeholder="Tekan Enter untuk menambah kategori"
              name="kategori_proyek"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {newDivision.categories.map((category, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 text-xs rounded-md px-3 py-1 flex items-center"
                >
                  {category}
                  <button
                    className="ml-2 text-blue-500 hover:text-blue-700"
                    onClick={() => handleRemoveCategory(category)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Foto Header</label>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <div className="flex">
                <label className="bg-gray-50 text-blue-600 px-4 py-2 text-sm cursor-pointer">
                  Choose File
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
                <span className="flex-1 p-2 text-sm text-gray-500 overflow-hidden">
                  {selectedFile ? selectedFile.name : 'No File Chosen'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border rounded-md">
              Batal
            </button>
            <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md">
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDivisi;
