import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalDivisi = ({ showModal, setShowModal, editingDivision = null, onSuccess }) => {
  const [newDivision, setNewDivision] = useState({ name: '', categories: [] });
  const [categoryInput, setCategoryInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({
    name: '',
    categories: '',
    file: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // Reset errors when modal opens/closes or editing state changes
    setErrors({ name: '', categories: '', file: '' });
  }, [editingDivision, showModal]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate name
    if (!newDivision.name.trim()) {
      newErrors.name = 'Nama divisi tidak boleh kosong';
      isValid = false;
    } else if (newDivision.name.length > 50) {
      newErrors.name = 'Nama divisi maksimal 50 karakter';
      isValid = false;
    }

    // Validate categories
    if (newDivision.categories.length === 0) {
      newErrors.categories = 'Minimal satu kategori harus ditambahkan';
      isValid = false;
    }

    // Validate file for new divisions (not when editing without changing file)
    if (!editingDivision && !selectedFile) {
      newErrors.file = 'Foto header harus diupload';
      isValid = false;
    } else if (selectedFile) {
      // File size validation (max 2MB)
      if (selectedFile.size > 2 * 1024 * 1024) {
        newErrors.file = 'Ukuran file maksimal 2MB';
        isValid = false;
      }
      
      // File type validation
      const fileType = selectedFile.type;
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(fileType)) {
        newErrors.file = 'Format file harus JPEG, JPG, atau PNG';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCategoryInputChange = (e) => setCategoryInput(e.target.value);

  const handleCategoryKeyPress = (e) => {
    if (e.key === 'Enter' && categoryInput.trim()) {
      e.preventDefault();
      
      // Check if category already exists
      if (newDivision.categories.includes(categoryInput.trim())) {
        setErrors({...errors, categories: 'Kategori sudah ada dalam daftar'});
        return;
      }
      
      // Check category length
      if (categoryInput.trim().length > 30) {
        setErrors({...errors, categories: 'Nama kategori maksimal 30 karakter'});
        return;
      }
      
      setNewDivision((prev) => ({
        ...prev,
        categories: [...prev.categories, categoryInput.trim()],
      }));
      setCategoryInput('');
      setErrors({...errors, categories: ''});
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
    if (file) {
      // Clear previous file errors
      setErrors({...errors, file: ''});
      
      // Validate file size
      if (file.size > 2 * 1024 * 1024) {
        setErrors({...errors, file: 'Ukuran file maksimal 2MB'});
        return;
      }
      
      // Validate file type
      const fileType = file.type;
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(fileType)) {
        setErrors({...errors, file: 'Format file harus JPEG, JPG, atau PNG'});
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setNewDivision({...newDivision, name: value});
    
    // Clear error when typing
    if (value.trim()) {
      setErrors({...errors, name: ''});
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('nama', newDivision.name);
    newDivision.categories.forEach((cat, i) =>
      formData.append(`kategori_proyek[${i}]`, cat)
    );
    formData.append("id_cabang", "2");
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
      // Handle API errors
      if (error.response && error.response.data && error.response.data.message) {
        const apiError = error.response.data.message;
        if (typeof apiError === 'string') {
          setErrors({...errors, name: apiError});
        } else if (typeof apiError === 'object') {
          const newErrors = {};
          if (apiError.nama) newErrors.name = apiError.nama[0];
          if (apiError.kategori_proyek) newErrors.categories = apiError.kategori_proyek[0];
          if (apiError.foto_cover) newErrors.file = apiError.foto_cover[0];
          setErrors({...errors, ...newErrors});
        }
      }
    } finally {
      setIsSubmitting(false);
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
            <label className="block text-sm font-medium mb-2">
              Nama Divisi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama"
              className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm`}
              value={newDivision.name}
              onChange={handleNameChange}
              placeholder="Masukkan nama divisi"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Kategori Project <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full border ${errors.categories ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm rounded-md`}
              value={categoryInput}
              onChange={handleCategoryInputChange}
              onKeyPress={handleCategoryKeyPress}
              placeholder="Tekan Enter untuk menambah kategori"
              name="kategori_proyek"
            />
            {errors.categories && <p className="text-red-500 text-xs mt-1">{errors.categories}</p>}
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
                    type="button"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Foto Header {!editingDivision && <span className="text-red-500">*</span>}
            </label>
            <div className={`border ${errors.file ? 'border-red-500' : 'border-gray-300'} rounded-md overflow-hidden`}>
              <div className="flex">
                <label className="bg-gray-50 text-blue-600 px-4 py-2 text-sm cursor-pointer">
                  Choose File
                  <input 
                    type="file" 
                    accept="image/jpeg,image/png,image/jpg" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </label>
                <span className="flex-1 p-2 text-sm text-gray-500 overflow-hidden">
                  {selectedFile ? selectedFile.name : 'No File Chosen'}
                </span>
              </div>
            </div>
            {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
            <p className="text-gray-500 text-xs mt-1">Format: JPEG, JPG, PNG (Maks. 2MB)</p>
          </div>

          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setShowModal(false)} 
              className="px-4 py-2 text-sm border rounded-md"
              type="button"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button 
              onClick={handleSubmit} 
              className={`px-4 py-2 text-sm bg-blue-600 text-white rounded-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              type="button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDivisi;