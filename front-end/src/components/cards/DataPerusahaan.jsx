import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading";

export default function DataUmumPerusahaan() {
  const [formData, setFormData] = useState({
    nama_penanggung_jawab: "",
    nohp_penanggung_jawab: "",
    jabatan_penanggung_jawab: "",
    email_penanggung_jawab: "",
    nama_perusahaan: "",
    tanggal_berdiri: "",
    bidang_usaha: "",
    deskripsi_perusahaan: "",
    alamat_perusahaan: "",
    provinsi: "",
    kota: "",
    kecamatan: "",
    kode_pos: "",
    email_perusahaan: "",
    telepon_perusahaan: "",
    website_perusahaan: "",
  });
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // ✅ Fetch semua provinsi saat awal
  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((res) => res.json())
      .then(setProvinces)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchPrefillData = async () => {
      try {
        const provRes = await fetch(
          "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
        );
        const provData = await provRes.json();
        setProvinces(provData);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/perusahaan/edit`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = res.data.data.perusahaan;
        const allowedJabatan = [
          "Direktur",
          "Manager",
          "Supervisor",
          "Staff",
          "Lainnya",
        ];
        const normalizedJabatan = allowedJabatan.find(
          (j) =>
            j.toLowerCase() ===
            (data.jabatan_penanggung_jawab || "").trim().toLowerCase()
        );

        setFormData({
          nama_penanggung_jawab: data.nama_penanggung_jawab || "",
          nohp_penanggung_jawab: data.nomor_penanggung_jawab || "",
          jabatan_penanggung_jawab: normalizedJabatan || "",
          email_penanggung_jawab: data.email_penanggung_jawab || "",
          nama_perusahaan: data.nama || "",
          tanggal_berdiri: data.tanggal_berdiri || "",
          bidang_usaha: data.bidang_usaha || "",
          deskripsi_perusahaan: data.deskripsi || "",
          alamat_perusahaan: data.alamat || "",
          provinsi: data.provinsi || "",
          kota: data.kota || "",
          kecamatan: data.kecamatan || "",
          kode_pos: data.kode_pos || "",
          email_perusahaan: data.email || "",
          telepon_perusahaan: data.telepon || "",
          website_perusahaan: data.website || "",
        });

        const selectedProv = provData.find((p) => p.name === data.provinsi);
        if (selectedProv) {
          setSelectedProvince(selectedProv.name);
          const cityRes = await fetch(
            `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProv.id}.json`
          );
          const cityData = await cityRes.json();
          setCities(cityData);

          const selectedCity = cityData.find((c) => c.name === data.kota);
          if (selectedCity) {
            setSelectedCity(selectedCity.name);
            const districtRes = await fetch(
              `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedCity.id}.json`
            );
            const districtData = await districtRes.json();
            setDistricts(districtData);
          }
        }
      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrefillData();
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        _method: "PUT",
      };
  
      await axios.post(
        `${import.meta.env.VITE_API_URL}/perusahaan/update`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      alert("Data berhasil diupdate!");
    } catch (err) {
      console.error("Gagal update data:", err);
      alert("Gagal update data.");
    }
  };
  

  if (loading) return <Loading />;

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-8xl mx-auto">
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-4">Data Umum Perusahaan</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Nama Penanggung Jawab", name: "nama_penanggung_jawab" },
            {
              label: "Nomor HP Penanggung Jawab",
              name: "nohp_penanggung_jawab",
            },
            { label: "Email Penanggung Jawab", name: "email_penanggung_jawab" },
          ].map((field) => (
            <div key={field.name} className="w-full">
              <label className="block text-sm font-medium text-black mb-1">
                {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.label}
                className="w-full p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
          <div className="w-full">
            <label className="block text-sm font-medium text-black mb-1">
              Jabatan Penanggung Jawab
            </label>
            <select
              name="jabatan_penanggung_jawab"
              value={formData.jabatan_penanggung_jawab}
              onChange={handleChange}
              className="w-full p-2 border border-[#D5DBE7] rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Pilih Jabatan</option>
              <option value="Direktur">Direktur</option>
              <option value="Manager">Manager</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Staff">Staff</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Nama Perusahaan", name: "nama_perusahaan" },
            { label: "Tanggal Berdiri", name: "tanggal_berdiri" },
          ].map((field) => (
            <div key={field.name} className="w-full">
              <label className="block text-sm font-medium text-black mb-1">
                {field.label}
              </label>
              <input
                type={field.name === "tanggal_berdiri" ? "date" : "text"}
                name={field.name}
                value={
                  field.name === "tanggal_berdiri"
                    ? formData[field.name]?.split("T")[0] || ""
                    : formData[field.name]
                }
                onChange={handleChange}
                placeholder={field.label}
                className="w-full p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-1">
            Deskripsi Perusahaan
          </label>
          <textarea
            name="deskripsi_perusahaan"
            value={formData.deskripsi_perusahaan}
            onChange={handleChange}
            placeholder="Tuliskan deskripsi perusahaan"
            rows={4}
            className="w-full p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />
        </div>

        <h2 className="text-lg font-bold mb-4">Kontak Perusahaan</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Provinsi
            </label>
            <select
              name="provinsi"
              value={formData.provinsi}
              onChange={handleProvinceChange}
              className="w-full p-2 border border-[#D5DBE7] rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Pilih Provinsi</option>
              {provinces.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Kabupaten/Kota
            </label>
            <select
              name="kota"
              value={formData.kota}
              onChange={handleCityChange}
              disabled={!formData.provinsi}
              className="w-full p-2 border border-[#D5DBE7] rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Pilih Kota</option>
              {cities.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Kecamatan
            </label>
            <select
              name="kecamatan"
              value={formData.kecamatan}
              onChange={handleDistrictChange}
              disabled={!formData.kota}
              className="w-full p-2 border border-[#D5DBE7] rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Pilih Kecamatan</option>
              {districts.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Kode Pos
            </label>
            <input
              type="text"
              name="kode_pos"
              value={formData.kode_pos}
              onChange={handleChange}
              placeholder="Kode Pos"
              className="w-full p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Email Perusahaan", name: "email_perusahaan" },
            { label: "Telepon Perusahaan", name: "telepon_perusahaan" },
            { label: "Website Perusahaan", name: "website_perusahaan" },
          ].map((field) => (
            <div key={field.name} className="w-full">
              <label className="block text-sm font-medium text-black mb-1">
                {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.label}
                className="w-full p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-sky-500 text-white font-bold py-2 px-6 rounded hover:bg-sky-700"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
