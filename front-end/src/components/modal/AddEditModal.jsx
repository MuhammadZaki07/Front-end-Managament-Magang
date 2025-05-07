import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

export default function AddEditModal({
  show,
  onClose,
  editingPartner,
  formData,
  setFormData,
  onSave,
  categories
}) {
  const [newJurusan, setNewJurusan] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    const formPayload = new FormData();
    formPayload.append("nama", formData.nama);
    formPayload.append("alamat", formData.alamat);
    formPayload.append("telepon", formData.telepon);
    formPayload.append("jenis_institusi", formData.jenis_institusi);
    formPayload.append("website", formData.website || "");

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

      onClose();
      onSave();
    } catch (err) {
      console.error(
        "Gagal menyimpan mitra:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]"
      onClick={onClose}
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
            onClick={onClose}
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
                {categories.map((institution) => (
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
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-blue-600 hover:bg-gray-50 transition"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={savePartner}
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition flex items-center ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
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
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}