import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CompanyRegistrationForm() {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [formData, setFormData] = useState({
    nama_penanggung_jawab: "",
    nomor_penanggung_jawab: "",
    email_penanggung_jawab: "",
    jabatan_penanggung_jawab: "",
    tanggal_berdiri:"",
    nama: "",
    deskripsi: "",
    telepon: "",
    provinsi: "",
    kota: "",
    kecamatan: "",
    alamat: "",
    bidang_usaha: "",
    kode_pos: "",
    website: "",
    logo: null,
    npwp: null,
    surat_legalitas: null,
  });
  const navigate = useNavigate();
  const [verived, setVerived] = useState(null);
  const checkIsVerived = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/perusahaan/detail`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setVerived(response.data.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    checkIsVerived();
  }, []);

  useEffect(() => {
    if (verived === "true") {
      navigate("/perusahaan/dashboard");
    }
  }, [verived, navigate]);

  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((res) => res.json())
      .then(setProvinces)
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: files.length > 0 ? files[0] : null
    }));
  };
  

  const handleProvinceChange = (e) => {
    const selected = provinces.find((p) => p.name === e.target.value);
    if (!selected) return;

    setSelectedProvince(selected.name);
    setFormData((prev) => ({
      ...prev,
      provinsi: selected.name,
      kota: "",
      kecamatan: "",
    }));

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selected.id}.json`
    )
      .then((res) => res.json())
      .then(setCities)
      .catch(console.error);

    setDistricts([]);
  };

  const handleCityChange = (e) => {
    const selected = cities.find((c) => c.name === e.target.value);
    if (!selected) return;

    setSelectedCity(selected.name);
    setFormData((prev) => ({
      ...prev,
      kota: selected.name,
      kecamatan: "",
    }));

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selected.id}.json`
    )
      .then((res) => res.json())
      .then(setDistricts)
      .catch(console.error);
  };

  const handleDistrictChange = (e) => {
    const selected = districts.find((d) => d.name === e.target.value);
    if (!selected) return;

    setFormData((prev) => ({
      ...prev,
      kecamatan: selected.name,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formPayload = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        formPayload.append(key, formData[key]);
      }
    }
  
    axios
      .post("http://127.0.0.1:8000/api/perusahaan", formPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        navigate("/perusahaan/dashboard")
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            Data Umum Perusahaan
          </h1>
          <p className="text-sm text-gray-500">
            Silahkan Lengkapi Data Terlebih Dahulu
          </p>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Data Umum Perusahaan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nama Penanggung Jawab<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_penanggung_jawab"
                placeholder="Masukkan Nama"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.ownerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nomor HP Penanggung Jawab<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                maxLength={13}
                name="nomor_penanggung_jawab"
                placeholder="Masukkan Nomor HP"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.ownerPhone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Jabatan Penanggung Jawab<span className="text-red-500">*</span>
              </label>
              <select
                name="jabatan_penanggung_jawab"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={formData.ownerPosition}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Jabatan</option>
                <option value="direktur">Direktur</option>
                <option value="manager">Manager</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Penanggung Jawab<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email_penanggung_jawab"
                placeholder="Masukkan Email"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.ownerEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nama Perusahaan<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                placeholder="Masukkan Nama Perusahaan"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tanggal Berdiri<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="tanggal_berdiri"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.dateEstablished}
                  onChange={handleChange}
                  required
                />
                <Calendar className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Bidang Usaha<span className="text-red-500">*</span>
              </label>
              <select
                name="bidang_usaha"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={formData.businessField}
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

          <div className="grid grid-cols-2 gap-3 mt-5">
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              name="deskripsi"
              placeholder="Deskripsi Perusahaan"
              value={formData.companyDescription}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Kontak Perusahaan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              >
                <option value="#">Pilih Kabupaten/Kota</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

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
              >
                <option value="#">Pilih Kecamatan</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Kode Pos<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                maxLength={5}
                name="kode_pos"
                placeholder="Masukkan Kode Pos"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>


            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nomor Telepon Perusahaan<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="telepon"
                placeholder="Masukkan Nomor Telepon"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.companyPhone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Website Perusahaan<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="website"
                placeholder="Website Perusahaan"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.website}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="alamat"
              placeholder="Alamat Perusahaan"
              value={formData.companyAddress}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Dokumen Pendukung
          </h2>

          <div className="grid grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Dokumen Perusahaan
              </label>
              <div className="flex items-center space-x-2 border border-slate-400/[0.5] rounded-lg overflow-hidden">
                <input
                  type="file"
                  id="surat_legalitas" // Add id here
                  name="companyDocument"
                  accept=".pdf,.docx,.jpeg,.png,.jpg"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="companyDocument" // Ensure the label links to input by id
                  className="cursor-pointer px-3 py-2 bg-slate-100 text-slate-700 border-r border-r-slate-300"
                >
                  Choose File
                </label>
                <span className="text-sm text-gray-500">No File Chosen</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                NPWP Perusahaan
              </label>
              <div className="flex items-center space-x-2 border border-slate-400/[0.5] rounded-lg overflow-hidden">
                <input
                  type="file"
                  id="npwp" // Add id here
                  name="npwpDocument"
                  accept=".pdf,.docx,.jpeg,.png,.jpg"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="npwpDocument" // Ensure the label links to input by id
                  className="cursor-pointer px-3 py-2 bg-slate-100 text-slate-700 border-r border-r-slate-300"
                >
                  Choose File
                </label>
                <span className="text-sm text-gray-500">No File Chosen</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Logo Perusahaan
              </label>
              <div className="flex items-center space-x-2 border border-slate-400/[0.5] rounded-lg overflow-hidden">
                <input
                  type="file"
                  id="logo" // Add id here
                  name="logoDocument"
                  accept=".jpeg,.png,.jpg"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="logoDocument" // Ensure the label links to input by id
                  className="cursor-pointer px-3 py-2 bg-slate-100 text-slate-700 border-r border-r-slate-300"
                >
                  Choose File
                </label>
                <span className="text-sm text-gray-500">No File Chosen</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-end">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Kirim
          </button>
        </div>
      </form>
    </div>
  );
}
