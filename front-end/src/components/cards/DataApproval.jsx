import React, { useState, useEffect, useCallback } from "react";
import {
  CalendarDays,
  Download,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import axios from "axios";

// Ganti dengan URL basis API Anda
const API_BASE_URL = "http://localhost:8000/api";

export default function ApprovalTable() {
  const [activeTab, setActiveTab] = useState("pendaftaran");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [selectedItems, setSelectedItems] = useState([]);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [dataPendaftaran, setDataPendaftaran] = useState([]);
  const [dataIzin, setDataIzin] = useState([]);
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

  useEffect(() => {
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
    const payload = { status: apiActionStatus }; // Sesuai permintaan: { "status": "diterima" }

    if (type === "pendaftaran") {
      url = `${API_BASE_URL}/magang/${itemId}`;
    } else if (type === "izin") {
      url = `${API_BASE_URL}/izin/${itemId}`;
    } else {
      console.error("Tipe aksi individual tidak diketahui");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
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
      console.log(
        `Item ${itemId} berhasil diupdate ke status ${frontendActionStatus}`
      );
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
      status_izin: apiActionStatus
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

      console.log(
        `Aksi massal "${frontendActionStatus}" berhasil untuk item:`,
        selectedItems
      );
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
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          className="p-1.5 rounded-full text-green-600 hover:bg-green-50"
                          onClick={() =>
                            handleIndividualAction(
                              item.id,
                              "approved",
                              "pendaftaran"
                            )
                          }
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          className="p-1.5 rounded-full text-red-600 hover:bg-red-50"
                          onClick={() =>
                            handleIndividualAction(
                              item.id,
                              "rejected",
                              "pendaftaran"
                            )
                          }
                        >
                          <XCircle size={18} />
                        </button>
                        <button
                          className="p-1.5 rounded-full text-yellow-600 hover:bg-yellow-50"
                          onClick={() =>
                            handleIndividualAction(
                              item.id,
                              "blocked",
                              "pendaftaran"
                            )
                          }
                        >
                          <AlertTriangle size={18} />
                        </button>
                      </div>
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

        {/* Table for Izin */}
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
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          className="p-1.5 rounded-full text-green-600 hover:bg-green-50"
                          onClick={() =>
                            handleIndividualAction(item.id, "approved", "izin")
                          }
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          className="p-1.5 rounded-full text-red-600 hover:bg-red-50"
                          onClick={() =>
                            handleIndividualAction(item.id, "rejected", "izin")
                          }
                        >
                          <XCircle size={18} />
                        </button>
                        <button
                          className="p-1.5 rounded-full text-yellow-600 hover:bg-yellow-50"
                          onClick={() =>
                            handleIndividualAction(item.id, "blocked", "izin")
                          }
                        >
                          <AlertTriangle size={18} />
                        </button>
                      </div>
                    </td>
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
      </div>
    </div>
  );
}
