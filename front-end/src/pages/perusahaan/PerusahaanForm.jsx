import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CompanyRegistrationForm() {
  const navigate = useNavigate();
  
  // State untuk data wilayah Indonesia
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  
  // State untuk verifikasi status perusahaan
  const [verified, setVerified] = useState(null);
  
  // State untuk form data
  const [formData, setFormData] = useState({
    // Data Penanggung Jawab
    nama_penanggung_jawab: "",
    nomor_penanggung_jawab: "",
    email_penanggung_jawab: "",
    jabatan_penanggung_jawab: "",
    
    // Data Perusahaan
    nama: "",
    tanggal_berdiri: "",
    deskripsi: "",
    bidang_usaha: "",
    
    // Data Kontak
    telepon: "",
    provinsi: "",
    kota: "",
    kecamatan: "",
    alamat: "",
    kode_pos: "",
    website: "",
    
    // Dokumen
    logo: null,
    npwp: null,
    surat_legalitas: null,
  });

  // Cek status verifikasi perusahaan
  const checkIsVerified = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/perusahaan/detail`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setVerified(response.data.data);
    } catch (error) {
      console.error("Error fetching verification status:", error);
    }
  };

  // Redirect jika sudah terverifikasi
  useEffect(() => {
    checkIsVerified();
  }, []);

  useEffect(() => {
    if (verified === "true") {
      navigate("/perusahaan/dashboard");
    }
  }, [verified, navigate]);

  // Fetch data provinsi
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    
    fetchProvinces();
  }, []);

  // Handler untuk perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler untuk perubahan file
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (files.length > 0) {
      // Update UI to show selected filename
      const fileNameElement = e.target.parentElement.querySelector("span");
      if (fileNameElement) {
        fileNameElement.textContent = files[0].name;
      }
      
      // Update form data
      setFormData((prev) => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  // Handler untuk perubahan provinsi
  const handleProvinceChange = async (e) => {
    const selectedProvinceName = e.target.value;
    const selected = provinces.find((p) => p.name === selectedProvinceName);
    
    if (!selected) return;

    setSelectedProvince(selectedProvinceName);
    setFormData((prev) => ({
      ...prev,
      provinsi: selectedProvinceName,
      kota: "",
      kecamatan: "",
    }));

    try {
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selected.id}.json`
      );
      const data = await response.json();
      setCities(data);
      setDistricts([]);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Handler untuk perubahan kota
  const handleCityChange = async (e) => {
    const selectedCityName = e.target.value;
    const selected = cities.find((c) => c.name === selectedCityName);
    
    if (!selected) return;

    setSelectedCity(selectedCityName);
    setFormData((prev) => ({
      ...prev,
      kota: selectedCityName,
      kecamatan: "",
    }));

    try {
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selected.id}.json`
      );
      const data = await response.json();
      setDistricts(data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  // Handler untuk perubahan kecamatan
  const handleDistrictChange = (e) => {
    const selectedDistrictName = e.target.value;
    const selected = districts.find((d) => d.name === selectedDistrictName);
    
    if (!selected) return;

    setFormData((prev) => ({
      ...prev,
      kecamatan: selectedDistrictName,
    }));
  };

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formPayload = new FormData();
    
    // Append all form data to FormData object
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        formPayload.append(key, formData[key]);
      }
    }
  
    try {
    const response =  await axios.post(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"}/perusahaan`, 
        formPayload, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      
      navigate("/perusahaan/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm mb-8">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            Data Umum Perusahaan
          </h1>
          <p className="text-sm text-gray-500">
            Silahkan Lengkapi Data Terlebih Dahulu
          </p>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        {/* Section: Data Umum Perusahaan */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Data Umum Perusahaan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Nama Penanggung Jawab */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nama Penanggung Jawab<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_penanggung_jawab"
                placeholder="Masukkan Nama"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.nama_penanggung_jawab}
                onChange={handleChange}
                required
              />
            </div>

            {/* Nomor HP Penanggung Jawab */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nomor HP Penanggung Jawab<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="nomor_penanggung_jawab"
                placeholder="Masukkan Nomor HP"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.nomor_penanggung_jawab}
                onChange={handleChange}
                required
                maxLength={13}
              />
            </div>

            {/* Jabatan Penanggung Jawab */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Jabatan Penanggung Jawab<span className="text-red-500">*</span>
              </label>
              <select
                name="jabatan_penanggung_jawab"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={formData.jabatan_penanggung_jawab}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Jabatan</option>
                <option value="direktur">Direktur</option>
                <option value="manager">Manager</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>

            {/* Email Penanggung Jawab */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Penanggung Jawab<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email_penanggung_jawab"
                placeholder="Masukkan Email"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email_penanggung_jawab}
                onChange={handleChange}
                required
              />
            </div>

            {/* Nama Perusahaan */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nama Perusahaan<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                placeholder="Masukkan Nama Perusahaan"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.nama}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tanggal Berdiri */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tanggal Berdiri<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="tanggal_berdiri"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.tanggal_berdiri}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Bidang Usaha */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Bidang Usaha<span className="text-red-500">*</span>
              </label>
              <select
                name="bidang_usaha"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={formData.bidang_usaha}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Bidang Usaha</option>
                <option value="teknologi">Teknologi</option>
                <option value="manufaktur">Manufaktur</option>
                <option value="jasa">Jasa</option>
                <option value="perdagangan">Perdagangan</option>
              </select>
            </div>
          </div>

          {/* Deskripsi Perusahaan */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              name="deskripsi"
              placeholder="Deskripsi Perusahaan"
              value={formData.deskripsi}
              onChange={handleChange}
              rows={4}
            ></textarea>
          </div>
        </div>

        {/* Section: Kontak Perusahaan */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Kontak Perusahaan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Provinsi */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Provinsi<span className="text-red-500">*</span>
              </label>
              <select
                name="provinsi"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedProvince}
                onChange={handleProvinceChange}
                required
              >
                <option value="">Pilih Provinsi</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Kabupaten/Kota */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Kabupaten/Kota<span className="text-red-500">*</span>
              </label>
              <select
                name="kota"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedCity}
                onChange={handleCityChange}
                required
                disabled={!selectedProvince}
              >
                <option value="">Pilih Kabupaten/Kota</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Kecamatan */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Kecamatan<span className="text-red-500">*</span>
              </label>
              <select
                name="kecamatan"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={formData.kecamatan}
                onChange={handleDistrictChange}
                required
                disabled={!selectedCity}
              >
                <option value="">Pilih Kecamatan</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Kode Pos */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Kode Pos<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="kode_pos"
                placeholder="Masukkan Kode Pos"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.kode_pos}
                onChange={handleChange}
                required
                maxLength={5}
                pattern="[0-9]{5}"
              />
            </div>

            {/* Nomor Telepon Perusahaan */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nomor Telepon Perusahaan<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="telepon"
                placeholder="Masukkan Nomor Telepon"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.telepon}
                onChange={handleChange}
                required
              />
            </div>

            {/* Website Perusahaan */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Website Perusahaan<span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="website"
                placeholder="https://website-perusahaan.com"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.website}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Alamat Perusahaan */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="alamat"
              placeholder="Alamat Perusahaan"
              value={formData.alamat}
              onChange={handleChange}
              rows={4}
              required
            ></textarea>
          </div>
        </div>

        {/* Section: Dokumen Pendukung */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Dokumen Pendukung (Opsional)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
  {/* Dokumen Perusahaan */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      Dokumen Perusahaan
    </label>
    <div className="flex items-center space-x-2 border border-slate-400/[0.5] rounded-lg overflow-hidden">
      <input
        type="file"
        id="surat_legalitas"
        name="surat_legalitas"
        accept=".pdf,.docx,.jpeg,.png,.jpg"
        className="hidden"
        onChange={handleFileChange}
      />
      <label
        htmlFor="surat_legalitas"
        className="cursor-pointer px-3 py-2 bg-slate-100 text-slate-700 border-r border-r-slate-300"
      >
        Choose File
      </label>
      <span className="text-sm text-gray-500 truncate px-2">
        No File Chosen
      </span>
    </div>
    <p className="text-xs text-red-500 mt-1">
      *File harus berformat .pdf, .doc, .jpg, .jpeg, atau .png
    </p>
  </div>
  
  {/* NPWP Perusahaan */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      NPWP Perusahaan
    </label>
    <div className="flex items-center space-x-2 border border-slate-400/[0.5] rounded-lg overflow-hidden">
      <input
        type="file"
        id="npwp"
        name="npwp"
        accept=".pdf,.docx,.jpeg,.png,.jpg"
        className="hidden"
        onChange={handleFileChange}
      />
      <label
        htmlFor="npwp"
        className="cursor-pointer px-3 py-2 bg-slate-100 text-slate-700 border-r border-r-slate-300"
      >
        Choose File
      </label>
      <span className="text-sm text-gray-500 truncate px-2">
        No File Chosen
      </span>
    </div>
    <p className="text-xs text-red-500 mt-1">
      *File harus berformat .pdf, .doc, .jpg, .jpeg, atau .png
    </p>
  </div>
  
  {/* Logo Perusahaan */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      Logo Perusahaan
    </label>
    <div className="flex items-center space-x-2 border border-slate-400/[0.5] rounded-lg overflow-hidden">
      <input
        type="file"
        id="logo"
        name="logo"
        accept=".jpeg,.png,.jpg"
        className="hidden"
        onChange={handleFileChange}
      />
      <label
        htmlFor="logo"
        className="cursor-pointer px-3 py-2 bg-slate-100 text-slate-700 border-r border-r-slate-300"
      >
        Choose File
      </label>
      <span className="text-sm text-gray-500 truncate px-2">
        No File Chosen
      </span>
    </div>
    <p className="text-xs text-red-500 mt-1">
      *File harus berformat .jpg, .jpeg, atau .png
    </p>
  </div>
</div>
        </div>

        {/* Submit Button */}
        <div className="text-end">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Kirim
          </button>
        </div>
      </form>
    </div>
  );
}