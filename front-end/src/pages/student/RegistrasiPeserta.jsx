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
    kelas: ""
  });

  // Handler untuk perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          <p className="text-sm text-black-500">
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

            {/* Alamat */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Alamat
              </label>
              <input
                type="text"
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
              <input
                type="text"
                name="tempat_lahir"
                placeholder="Masukkan Tempat Lahir"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.tempat_lahir}
                onChange={handleChange}
                required
              />
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

{/* Baris 3: Sekolah dan NISN */}
<div className="mb-10">
  <div className="flex gap-2">
    {/* Sekolah */}
    <div className="space-y-2 w-100">
      <label className="block text-sm font-medium text-gray-700">
        Sekolah
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
    <div className="space-y-2 w-100">
      <label className="block text-sm font-medium text-gray-700">
        NISN
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
  </div>
</div>


        {/* Baris 4: Jurusan dan Kelas */}
        <div className="mb-10">
          <div className="flex gap-2">
            {/* Jurusan */}
            <div className="space-y-2 w-80">
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
                <option value="ipa">IPA</option>
                <option value="ips">IPS</option>
                <option value="bahasa">Bahasa</option>
                <option value="teknik">Teknik</option>
              </select>
            </div>

            {/* Kelas */}
            <div className="space-y-2 w-80">
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
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-end">
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