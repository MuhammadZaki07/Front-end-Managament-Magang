import { useState, useEffect, useRef } from "react";
import {
  Trash2,
  Edit,
  ChevronDown,
  X,
  Plus,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import Loading from "../Loading";

export default function UniversityCardGrid() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categoryDropdownRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    telepon: "",
    jenis_institusi: "",
    website: "",
    foto_header: null,
    jurusan: [],
    id_cabang:"1"
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const categories = ["All", "Sekolah", "Perusahaan", "Lembaga"];
  const majorsList = ["Informatika", "Agribusiness", "Manajemen"];
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  const filtered =
    selectedCategory === "All"
      ? partners
      : partners.filter((p) => p.jenis_institusi === selectedCategory);

  const openAdd = () => {
    setEditingPartner(null);
    setFormData({
      nama: "",
      alamat: "",
      telepon: "",
      jenis_institusi: "",
      website: "",
      foto_header: null,
      jurusan: [],
      id_cabang:"1"
    });
    setShowModal(true);
  };

  const fetchAllData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/mitra`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPartners(response.data.data);
    } catch (err) {
      console.error("Gagal memuat data mitra:", err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchAllData();
  }, []);
  

  const openEdit = (p) => {
    setEditingPartner(p);
    setFormData({
      nama: p.nama,
      alamat: p.alamat,
      telepon: p.telepon,
      jenis_institusi: p.jenis_institusi,
      website: p.website || "",
      foto_header: null,
      id_cabang:"1",
      jurusan: p.jurusan.map((j) => j.nama),
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, files, type } = e.target;
    if (name === "foto_header") {
      setFormData((f) => ({ ...f, foto_header: files[0] }));
    } else if (name === "jurusan" && type === "select-one") {
      const selectedMajor = value;
      if (selectedMajor && !formData.jurusan.includes(selectedMajor)) {
        setFormData((f) => ({
          ...f,
          jurusan: [...f.jurusan, selectedMajor],
        }));
      }
    } else {
      setFormData((f) => ({ ...f, [name]: value }));
    }
  };

  const savePartner = async (e) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("nama", formData.nama);
    formPayload.append("alamat", formData.alamat);
    formPayload.append("telepon", formData.telepon);
    formPayload.append("jenis_institusi", formData.jenis_institusi);
    formPayload.append("website", formData.website || "");
    formPayload.append("id_cabang", "2"); 

    if (formData.foto_header) {
      formPayload.append("foto_header", formData.foto_header);
    }
    formData.jurusan.forEach((j, idx) => {
      formPayload.append(`jurusan[${idx}]`, j);
    });

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    };

    try {
      const url = editingPartner
        ? `${import.meta.env.VITE_API_URL}/mitra/${
            editingPartner.id
          }?_method=PUT`
        : `${import.meta.env.VITE_API_URL}/mitra`;        
      await axios.post(url, formPayload, { headers });
      
      setLoading(false)
      setShowModal(false);
      setEditingPartner(null);
      setFormData({
        nama: "",
        alamat: "",
        telepon: "",
        jenis_institusi: "",
        website: "",
        jurusan: [""],
        foto_header: null,
        id_cabang:"1"
      });
      window.location.href="/perusahaan/mitra"
    } catch (err) {
      console.error(
        "Gagal menyimpan mitra:",
        err.response?.data || err.message
      );
    }finally {
      setLoading(false)
    }
  };

  const confirmDelete = (p) => {
    setPartnerToDelete(p);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!partnerToDelete) return;
    setDeleteLoading(true);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/mitra/${partnerToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setShowDeleteModal(false);
      setPartnerToDelete(null);
      window.location.href="/perusahaan/mitra"
    } catch (err) {
      console.error("Gagal menghapus mitra:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if(loading) return <Loading/>
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-2 min-h-screen">
      <div className="max-w-9xl mx-auto space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">Mitra Terdaftar</h2>
            <div className="flex items-center space-x-2">
              <button
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-md text-xs flex items-center transition duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  openAdd();
                }}
              >
                <Plus size={14} className="mr-1" /> Tambah Mitra
              </button>

              <div className="relative" ref={categoryDropdownRef}>
                <button
                  className="bg-white px-3 py-1.5 rounded-md text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center transition duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCategoryDropdown((v) => !v);
                  }}
                >
                  <span className="mr-1">Kategori:</span>
                  <span className="font-medium">{selectedCategory}</span>
                  <ChevronDown
                    size={14}
                    className={`ml-1 transition-transform duration-200 ${
                      showCategoryDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1 overflow-hidden">
                    {categories.map((cat) => (
                      <div
                        key={cat}
                        className={`px-3 py-2 text-xs hover:bg-gray-100 cursor-pointer flex items-center justify-between ${
                          selectedCategory === cat
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700"
                        }`}
                        onClick={() => handleSelectCategory(cat)}
                      >
                        {cat}
                        {selectedCategory === cat && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.length > 0 ? (
              filtered.map((university) => (
                <div
                  key={university.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="relative">
                    <img
                      src={`${import.meta.env.VITE_API_URL_FILE}/storage/${
                        university.foto[0].path
                      }`}
                      alt="Cover"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center">
                      <img
                        src={`${import.meta.env.VITE_API_URL_FILE}/storage/${
                          university.foto[0].path
                        }`}
                        alt="Logo"
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    </div>
                  </div>
                  <div className="pt-8 px-3 text-center flex-grow">
                    <h3 className="font-bold text-base mb-2">
                      {university.nama}
                    </h3>
                    <p className="text-gray-500 text-xs mb-2">
                      {university.alamat}
                    </p>
                    <p className="text-xs text-gray-700 mb-4 line-clamp-3">
                      {university.jurusan.map((j) => j.nama).join(", ")}
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200">
                    <button
                      className="flex-1 py-2 flex items-center justify-center text-gray-500 text-xs hover:bg-gray-50 transition duration-200"
                      onClick={() => confirmDelete(university)}
                    >
                      <Trash2 size={14} className="mr-1" /> Hapus
                    </button>
                    <div className="w-px bg-gray-200" />
                    <button
                      className="flex-1 py-2 flex items-center justify-center text-yellow-500 text-xs hover:bg-gray-50 transition duration-200"
                      onClick={() => openEdit(university)}
                    >
                      <Edit size={14} className="mr-1" /> Edit
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                Tidak ada mitra yang ditemukan untuk kategori ini
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">
                {editingPartner ? "Edit Mitra" : "Tambahkan Mitra Baru"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Mitra
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleFormChange}
                    placeholder="Masukkan nama mitra"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telepon
                  </label>
                  <input
                    type="number"
                    name="telepon"
                    value={formData.telepon}
                    onChange={handleFormChange}
                    placeholder="Masukkan nomor telepon"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto Header
                  </label>
                  <input
                    type="file"
                    name="foto_header"
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    {...(editingPartner ? {} : { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Institusi
                  </label>
                  <select
                    name="jenis_institusi"
                    value={formData.jenis_institusi}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Pilih jenis</option>
                    {categories
                      .filter((c) => c !== "All")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleFormChange}
                  placeholder="Masukkan alamat"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jurusan
                </label>

                {/* Jurusan selector with add button */}
                <div className="flex space-x-2 mb-2">
                  <select
                    name="jurusan"
                    onChange={handleFormChange}
                    className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                    value=""
                  >
                    <option value="">Pilih jurusan</option>
                    {majorsList
                      .filter((m) => !formData.jurusan.includes(m))
                      .map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Jurusan Terpilih:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.jurusan.length > 0 ? (
                      formData.jurusan.map((major) => (
                        <div
                          key={major}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                        >
                          {major}
                          <button
                            type="button"
                            onClick={() => handleDelete(major)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">
                        Belum ada jurusan yang dipilih
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={savePartner}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition duration-200"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && partnerToDelete && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl animate-fadeIn">
            <div className="flex items-center mb-4 text-red-500">
              <AlertTriangle size={24} className="mr-2" />
              <h3 className="text-lg font-bold">Konfirmasi Hapus</h3>
            </div>

            <div className="p-4 mb-4 bg-red-50 border border-red-100 rounded-md">
              <p className="text-gray-700">
                Apakah Anda yakin ingin menghapus mitra{" "}
                <span className="font-medium">"{partnerToDelete.nama}"</span>?
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Tindakan ini tidak dapat dibatalkan dan semua data terkait akan
                dihapus permanen.
              </p>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition duration-200"
                disabled={deleteLoading}
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className={`px-4 py-2 bg-red-500 text-white rounded-md text-sm transition duration-200 flex items-center ${
                  deleteLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-red-600"
                }`}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} className="mr-1" /> Hapus
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
