import { useState } from "react";

export default function StudentRegistrationForm() {
  const [formData, setFormData] = useState({
    // Baris 1
    nama: "",
    alamat: "",
    
    // Baris 2
    jenis_kelamin: "",
    tempat_lahir: "",
    no_hp: "",
    tanggal_lahir: "",
    
    // Baris 3
    sekolah: "",
    nisn: "",
    
    // Baris 4
    jurusan: "",
    kelas: "",
    
    // Foto
    foto: null
  });

  // Preview foto
  const [previewUrl, setPreviewUrl] = useState("");
  
  // Handler untuk perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  // Handler untuk submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Implementasi submit form sesuai kebutuhan
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            Data Diri
          </h1>
          <p className="text-sm text-gray-500">
            Silahkan Lengkapi Data Terlebih Dahulu
          </p>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        {/* Baris 1: Nama dan Alamat */}
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                placeholder="Masukkan Nama Lengkap"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.nama}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Alamat */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Alamat
              </label>
              <textarea
                name="alamat"
                placeholder="Masukkan Alamat Lengkap"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.alamat}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Baris 2: Jenis Kelamin, Tempat Lahir, No HP, Tanggal Lahir */}
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Jenis Kelamin */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Jenis Kelamin
              </label>
              <select
                name="jenis_kelamin"
                className="w-full p-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.jenis_kelamin}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="laki-laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </select>
            </div>

            {/* Tempat Lahir */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tempat Lahir
              </label>
              <select
                name="tempat_lahir"
                className="w-full p-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </div>

            {/* No HP */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nomor HP
              </label>
              <input
                type="tel"
                name="no_hp"
                placeholder="Masukkan Nomor HP"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.no_hp}
                onChange={handleChange}
                required
                maxLength={13}
              />
            </div>

            {/* Tanggal Lahir */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="tanggal_lahir"
                className="w-full p-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.tanggal_lahir}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Baris 3: Sekolah, NISN, Jurusan, dan Kelas */}
        <div className="mb-10">
          <div className="flex gap-2">
            {/* Sekolah */}
            <div className="space-y-2 w-80">
              <label className="block text-sm font-medium text-gray-700">
                Sekolah/Universitas
              </label>
              <input
                type="text"
                name="sekolah"
                placeholder="Nama Sekolah"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.sekolah}
                onChange={handleChange}
                required
              />
            </div>

            {/* NISN */}
            <div className="space-y-2 w-50">
              <label className="block text-sm font-medium text-gray-700">
                NISN/NIM
              </label>
              <input
                type="text"
                name="nisn"
                placeholder="Masukkan NISN"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.nisn}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* Jurusan */}
            <div className="space-y-2 w-70">
              <label className="block text-sm font-medium text-gray-700">
                Jurusan
              </label>
              <select
                name="jurusan"
                className="w-full p-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={formData.jurusan}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Jurusan</option>
                <option value="ipa">Teknik Informatika</option>
                <option value="ips">Rekayasa Perangkat Lunak</option>
                <option value="bahasa">DKV</option>
                <option value="teknik">Multimedia</option>
              </select>
            </div>
            
            {/* Kelas */}
            <div className="space-y-2 w-40">
              <label className="block text-sm font-medium text-gray-700">
                Kelas
              </label>
              <select
                name="kelas"
                className="w-full p-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={formData.kelas}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Kelas</option>
                <option value="10">Kelas 10</option>
                <option value="11">Kelas 11</option>
                <option value="12">Kelas 12</option>
                <option value="mahasiswa">Mahasiswa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Upload Foto Area */}
        <div className="mb-10">
          <h2 className="text-md font-medium text-gray-700 mb-2">Masukkan Foto Diri Disini</h2>
          <div className="flex items-center">
            {/* Foto Preview Area */}
            <div className="w-24 h-24 mr-4 bg-gray-100 border border-gray-300 rounded-full overflow-hidden flex items-center justify-center">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </div>
            
            {/* Upload Area */}
            <div className="flex-1 h-32 bg-blue-50 border border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center text-center p-4 relative">
              <div className="text-blue-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPEG OR GIF (max 1080px1200px)</p>
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

        {/* Submit Button */}
        <div className="text-end mt-6">
          <button
            onClick={handleSubmit}
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
}