import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading";

export default function CabangPerusahaan() {
  const [formData, setFormData] = useState({
    nama_cabang: "",
    bidang_usaha: "",
    provinsi: "",
    kota: "",
  });
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");

  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((res) => res.json())
      .then(setProvinces)
      .catch(console.error);
  }, []);

  const fetchPrefillData = async () => {
    try {
      const provRes = await fetch(
        "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
      );
      const provData = await provRes.json();
      setProvinces(provData);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/cabang-perusahaan/edit`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = res.data.data.cabang;

      setFormData({
        nama_cabang: data.nama_cabang || "",
        bidang_usaha: data.bidang_usaha || "",
        provinsi: data.provinsi || "",
        kota: data.kota || "",
      });

      const selectedProv = provData.find((p) => p.name === data.provinsi);
      if (selectedProv) {
        setSelectedProvince(selectedProv.name);
        const cityRes = await fetch(
          `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProv.id}.json`
        );
        const cityData = await cityRes.json();
        setCities(cityData);
      }
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    }));

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selected.id}.json`
    )
      .then((res) => res.json())
      .then(setCities)
      .catch(console.error);
  };

  const handleCityChange = (e) => {
    const selected = cities.find((c) => c.name === e.target.value);
    if (!selected) return;

    setFormData((prev) => ({
      ...prev,
      kota: selected.name,
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
        `${import.meta.env.VITE_API_URL}/cabang-perusahaan/update`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchPrefillData();
    } catch (err) {
      console.error("Gagal update data:", err);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-8xl mx-auto">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Data Cabang</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-1">
            Nama Cabang
          </label>
          <input
            type="text"
            name="nama_cabang"
            value={formData.nama_cabang}
            onChange={handleChange}
            placeholder="Nama Cabang Perusahaan"
            className="w-140 p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-1">
            Bidang Usaha
          </label>
          <input
            type="text"
            name="bidang_usaha"
            value={formData.bidang_usaha}
            onChange={handleChange}
            placeholder="Bidang Usaha"
            className="w-120 p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6 flex flex-col md:flex-row md:space-x-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Provinsi
            </label>
            <select
              name="provinsi"
              value={formData.provinsi}
              onChange={handleProvinceChange}
              className="w-60 p-2 border border-[#D5DBE7] rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              className="w-60 p-2 border border-[#D5DBE7] rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Pilih Kota</option>
              {cities.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
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