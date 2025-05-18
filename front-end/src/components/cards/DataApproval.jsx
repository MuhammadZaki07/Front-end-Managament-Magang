import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  CalendarDays,
  Download,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  DownloadIcon,
  FileIcon,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import axios from "axios";
export default function ApprovalTable() {
  const [activeTab, setActiveTab] = useState("pendaftaran");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [dataPendaftaran, setDataPendaftaran] = useState([]);
  const [dataIzin, setDataIzin] = useState([]);
  const [showModalIzin, setShowModalIzin] = useState(false);
  const mapFrontendStatusToApi = (frontendStatus) => {
    switch (frontendStatus) {
      case "approved":
        return "diterima";
      case "rejected":
        return "ditolak";
      case "blocked":
        return "diblokir";
      default:
        return frontendStatus;
    }
  };

  const FileIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-red-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  const DownloadIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3 mr-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );

  const PreviewIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3 mr-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    document.body.classList.remove("modal-open");
  };

  const fetchDataPendaftaran = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/magang`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      let pendaftaranData = response.data.data || response.data;
      setDataPendaftaran(pendaftaranData);
    } catch (error) {
      console.error("Failed to fetch data pendaftaran:", error);
    }
  };

  const fetchDataIzin = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/izin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const izinData = response.data.data || response.data;

      setDataIzin(izinData);
    } catch (error) {
      console.error("Failed to fetch data izin:", error);
    }
  };

  useEffect(() => {
    fetchDataPendaftaran();
    fetchDataIzin();
  }, []);

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleIndividualAction = async (itemId, frontendActionStatus, type) => {
    const apiActionStatus = mapFrontendStatusToApi(frontendActionStatus);
    let url = "";
    const payload = { status: apiActionStatus };

    if (type === "pendaftaran") {
      url = `${API_BASE_URL}/magang/${itemId}`;
    } else if (type === "izin") {
      url = `${API_BASE_URL}/izin/${itemId}`;
    } else {
      console.error("Tipe aksi individual tidak diketahui");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message}`
        );
      }

      // Update local state
      if (type === "pendaftaran") {
        setDataPendaftaran((prevData) =>
          prevData.map((item) =>
            item.id === itemId
              ? { ...item, status: frontendActionStatus }
              : item
          )
        );
      } else {
        // izin
        setDataIzin((prevData) =>
          prevData.map((item) =>
            item.id === itemId
              ? { ...item, approvalStatus: frontendActionStatus }
              : item
          )
        );
      }

     fetchDataPendaftaran()
     fetchDataIzin()
     setShowModal(false)
    } catch (error) {
      console.error(`Gagal mengupdate item ${itemId}:`, error);
      alert(`Gagal memperbarui status: ${error.message}`);
    }
  };

  const handleBulkAction = async (frontendActionStatus) => {
    if (selectedItems.length === 0) {
      setShowActionDropdown(false);
      return;
    }

    const apiActionStatus = mapFrontendStatusToApi(frontendActionStatus);

    const payload = {
      ids: selectedItems,
      status: apiActionStatus,
      status_izin: apiActionStatus,
    };

    const url =
      activeTab === "pendaftaran"
        ? `${API_BASE_URL}/many/magang`
        : `${API_BASE_URL}/many/izin`;

    try {
      await axios.put(url, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (activeTab === "pendaftaran") {
        window.location.href = "/perusahaan/approval";
      } else {
        window.location.href = "/perusahaan/approval";
      }

     fetchDataIzin()
     fetchDataPendaftaran()
      setSelectedItems([]);
      setShowActionDropdown(false);
    } catch (error) {
      // Penanganan error yang lebih lengkap
      console.error("Terjadi kesalahan saat melakukan request API:", error);

      if (error.response) {
        // Jika ada response error dari server
        console.error("Status error response:", error.response.status);
        console.error("Data error response:", error.response.data);
      } else if (error.request) {
        // Jika request dikirim tapi tidak ada respons
        console.error("Request yang dikirim:", error.request);
      } else {
        // Jika ada error lain (misalnya masalah dalam pengaturan request)
        console.error("Pesan error:", error.message);
      }

      // Menampilkan alert dengan pesan error yang lebih jelas
      alert(
        `Gagal melakukan aksi massal: ${
          error.response?.data?.message || error.message
        }`
      );
      setShowActionDropdown(false);
    }
  };

  const filteredPendaftaran = dataPendaftaran.filter((item) => {
    const matchesSearch =
      item.user &&
      Object.values(item.user).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesDate =
      !selectedDate ||
      (item.mulai &&
        item.mulai.includes(
          selectedDate.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        ));

    return matchesSearch && matchesDate;
  });

  const filteredIzin = dataIzin.filter((item) => {
    const matchesSearch = Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesDate =
      !selectedDate ||
      (item.tanggalIzin &&
        item.tanggalIzin.includes(
          selectedDate.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        ));
    return matchesSearch && matchesDate;
  });

  const CustomButton = React.forwardRef(({ value, onClick }, ref) => (
    <button
      className="flex items-center gap-2 bg-white text-[#344054] py-2 px-4 rounded-md shadow border border-[#667797] hover:bg-[#0069AB] hover:text-white text-sm"
      onClick={onClick}
      ref={ref}
      type="button"
    >
      <CalendarDays size={16} />
      {value
        ? new Date(value).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Pilih Tanggal"}
    </button>
  ));

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved": // Frontend status
        return (
          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
            Disetujui
          </span>
        );
      case "rejected": // Frontend status
        return (
          <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
            Ditolak
          </span>
        );
      case "blocked": // Frontend status
        return (
          <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
            Diblokir
          </span>
        );
      default: // Biasanya "pending" atau status awal dari API
        return (
          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
            Pending
          </span>
        );
    }
  };

  const handleDownload = (doc) => {
    if (!doc || !doc.url) return;

    const baseUrl = import.meta.env.VITE_API_URL_FILE || "";
    const cleanedUrl = doc.url.includes("/storage/")
      ? doc.url.split("/storage/")[1]
      : doc.url;

    const downloadUrl = `${baseUrl}/storage/${cleanedUrl}`;
    const encodedUrl = encodeURI(downloadUrl);

    const link = document.createElement("a");
    link.href = encodedUrl;
    link.download = doc.name || "download";
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  };

  const handlePreview = (document) => {
    if (!document || !document.url) return;
    const cleanUrl = document.url.includes("/storage")
      ? document.url.split("/storage")[1]
      : document.url;
    const finalUrl = `${import.meta.env.VITE_API_URL_FILE}/storage/${cleanUrl}`;
    window.open(finalUrl, "_blank");
  };

  const DocumentItem = ({ document, onDownload, onPreview }) => {
    return (
      <div className="border border-gray-200 rounded-lg p-2 mb-2 w-full">
        <div className="flex items-start">
          <div className="bg-red-100 p-1.5 rounded-lg mr-2">
            <FileIcon />
          </div>
          <div className="flex justify-between w-full">
            <div>
              <p className="font-medium text-sm">
                {document?.name || "Document"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 ml-4">
              <button
                className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs flex items-center"
                onClick={() => onDownload(document)}
              >
                <DownloadIcon />
                Download
              </button>
              <button
                className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs flex items-center mt-1"
                onClick={() => onPreview(document)}
              >
                <PreviewIcon />
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InputLabel = ({ label, value }) => (
    <div>
      <label className="block text-gray-600 text-xs mb-1">{label}</label>
      <input
        type="text"
        value={value || ""}
        readOnly
        className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 cursor-default"
      />
    </div>
  );

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-[#1D2939]">
                Data Approval
              </h2>
              <p className="text-[#667085] text-sm mt-1">
                Kelola data penerimaan dengan maksimal!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                customInput={<CustomButton />}
                dateFormat="dd MMMM yyyy"
                showPopperArrow={false}
              />
              <CSVLink
                data={
                  activeTab === "pendaftaran"
                    ? filteredPendaftaran
                    : filteredIzin
                } // Export data yang terfilter
                filename={`data_${activeTab}.csv`}
                headers={
                  activeTab === "pendaftaran"
                    ? [
                        { label: "Nama", key: "nama" },
                        { label: "Jurusan", key: "jurusan" },
                        { label: "Kelas", key: "kelas" },
                        { label: "Masa Magang", key: "masaMagang" },
                        { label: "Sekolah", key: "sekolah" },
                        { label: "Status", key: "status" }, // Mungkin perlu mapping ke teks "Disetujui", dll.
                      ]
                    : [
                        { label: "Nama", key: "nama" },
                        { label: "Sekolah", key: "sekolah" },
                        { label: "Tanggal Izin", key: "tanggalIzin" },
                        { label: "Tanggal Kembali", key: "tanggalKembali" },
                        { label: "Status Izin/Sakit", key: "status" }, // field "status" di dataIzin
                        { label: "Status Approval", key: "approvalStatus" }, // Mungkin perlu mapping
                      ]
                }
              >
                <button className="flex items-center gap-2 border border-gray-300 text-[#344054] px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#0069AB] hover:text-white">
                  <Download size={16} />
                  Export
                </button>
              </CSVLink>
            </div>
          </div>

          <div className="border-b border-gray-200 my-5" />

          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm border ${
                  activeTab === "pendaftaran"
                    ? "bg-[#0069AB] text-white"
                    : "border-gray-300 text-[#344054]"
                }`}
                onClick={() => {
                  setActiveTab("pendaftaran");
                  setSelectedItems([]); // Reset pilihan saat ganti tab
                  setShowActionDropdown(false);
                }}
              >
                Pendaftaran
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm border ${
                  activeTab === "izin"
                    ? "bg-[#0069AB] text-white"
                    : "border-gray-300 text-[#344054]"
                }`}
                onClick={() => {
                  setActiveTab("izin");
                  setSelectedItems([]); // Reset pilihan saat ganti tab
                  setShowActionDropdown(false);
                }}
              >
                Izin/Sakit
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Search size={16} />
                </span>
              </div>
            </div>
          </div>

          {/* Bulk Action Controls */}
          {selectedItems.length > 0 && (
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg mt-4">
              <div className="text-sm text-blue-700">
                {selectedItems.length} item dipilih
              </div>
              <div className="relative">
                <button
                  className="flex items-center gap-2 bg-[#0069AB] text-white px-4 py-2 rounded-lg text-sm"
                  onClick={() => setShowActionDropdown(!showActionDropdown)}
                >
                  Aksi Massal
                  <ChevronDown size={14} />
                </button>

                {showActionDropdown && (
                  <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40">
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleBulkAction("approved")} // Menggunakan status frontend
                    >
                      <CheckCircle size={14} />
                      Setujui
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleBulkAction("rejected")} // Menggunakan status frontend
                    >
                      <XCircle size={14} />
                      Tolak
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleBulkAction("blocked")} // Menggunakan status frontend
                    >
                      <AlertTriangle size={14} />
                      Blokir
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Table for Pendaftaran */}
        {activeTab === "pendaftaran" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-[#667085]">
                <tr>
                  <th className="px-6 py-3 text-left">
                    {/* Checkbox select all bisa ditambahkan kembali jika diperlukan */}
                  </th>
                  <th className="px-6 py-3 text-left">Nama</th>
                  <th className="px-6 py-3 text-left">Jurusan</th>
                  <th className="px-6 py-3 text-left">Masa Magang</th>
                  <th className="px-6 py-3 text-left">Sekolah</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPendaftaran.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#0069AB] focus:ring-[#0069AB]"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={
                          item.user?.foto?.find((f) => f.type === "profile")
                            ?.path
                            ? `http://127.0.0.1:8000/storage/${
                                item.user.foto.find((f) => f.type === "profile")
                                  .path
                              }`
                            : "/assets/img/default-avatar.png"
                        }
                        alt={item.user?.nama || "User"}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{item.user?.nama || "-"}</span>
                    </td>
                    <td className="px-6 py-4">{item.user?.jurusan || "-"}</td>
                    <td className="px-6 py-4">
                      {item.mulai && item.selesai
                        ? `${new Date(item.mulai).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })} - ${new Date(item.selesai).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4">{item.user?.sekolah || "-"}</td>
                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredPendaftaran.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Tidak ada data pendaftaran yang sesuai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "izin" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-[#667085]">
                <tr>
                  <th className="px-6 py-3 text-left">
                    {/* Checkbox select all */}
                  </th>
                  <th className="px-6 py-3 text-left">Nama</th>
                  <th className="px-6 py-3 text-left">Sekolah</th>
                  <th className="px-6 py-3 text-left">Tanggal Izin</th>
                  <th className="px-6 py-3 text-left">Tanggal Kembali</th>
                  <th className="px-6 py-3 text-left">Keterangan</th>
                  <th className="px-6 py-3 text-left">Status Approval</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredIzin.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#0069AB] focus:ring-[#0069AB]"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={
                          item.peserta.foto.find((f) => f.type === "profile")
                            ?.path
                            ? `${import.meta.env.VITE_API_URL_FILE}/storage/${
                                item.peserta.foto.find(
                                  (f) => f.type === "profile"
                                )?.path
                              }`
                            : "/assets/img/default-avatar.png"
                        }
                        alt={item.peserta.nama}
                        className="w-8 h-8 rounded-full object-cover"
                      />

                      <span>{item.peserta.nama}</span>
                    </td>
                    <td className="px-6 py-4">{item.peserta.sekolah}</td>
                    <td className="px-6 py-4">{item.mulai}</td>
                    <td className="px-6 py-4">{item.selesai}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full ${
                          item.jenis === "izin"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        } text-xs font-medium`}
                      >
                        {item.jenis} {/* Menampilkan "Izin" atau "Sakit" */}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status_izin)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowModalIzin(true);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        {" "}
                        Lihat Detail{" "}
                      </button>
                    </td>{" "}
                    {/* <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button className="p-1.5 rounded-full text-green-600 hover:bg-green-50" onClick={() => handleIndividualAction(item.id, "approved", "izin")}>
                          <CheckCircle size={18} />
                        </button>
                        <button className="p-1.5 rounded-full text-red-600 hover:bg-red-50" onClick={() => handleIndividualAction(item.id, "rejected", "izin")}>
                          <XCircle size={18} />
                        </button>
                        <button className="p-1.5 rounded-full text-yellow-600 hover:bg-yellow-50" onClick={() => handleIndividualAction(item.id, "blocked", "izin")}>
                          <AlertTriangle size={18} />
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
                {filteredIzin.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Tidak ada data izin/sakit yang sesuai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

{showModal && selectedItem && (
  <div
    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50"
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        closeModal();
      }
    }}
  >
    <div
      className="bg-white rounded-lg max-w-6xl w-full shadow-lg pointer-events-auto max-h-[90vh] overflow-y-auto flex"
      onClick={(e) => e.stopPropagation()}
    >
      {/* KIRI: Konten utama pendaftar */}
      <div className="p-5 w-2/3">
        <h2 className="text-xl font-semibold mb-4">Detail Pendaftar</h2>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Kolom foto profil */}
          <div className="flex-shrink-0">
            <img
              src={
                selectedItem.user?.foto?.find((f) => f.type === "profile")
                  ? `${import.meta.env.VITE_API_URL_FILE}/storage/${
                      selectedItem.user.foto.find((f) => f.type === "profile")
                        .path
                    }`
                  : "/placeholder-profile.jpg"
              }
              alt={selectedItem.user?.nama}
              className="w-30 h-30 rounded-lg object-cover"
            />
          </div>

          {/* Kolom Informasi - dibagi 2 */}
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            {/* Kolom 1 */}
            <div className="space-y-3">
              <InputLabel label="Nama" value={selectedItem.user?.nama} />
              <InputLabel
                label="Jenis Kelamin"
                value={
                  selectedItem.user?.jenis_kelamin === "P"
                    ? "Laki-Laki"
                    : "Perempuan"
                }
              />
              <InputLabel
                label="Tempat Lahir"
                value={selectedItem.user?.tempat_lahir}
              />
              <InputLabel label="Sekolah" value={selectedItem.user?.sekolah} />
              <InputLabel
                label="NISN/NIM"
                value={selectedItem.user?.nomor_identitas}
              />

              {/* Dokumen Berkas */}
              <div className="mt-4">
                <h3 className="text-base font-medium mb-2">
                  Berkas Pendaftaran
                </h3>
                <div className="flex gap-5 items-center">
                  <DocumentItem
                    document={{
                      name: "CV",
                      url: selectedItem.user?.foto?.find((f) => f.type === "cv")
                        ? `${import.meta.env.VITE_API_URL_FILE}/storage/${
                            selectedItem.user.foto.find(
                              (f) => f.type === "cv"
                            ).path
                          }`
                        : null,
                    }}
                    onDownload={handleDownload}
                    onPreview={handlePreview}
                  />
                </div>
              </div>
            </div>

            {/* Kolom 2 */}
            <div className="space-y-3">
              <InputLabel label="Alamat" value={selectedItem.user?.alamat} />
              <InputLabel label="No. HP" value={selectedItem.user?.telepon} />
              <InputLabel
                label="Tanggal Lahir"
                value={selectedItem.user?.tanggal_lahir}
              />
              <InputLabel label="Jurusan" value={selectedItem.user?.jurusan} />
              <div>
                <label className="block text-gray-600 text-xs">
                  Status Pendaftaran
                </label>
                <span className="bg-orange-100 text-orange-500 px-2 py-1 rounded-lg text-xs inline-block mt-1">
                  {selectedItem.status || "Menunggu Konfirmasi"}
                </span>
              </div>

              <div className="mt-15">
                <DocumentItem
                  document={{
                    name: "Surat Pernyataan Diri",
                    url: selectedItem.user?.foto?.find(
                      (f) => f.type === "surat_pernyataan_diri"
                    )
                      ? `${import.meta.env.VITE_API_URL_FILE}/storage/${
                          selectedItem.user.foto.find(
                            (f) => f.type === "surat_pernyataan_diri"
                          ).path
                        }`
                      : null,
                  }}
                  onDownload={handleDownload}
                  onPreview={handlePreview}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-center gap-20 mt-6">
  {/* Tombol Tolak */}
  <button
    className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 bg-red-100 text-sm font-medium"
    onClick={() => {
      Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda akan menolak siswa ini.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#aaa",
        confirmButtonText: "Ya, Tolak",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          handleIndividualAction(selectedItem.id, "rejected", "pendaftaran");
        }
      });
    }}
  >
    Tolak
  </button>

  {/* Tombol Terima */}
  <button
    className="px-4 py-2 rounded-lg text-green-600 hover:bg-green-50 bg-green-100 text-sm font-medium"
    onClick={() => {
      Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda akan menerima siswa ini.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#22c55e",
        cancelButtonColor: "#aaa",
        confirmButtonText: "Ya, Terima",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          handleIndividualAction(selectedItem.id, "approved", "pendaftaran");
        }
      });
    }}
  >
    Terima
  </button>
</div>


      </div>

      {/* KANAN: Preview Dokumen */}
<div className="w-1/3 p-4 space-y-6">
  {/* === Preview CV === */}
  {selectedItem.user?.foto?.find((f) => f.type === "cv") ? (
    (() => {
      const cv = selectedItem.user.foto.find((f) => f.type === "cv");
      const cvUrl = `${import.meta.env.VITE_API_URL_FILE}/storage/${cv.path}`;
      
      return (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">CV</span>
            <button
              onClick={() => {
                // Membuat elemen <a> dinamis untuk memulai download file PDF
                const link = document.createElement('a');
                link.href = cvUrl;
                link.download = 'cv.pdf'; // Nama file yang akan didownload
                link.click(); // Memicu download file
              }}
              className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              Download
            </button>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => window.open(cvUrl, "_blank", 'noopener,noreferrer')}
            title="Klik untuk melihat lebih jelas"
          >
            {/* Menampilkan preview CV dalam iframe */}
            <iframe
              src={`${cvUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-110 border rounded pointer-events-none"
              title="Preview CV"
            ></iframe>
          </div>
        </div>
      );
    })()
  ) : (
    <p className="text-sm text-gray-500">CV belum tersedia.</p>
  )}

  {/* === Preview Surat Pernyataan === */}
  {selectedItem.user?.foto?.find((f) => f.type === "surat_pernyataan_diri") ? (
    (() => {
      const surat = selectedItem.user.foto.find((f) => f.type === "surat_pernyataan_diri");
      const suratUrl = `${import.meta.env.VITE_API_URL_FILE}/storage/${surat.path}`;

      return (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Surat Pernyataan Diri</span>
            <button
              onClick={() => {
                // Membuat elemen <a> dinamis untuk memulai download file PDF
                const link = document.createElement('a');
                link.href = suratUrl;
                link.download = 'surat-pernyataan.pdf'; // Nama file yang akan didownload
                link.click(); // Memicu download file
              }}
              className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              Download
            </button>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => window.open(suratUrl, "_blank")}
            title="Klik untuk melihat lebih jelas"
          >
            {/* Menampilkan preview Surat Pernyataan dalam iframe */}
            <iframe
              src={`${suratUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-40 border rounded"
              title="Preview Surat Pernyataan"
            ></iframe>
          </div>
        </div>
      );
    })()
  ) : (
    <p className="text-sm text-gray-500">Surat pernyataan belum tersedia.</p>
  )}
</div>




    </div>
  </div>
)}


        {showModalIzin && selectedItem && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Detail Izin</h2>
                  <button onClick={closeModal} className="text-black">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
                <p className="text-gray-500 text-sm">
                  Ayo Laporkan Kegiatanmu hari ini!
                </p>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-gray-500 text-sm">Nama</label>
                    <div>{selectedItem.nama}</div>
                  </div>

                  <div>
                    <label className="block text-gray-500 text-sm">
                      Tanggal
                    </label>
                    <div>{selectedItem.tanggalIzin}</div>
                  </div>

                  <div>
                    <label className="block text-gray-500 text-sm">
                      Sekolah
                    </label>
                    <div>{selectedItem.sekolah}</div>
                  </div>

                  <div>
                    <label className="block text-gray-500 text-sm">
                      Kegiatan
                    </label>
                    <div>{selectedItem.kegiatan || "Ini Contoh"}</div>
                  </div>

                  <div>
                    <label className="block text-gray-500 text-sm">
                      Bukti Kegiatan
                    </label>
                    <div className="mt-2 flex justify-center">
                      {/* Menampilkan gambar bukti kegiatan */}
                      {selectedItem.buktiKegiatan ? (
                        <a
                          href={selectedItem.buktiKegiatan}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={selectedItem.buktiKegiatan}
                            alt="Bukti Kegiatan"
                            className="max-w-[200px] h-auto rounded-lg"
                          />
                        </a>
                      ) : (
                        <div className="mb-2 text-4xl text-gray-600">
                          <i className="bi bi-file-earmark-arrow-up"></i>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-500"
                    onClick={closeModal}
                  >
                    Tolak
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">
                    Terima
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
