import { useState, useEffect, useRef } from "react";
import {
  Trash2,
  Edit,
  ChevronDown,
  X,
  Plus,
  AlertTriangle,
  Eye,
} from "lucide-react";
import Loading from "../Loading";
import axios from "axios";

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
    logo: null,
    jurusan: [],
    id_cabang: "1",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailPartner, setDetailPartner] = useState(null);
  const [newJurusan, setNewJurusan] = useState("");

  const categories = ["All", "Sekolah", "Universitas", "Politeknik"];

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  const filtered =
    selectedCategory === "All"
      ? partners
      : partners.filter((p) => p.jenis_institusi === selectedCategory);

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

  const openAdd = () => {
    setEditingPartner(null);
    setFormData({
      nama: "",
      alamat: "",
      telepon: "",
      jenis_institusi: "",
      website: "",
      foto_header: null,
      logo: null,
      jurusan: [],
      id_cabang: "1",
    });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditingPartner(p);
    setFormData({
      nama: p.nama,
      alamat: p.alamat,
      telepon: p.telepon,
      jenis_institusi: p.jenis_institusi,
      website: p.website || "",
      foto_header: null,
      // id_cabang:"1",
      jurusan: p.jurusan.map((j) => j.nama),
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, files, type } = e.target;

    if (name === "foto_header" || name === "logo") {
      const file = files[0];
      if (file && file.type.startsWith("image/")) {
        setFormData((f) => ({ ...f, [name]: file }));
      } else {
        alert("File harus berupa gambar (jpg, jpeg, png, dll)");
      }
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

  const removeJurusan = (majorToRemove) => {
    setFormData((f) => ({
      ...f,
      jurusan: f.jurusan.filter((major) => major !== majorToRemove),
    }));
  };

  const savePartner = async (e) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("nama", formData.nama);
    formPayload.append("alamat", formData.alamat);
    formPayload.append("telepon", formData.telepon);
    formPayload.append("jenis_institusi", formData.jenis_institusi);
    formPayload.append("website", formData.website || "");
    // formPayload.append("id_cabang", "2");

    if (formData.foto_header) {
      formPayload.append("foto_header", formData.foto_header);
    }

    if (formData.logo) {
      formPayload.append("logo", formData.logo);
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

      setLoading(false);
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
        logo: null,
        // id_cabang: "1",
      });
      fetchAllData();
    } catch (err) {
      console.error(
        "Gagal menyimpan mitra:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (p) => {
    setPartnerToDelete(p);
    setShowDeleteModal(true);
  };

  const viewDetail = (p) => {
    setDetailPartner(p);
    setShowDetailModal(true);
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
      window.location.href = "/perusahaan/mitra";
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

  const BASE_URL = import.meta.env.VITE_API_URL_FILE + "/storage";
  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-2 min-h-screen">
      <div className="max-w-9xl mx-auto space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">Mitra Terdaftar</h2>
            <div className="flex items-center space-x-2">
              <button
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm flex items-center transition duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  openAdd();
                }}
              >
                <Plus size={14} className="mr-1" /> Tambah Mitra
              </button>

              <div className="relative" ref={categoryDropdownRef}>
                <button
                  className="bg-white px-3 py-1.5 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center transition duration-200"
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
                        className={`px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center justify-between ${
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
              filtered.map((university) => {
                const coverImage = university.foto?.find(
                  (f) => f.type === "foto_header"
                );
                const logoImage = university.foto?.find(
                  (f) => f.type === "logo"
                );

                return (
                  <div
                    key={university.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="relative">
                      <img
                        src={
                          coverImage
                            ? `${BASE_URL}/${coverImage.path}`
                            : "/assets/img/Cover.png"
                        }
                        alt="Cover"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                        <img
                          src={
                            logoImage
                              ? `${BASE_URL}/${logoImage.path}`
                              : "/assets/img/logoperusahaan.png"
                          }
                          alt="Logo"
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      </div>
                    </div>
                    <div className="pt-8 px-3 text-center flex-grow">
                      <h3 className="font-bold text-base mb-2">
                        {university.nama}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">
                        {university.alamat}
                      </p>
                      <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                        {university.jurusan.map((j) => j.nama).join(", ")}
                      </p>
                    </div>
                    <div className="mt-auto flex border-t border-gray-200">
                      <button
                        className="flex-1 py-2 flex items-center justify-center text-gray-500 text-sm hover:bg-gray-50 transition duration-200"
                        onClick={() => confirmDelete(university)}
                      >
                        <Trash2 size={14} className="mr-1" /> Hapus
                      </button>
                      <div className="w-px bg-gray-200" />
                      <button
                        className="flex-1 py-2 flex items-center justify-center text-blue-500 text-sm hover:bg-gray-50 transition duration-200"
                        onClick={() => viewDetail(university)}
                      >
                        <Eye size={14} className="mr-1" /> Lihat
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
                );
              })
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
            className="bg-white rounded-lg w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-sm font-bold text-gray-800">
                {editingPartner ? "Edit Mitra" : "Tambah Mitra"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-3 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nama Mitra
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleFormChange}
                    placeholder="Masukkan nama mitra"
                    className="w-full py-2.5 px-3 border border-gray-300 rounded-md text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    No.Telp
                  </label>
                  <input
                    type="tel"
                    name="telepon"
                    value={formData.telepon}
                    onChange={handleFormChange}
                    placeholder="Masukkan No.Telp disini"
                    className="w-full py-2.5 px-3 border border-gray-300 rounded-md text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Website institusi
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleFormChange}
                    placeholder="Masukkan link disini"
                    className="w-full py-2.5 px-3 border border-gray-300 rounded-md text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Jenis Institusi
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories
                      .filter((cat) => cat !== "All")
                      .map((institution) => (
                        <label
                          key={institution}
                          className="flex items-center text-xs"
                        >
                          <input
                            type="radio"
                            id={institution}
                            name="jenis_institusi"
                            value={institution}
                            checked={formData.jenis_institusi === institution}
                            onChange={handleFormChange}
                            className="mr-1"
                          />
                          {institution}
                        </label>
                      ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleFormChange}
                  placeholder="Masukkan alamat disini"
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-md text-xs"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Jurusan
                </label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {formData.jurusan.map((jurusan, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full flex items-center"
                    >
                      {jurusan}
                      <button
                        type="button"
                        onClick={() => removeJurusan(jurusan)}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Tambahkan jurusan baru, tekan Enter"
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-md text-xs"
                  value={newJurusan}
                  onChange={(e) => setNewJurusan(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && newJurusan.trim() !== "") {
                      e.preventDefault();
                      if (!formData.jurusan.includes(newJurusan.trim())) {
                        setFormData((prev) => ({
                          ...prev,
                          jurusan: [...prev.jurusan, newJurusan.trim()],
                        }));
                      }
                      setNewJurusan("");
                    }
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Foto Cover
                  </label>
                  <div className="w-full py-2.5 px-3 border border-gray-300 rounded-md text-xs flex justify-between items-center">
                    <span className="text-gray-500 truncate">
                      {formData.foto_header
                        ? formData.foto_header.name || "File selected"
                        : "No File Chosen"}
                    </span>
                    <label className="cursor-pointer bg-gray-200 px-2 py-1 rounded text-xs">
                      Choose File
                      <input
                        type="file"
                        name="foto_header"
                        accept="image/*"
                        onChange={handleFormChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Logo
                  </label>
                  <div className="w-full py-2.5 px-3 border border-gray-300 rounded-md text-xs flex justify-between items-center">
                    <span className="text-gray-500 truncate">
                      {formData.logo
                        ? formData.logo.name || "File selected"
                        : "No File Chosen"}
                    </span>
                    <label className="cursor-pointer bg-gray-200 px-2 py-1 rounded text-xs">
                      Choose File
                      <input
                        type="file"
                        name="logo"
                        accept="image/*"
                        onChange={handleFormChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm text-blue-600 hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={savePartner}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && partnerToDelete && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[99999]">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
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

      {showDetailModal && detailPartner && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
          <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden">
            <div className="relative">
              {/* Header image */}
              <img
                src={
                  detailPartner.foto?.find(
                    (f) => f.type === "foto_header"
                  )?.path
                    ? `${import.meta.env.VITE_API_URL_FILE}/storage/${
                        detailPartner.foto.find(
                          (f) => f.type === "foto_header"
                        ).path
                      }`
                    : "/assets/img/Cover.png"
                }
                alt="Partner Cover"
                className="w-full h-48 object-cover"
              />

              {/* Logo */}
              <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
                <div className="rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
                  <img
                    src={
                      detailPartner.foto?.find((f) => f.type === "logo")?.path
                        ? `${import.meta.env.VITE_API_URL_FILE}/storage/${
                            detailPartner.foto.find((f) => f.type === "logo")
                              .path
                          }`
                        : "/assets/img/logoperusahaan.png"
                    }
                    alt="Partner Logo"
                    className="w-24 h-24 object-cover rounded-full"
                  />
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md"
              >
                <X size={20} />
              </button>
            </div>

            {/* Partner information */}
            <div className="pt-16 px-8 pb-6 text-center">
              <h1 className="text-2xl font-bold">{detailPartner.nama}</h1>
              <p className="text-gray-600 mt-1">{detailPartner.alamat}</p>
              {detailPartner.website && (
                <a
                  href={detailPartner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 mt-1 block text-sm"
                >
                  {detailPartner.website}
                </a>
              )}
              <p className="text-gray-700 mt-1">{detailPartner.telepon}</p>
              <p className="text-gray-500 mt-1">
                Jenis: {detailPartner.jenis_institusi}
              </p>
            </div>

            {/* Majors list */}
            <div className="px-8 pb-8">
              <h2 className="font-semibold text-xl mb-4">Daftar Jurusan</h2>
              {detailPartner.jurusan && detailPartner.jurusan.length > 0 ? (
                <div className="space-y-2">
                  {detailPartner.jurusan.map((major, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b-2 border-gray-200"
                    >
                      <div className="flex items-center font-medium">
                        <span className="text-gray-600 mr-2">{index + 1}.</span>
                        <span className="text-gray-800">{major.nama}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Tidak ada jurusan terdaftar
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
