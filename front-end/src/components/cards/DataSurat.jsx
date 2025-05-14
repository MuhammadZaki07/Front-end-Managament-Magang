import React, { useState, useEffect } from "react";
import { CalendarDays, Download, Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import axios from "axios";

import DataPenerimaan from "./DataPenerimaan";
import DataPeringatan from "./DataPeringatan";
import WarningLetterModal from "../modal/WarningLetterModal";

export default function Surat() {
  const [activeTab, setActiveTab] = useState("DataPenerimaan");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedJurusan, setSelectedJurusan] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDataPeringatan, setSelectedDataPeringatan] = useState(null);
  const [dataPenerimaan, setDataPenerimaan] = useState([]);
  const [dataPeringatan, setDataPeringatan] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const fetchPenerimaan = async () => {
    try {
      console.log("Fetching penerimaan data...");
      
      // Coba endpoint yang berbeda sesuai dengan ApprovalTable
      const response = await axios.get(`${apiUrl}/magang`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Response penerimaan:", response);
      
      if (response.data) {
        // Ambil data dan filter yang statusnya diterima/approved
        const allData = response.data.data || response.data;
        console.log("All data magang:", allData);
        
        // Filter data yang sudah diterima
        const approvedData = allData.filter(item => {
          console.log("Item status:", item.status);
          // Status mungkin "approved", "diterima", atau format lain
          return item.status === "approved" || 
                 item.status === "diterima" || 
                 item.status === "accepted";
        });
        
        console.log("Approved data:", approvedData);
        setDataPenerimaan(approvedData);
      }
    } catch (error) {
      console.error("Error fetching data penerimaan:", error);
      console.error("Error details:", error.response);
      
      // Fallback ke endpoint /surat jika /magang gagal
      try {
        console.log("Trying fallback endpoint /surat...");
        const fallbackResponse = await axios.get(`${apiUrl}/surat`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("Fallback response:", fallbackResponse.data);
        
        if (fallbackResponse.data.status === "success") {
          const filteredData = fallbackResponse.data.data.filter(
            (item) => item.jenis === "penerimaan"
          );
          console.log("Filtered surat data:", filteredData);
          setDataPenerimaan(filteredData);
        }
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
    }
  };

  const fetchPeringatan = async () => {
    try {
      console.log("Fetching peringatan data...");
      const response = await axios.get(`${apiUrl}/surat-peringatan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Response peringatan:", response.data);
      
      if (response.data.status === "success") {
        setDataPeringatan(response.data.data);
      } else {
        console.error("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data peringatan:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchPenerimaan(), fetchPeringatan()]);
    setLoading(false);
  };

  useEffect(() => {
    console.log("Component mounted, fetching data...");
    fetchData();
  }, []);

  // Debug log setiap kali data berubah
  useEffect(() => {
    console.log("Data penerimaan updated:", dataPenerimaan);
  }, [dataPenerimaan]);

  const handleBuatSurat = (id) => {
    const selectedData = dataPeringatan.find((item) => item.id === id);
    setSelectedDataPeringatan(selectedData);
    setIsModalOpen(true);
  };

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
        : "Pilih tanggal"}
    </button>
  ));

  // Persiapkan data untuk CSV export dengan struktur yang benar
  const getCSVData = () => {
    const data = activeTab === "DataPenerimaan" ? dataPenerimaan : dataPeringatan;
    console.log("Preparing CSV data for:", activeTab, data);
    
    return data.map(item => {
      // Sesuaikan struktur data untuk CSV
      return {
        nama: item.user?.nama || item.peserta?.nama || item.nama || "",
        sekolah: item.user?.sekolah || item.peserta?.sekolah || item.sekolah || "",
        jurusan: item.user?.jurusan || item.peserta?.jurusan || item.jurusan || "",
        tanggal_daftar: item.created_at || "",
        status: item.status || ""
      };
    });
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#1D2939]">
                Pendataan Admin
              </h2>
              <p className="text-[#667085] text-sm mt-1">
                Kelola pendataan dengan lebih fleksibel!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                customInput={<CustomButton />}
                dateFormat="dd MMMM yyyy"
                showPopperArrow={false}
              />
              <CSVLink
                data={getCSVData()}
                filename={`data_${activeTab}.csv`}
                headers={[
                  { label: "Nama", key: "nama" },
                  { label: "Sekolah", key: "sekolah" },
                  { label: "Jurusan", key: "jurusan" },
                  { label: "Tanggal Daftar", key: "tanggal_daftar" },
                  { label: "Status", key: "status" }
                ]}
              >
                <button className="flex items-center gap-2 border border-gray-300 text-[#344054] px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#0069AB] hover:text-white">
                  <Download size={16} />
                  Export
                </button>
              </CSVLink>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-2">
              {["DataPenerimaan", "DataPeringatan"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg text-sm border ${
                    activeTab === tab
                      ? "bg-[#0069AB] text-white"
                      : "border-gray-300 text-[#344054]"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "DataPenerimaan"
                    ? "Data Penerimaan"
                    : "Data Peringatan"}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Search size={16} />
                </span>
              </div>

              {activeTab === "DataPeringatan" && (
                <button
                  onClick={() => {
                    setSelectedDataPeringatan(null);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#0069AB] text-white rounded-lg text-sm shadow hover:bg-[#005185]"
                >
                  + Tambah Surat Peringatan
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 pt-0">
          {loading ? (
            <p>Loading...</p>
          ) : activeTab === "DataPenerimaan" ? (
            <>
              <p className="text-sm text-gray-500 mb-2">
                Total data penerimaan: {dataPenerimaan.length}
              </p>
              <DataPenerimaan
                data={dataPenerimaan}
                searchTerm={searchTerm}
                selectedDate={selectedDate}
                selectedJurusan={selectedJurusan}
              />
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-2">
                Total data peringatan: {dataPeringatan.length}
              </p>
              <DataPeringatan
                data={dataPeringatan}
                searchTerm={searchTerm}
                selectedDate={selectedDate}
                onBuatSurat={handleBuatSurat}
              />
            </>
          )}
        </div>
      </div>

      <WarningLetterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dataPeringatan={selectedDataPeringatan}
        onSucces={fetchData}
      />
    </div>
  );
}