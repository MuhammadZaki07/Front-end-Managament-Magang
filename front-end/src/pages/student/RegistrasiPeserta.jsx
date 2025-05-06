import axios from "axios";
import { useState, useRef, useEffect } from "react";

export default function StudentRegistrationForm() {
  const [formData, setFormData] = useState({
    // Personal Info
    nama: "",
    alamat: "",
    jenis_kelamin: "",
    tempat_lahir: "",
    no_hp: "",
    tanggal_lahir: "",
    sekolah: "",
    nisn: "",
    jurusan: "",
    kelas: "",

    // Files
    foto: null,
    cv: null,
    cvFileName: "",
  });

  // Preview foto
  const [previewUrl, setPreviewUrl] = useState("");
  
  // States for select dropdowns
  const [sekolahOptions, setSekolahOptions] = useState([
    { value: "sma1", label: "SMA Negeri 1" },
    { value: "smk1", label: "SMK Negeri 1" },
    { value: "universitas", label: "Universitas Indonesia" }
  ]);
  
  const [jurusanOptions, setJurusanOptions] = useState([
    { value: "ti", label: "Teknik Informatika" },
    { value: "rpl", label: "Rekayasa Perangkat Lunak" },
    { value: "dkv", label: "DKV" },
    { value: "mm", label: "Multimedia" }
  ]);
  
  // States for dropdowns
  const [sekolahDropdownOpen, setSekolahDropdownOpen] = useState(false);
  const [jurusanDropdownOpen, setJurusanDropdownOpen] = useState(false);
  const [sekolahSearch, setSekolahSearch] = useState("");
  const [jurusanSearch, setJurusanSearch] = useState("");
  
  // Refs for handling clicks outside
  const sekolahDropdownRef = useRef(null);
  const jurusanDropdownRef = useRef(null);

  const handleClickOutside = (event, ref, setDropdownOpen) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    const handleSekolahClickOutside = (event) => {
      handleClickOutside(event, sekolahDropdownRef, setSekolahDropdownOpen);
    };
    
    const handleJurusanClickOutside = (event) => {
      handleClickOutside(event, jurusanDropdownRef, setJurusanDropdownOpen);
    };
    
    document.addEventListener("mousedown", handleSekolahClickOutside);
    document.addEventListener("mousedown", handleJurusanClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleSekolahClickOutside);
      document.removeEventListener("mousedown", handleJurusanClickOutside);
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        cv: file,
        cvFileName: file.name, // Store the filename
      }));
    }
  };

  // Handler untuk perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle custom select
  const handleSelectOption = (field, value, label) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (field === "sekolah") {
      setSekolahSearch(label);
      setSekolahDropdownOpen(false);
    } else if (field === "jurusan") {
      setJurusanSearch(label);
      setJurusanDropdownOpen(false);
    }
  };
  
  // Handle search input changes
  const handleSearchChange = (field, value) => {
    if (field === "sekolah") {
      setSekolahSearch(value);
      // Add option if it doesn't exist
      const existingOption = sekolahOptions.find(option => 
        option.label.toLowerCase() === value.toLowerCase()
      );
      
      if (!existingOption && value) {
        setFormData((prev) => ({ ...prev, sekolah: value }));
      }
    } else if (field === "jurusan") {
      setJurusanSearch(value);
      // Add option if it doesn't exist
      const existingOption = jurusanOptions.find(option => 
        option.label.toLowerCase() === value.toLowerCase()
      );
      
      if (!existingOption && value) {
        setFormData((prev) => ({ ...prev, jurusan: value }));
      }
    }
  };

  // Handler untuk upload foto
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, foto: file }));
      // Buat URL preview untuk gambar
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append("nama", formData.nama);
    formDataToSend.append("alamat", formData.alamat);
    formDataToSend.append("jenis_kelamin", formData.jenis_kelamin);
    formDataToSend.append("tempat_lahir", formData.tempat_lahir);
    formDataToSend.append("tanggal_lahir", formData.tanggal_lahir);
    formDataToSend.append("telepon", formData.no_hp);
    formDataToSend.append("nomor_identitas", formData.nisn);
    formDataToSend.append("sekolah", formData.sekolah);
    formDataToSend.append("jurusan", formData.jurusan);
    formDataToSend.append("kelas", formData.kelas);
    
    if (formData.cv) {
      formDataToSend.append("cv", formData.cv);
    }
  
    if (formData.foto) {
      formDataToSend.append("profile", formData.foto);
    }
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/peserta`, 
        formDataToSend, 
        {
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        }
      );
  
      // Handle success
      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      // Handle error
      console.error("Error submitting form:", error);
      if (error.response) {
        alert(`Error: ${JSON.stringify(error.response.data.errors)}`);
      } else {
        alert("Error submitting the form");
      }
    }
  };

  // Default avatar image (base64 encoded or URL)
  const defaultAvatar = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2NjY2NjYyIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTBIOGE0IDQgMCAwIDAtNCA0djIiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjwvc3ZnPg==";

  return (
    <div className="max-w-6xl mx-auto bg-white p-5 rounded-lg">
      {/* Header */}
      <div className="border-b border-gray-200 py-4 px-2 mb-4">
        <h1 className="text-xl font-bold text-gray-800">Data Diri</h1>
        <p className="text-sm text-gray-500">
          Silahkan Lengkapi Data diri anda
        </p>
      </div>

      {/* Main content - two equal columns layout with separator */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Column - Personal Information */}
        <div className="w-full lg:w-1/2 space-y-4 px-2">
          {/* Nama */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <input
              type="text"
              name="nama"
              placeholder="Nama"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.nama}
              onChange={handleChange}
              required
            />
          </div>

          {/* Alamat */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <textarea
              name="alamat"
              placeholder="Masukkan Alamat"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.alamat}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>

          {/* Two Column Layout for Gender and Phone */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Jenis Kelamin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin
              </label>
              <div className="relative">
                <select
                  name="jenis_kelamin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                  value={formData.jenis_kelamin}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="laki-laki">Laki-laki</option>
                  <option value="perempuan">Perempuan</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* No HP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Hp
              </label>
              <input
                type="tel"
                name="no_hp"
                placeholder="No. Hp"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.no_hp}
                onChange={handleChange}
                required
                maxLength={13}
              />
            </div>
          </div>

          {/* Tempat Lahir and Tanggal Lahir */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Tempat Lahir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempat Lahir
              </label>
              <div className="relative">
                <select
                  name="tempat_lahir"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                  value={formData.tempat_lahir}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Tempat Lahir</option>
                  <option value="jakarta">Jakarta</option>
                  <option value="bojonegoro">Bojonegoro</option>
                  <option value="surabaya">Surabaya</option>
                  <option value="bandung">Bandung</option>
                  <option value="semarang">Semarang</option>
                  <option value="yogyakarta">Yogyakarta</option>
                  <option value="malang">Malang</option>
                  <option value="medan">Medan</option>
                  <option value="makassar">Makassar</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="tanggal_lahir"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.tanggal_lahir}
                  onChange={handleChange}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* School and NISN in one row */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            {/* Sekolah/Universitas - 8 columns (wider) */}
            <div className="col-span-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sekolah/Universitas
              </label>
              <div className="relative" ref={sekolahDropdownRef}>
                <div 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer flex justify-between items-center"
                  onClick={() => setSekolahDropdownOpen(!sekolahDropdownOpen)}
                >
                  <input
                    type="text"
                    className="outline-none w-full border-none p-0 focus:ring-0"
                    placeholder="Pilih atau ketik sekolah/universitas"
                    value={sekolahSearch}
                    onChange={(e) => handleSearchChange("sekolah", e.target.value)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSekolahDropdownOpen(true);
                    }}
                  />
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                
                {sekolahDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {sekolahOptions
                      .filter(option => 
                        option.label.toLowerCase().includes(sekolahSearch.toLowerCase())
                      )
                      .map((option, index) => (
                        <div 
                          key={index}
                          className="px-3 py-2 cursor-pointer hover:bg-blue-50"
                          onClick={() => handleSelectOption("sekolah", option.value, option.label)}
                        >
                          {option.label}
                        </div>
                      ))
                    }
                    {sekolahSearch && !sekolahOptions.some(
                      option => option.label.toLowerCase() === sekolahSearch.toLowerCase()
                    ) && (
                      <div 
                        className="px-3 py-2 cursor-pointer bg-blue-50 text-blue-700 font-medium"
                        onClick={() => {
                          // Add to options
                          const newOption = { value: sekolahSearch, label: sekolahSearch };
                          setSekolahOptions(prev => [...prev, newOption]);
                          handleSelectOption("sekolah", sekolahSearch, sekolahSearch);
                        }}
                      >
                        + Tambahkan "{sekolahSearch}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* NISN/NIM - 4 columns (narrower) */}
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NISN/NIM
              </label>
              <input
                type="text"
                name="nisn"
                placeholder="NISN/NIM"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.nisn}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Jurusan and Kelas */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Jurusan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jurusan
              </label>
              <div className="relative" ref={jurusanDropdownRef}>
                <div 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer flex justify-between items-center"
                  onClick={() => setJurusanDropdownOpen(!jurusanDropdownOpen)}
                >
                  <input
                    type="text"
                    className="outline-none w-full border-none p-0 focus:ring-0"
                    placeholder="Pilih atau ketik jurusan"
                    value={jurusanSearch}
                    onChange={(e) => handleSearchChange("jurusan", e.target.value)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setJurusanDropdownOpen(true);
                    }}
                  />
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                
                {jurusanDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {jurusanOptions
                      .filter(option => 
                        option.label.toLowerCase().includes(jurusanSearch.toLowerCase())
                      )
                      .map((option, index) => (
                        <div 
                          key={index}
                          className="px-3 py-2 cursor-pointer hover:bg-blue-50"
                          onClick={() => handleSelectOption("jurusan", option.value, option.label)}
                        >
                          {option.label}
                        </div>
                      ))
                    }
                    {jurusanSearch && !jurusanOptions.some(
                      option => option.label.toLowerCase() === jurusanSearch.toLowerCase()
                    ) && (
                      <div 
                        className="px-3 py-2 cursor-pointer bg-blue-50 text-blue-700 font-medium"
                        onClick={() => {
                          // Add to options
                          const newOption = { value: jurusanSearch, label: jurusanSearch };
                          setJurusanOptions(prev => [...prev, newOption]);
                          handleSelectOption("jurusan", jurusanSearch, jurusanSearch);
                        }}
                      >
                        + Tambahkan "{jurusanSearch}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Kelas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kelas
              </label>
              <div className="relative">
                <select
                  name="kelas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                  value={formData.kelas}
                  onChange={handleChange}
                  required
                >
                  <option value="">Kelas</option>
                  <option value="10">Kelas 10</option>
                  <option value="11">Kelas 11</option>
                  <option value="12">Kelas 12</option>
                  <option value="mahasiswa">Mahasiswa</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden lg:block border-l border-gray-300 mx-4"></div>

        {/* Right Column - Photo and CV Upload */}
        <div className="w-full lg:w-1/2 px-2 relative">
          {/* Upload Foto Area - Horizontal Layout */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Masukkan Foto Diri Disini
            </label>
            
            <div className="flex flex-row items-center space-x-4">
              {/* Avatar circle */}
              <div className="w-20 h-20 flex-shrink-0 rounded-full bg-gray-100 border border-gray-300 overflow-hidden flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={defaultAvatar}
                    alt="Default Avatar"
                    className="w-12 h-12 object-cover"
                  />
                )}
              </div>
              
              {/* Upload Area */}
              <div className="flex-grow bg-blue-50 border border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center text-center p-6 relative">
                <div className="text-blue-500 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  SVG, PNG, JPEG OR GIF (max 1080x1200px)
                </p>
                <input
                  type="file"
                  name="foto"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handlePhotoUpload}
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          {/* Upload CV Area - Horizontal Layout */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Masukkan CV Disini
            </label>
            
            <div className="flex flex-row items-center space-x-4">
              {/* CV icon circle */}
              <div className="w-20 h-20 flex-shrink-0 rounded-full bg-gray-100 border border-gray-300 overflow-hidden flex items-center justify-center">
                {formData.cvFileName ? (
                  <div className="flex flex-col items-center justify-center text-sm text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    <span className="mt-1">PDF</span>
                  </div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                )}
              </div>
              
              {/* Upload Area */}
              <div className="flex-grow bg-blue-50 border border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center text-center p-6 relative">
                <div className="text-blue-500 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>

                {/* Conditional Text Display */}
                {formData.cvFileName ? (
                  <p className="text-sm text-gray-600">
                    File Selected: {formData.cvFileName}
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOCX, DOC
                    </p>
                  </>
                )}

                <input
                  type="file"
                  name="cv"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc"
                />
              </div>
            </div>
          </div>

          {/* Submit Button - Positioned at the bottom right */}
          <div className="absolute bottom-0 right-0 px-2 pb-6 pt-4">
            <button
              onClick={handleSubmit}
              className="py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}