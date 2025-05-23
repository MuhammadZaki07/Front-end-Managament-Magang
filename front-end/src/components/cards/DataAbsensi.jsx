import React, { useState, useEffect } from "react";
import { CalendarDays, Download, Search, CheckCircle, Clock, FileText, AlertTriangle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import axios from "axios";
import Swal from "sweetalert2";

export default function AbsensiTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Get token from localStorage or props (adjust based on your auth implementation)
  const token = localStorage.getItem("token"); // Adjust this based on your auth implementation

  const fetchAbsensi = async () => {
    try {
      Swal.fire({
        title: 'Memuat data...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      setLoading(true);
      
      // First, get kehadiran data (replace URL with actual endpoint)
      const kehadiranResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/kehadiran-peserta-cabang`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Kehadiran response:", kehadiranResponse.data);
      
      // Alternative: If both data come from single API endpoint
      // If the API you showed (/kehadiran-peserta-cabang) returns both kehadiran and absensi
      const responseData = kehadiranResponse.data.data || [];
      
      let combinedData = [];
      
      responseData.forEach(peserta => {
        // Process kehadiran
        if (peserta.kehadiran && Array.isArray(peserta.kehadiran)) {
          peserta.kehadiran.forEach(item => {
            combinedData.push({
              id: `kehadiran-${item.id}`,
              tanggal: item.tanggal,
              jam_masuk: item.jam_masuk || "-",
              jam_istirahat: item.jam_istirahat || "-",
              jam_kembali: item.jam_kembali || "-",
              jam_pulang: item.jam_pulang || "-",
              metode: item.metode || "-",
              status: item.status_kehadiran === 0 ? "Hadir" : "Terlambat",
              status_kehadiran: item.status_kehadiran === 0 ? "Hadir" : "Terlambat",
              nama: peserta.nama || "Unknown",
              image: peserta.foto?.find(f => f.type === 'profile')?.path 
                ? `${import.meta.env.VITE_API_URL_FILE}/storage/${peserta.foto.find(f => f.type === 'profile').path}`
                : "/api/placeholder/40/40"
            });
          });
        }
        
        // Process absensi
        if (peserta.absensi && Array.isArray(peserta.absensi)) {
          peserta.absensi.forEach(item => {
            combinedData.push({
              id: `absensi-${item.id}`,
              tanggal: item.tanggal,
              jam_masuk: "-",
              jam_istirahat: "-",
              jam_kembali: "-",
              jam_pulang: "-",
              metode: "-",
              status: item.status === "sakit" ? "Sakit" : item.status === "izin" ? "Izin" : "Alpha",
              status_kehadiran: item.status,
              nama: peserta.nama || "Unknown",
              image: peserta.foto?.find(f => f.type === 'profile')?.path 
                ? `${import.meta.env.VITE_API_URL_FILE}/storage/${peserta.foto.find(f => f.type === 'profile').path}`
                : "/api/placeholder/40/40"
            });
          });
        }
      });
      
      // Sort data by date (newest first)
      combinedData.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
      
      console.log("Combined data:", combinedData);
      setData(combinedData);
      Swal.close();
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsensi();
  }, []);

  const CustomButton = React.forwardRef(({ value, onClick }, ref) => (
    <button
      className="flex items-center gap-2 bg-white border-gray-200 text-[#344054] py-2 px-4 rounded-md shadow border border-[#667797] hover:bg-[#0069AB] hover:text-white text-sm"
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

  // Count statistics
  const totalHadir = data.filter(item => item.status === "Hadir").length;
  const totalAlpha = data.filter(item => item.status === "Alpha").length;
  const totalIzinSakit = data.filter(item => item.status === "Izin" || item.status === "Sakit").length;
  const totalAbsensi = data.length;

  // Filter data based on search term and selected date
  const filteredData = data.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.metode.toLowerCase().includes(searchTerm.toLowerCase());
    
    // If no date is selected, show all entries
    if (!selectedDate) return matchesSearch;
    
    // Compare with actual date
    const itemDate = new Date(item.tanggal);
    const filterDate = new Date(selectedDate);
    const sameDate = itemDate.toDateString() === filterDate.toDateString();
    
    return matchesSearch && sameDate;
  });

  return (
    <div className="w-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Total Absensi Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 p-2 rounded-md">
              <Clock size={18} className="text-blue-600" />
            </span>
            <span className="font-semibold text-blue-600">{totalAbsensi} kali</span>
          </div>
          <p className="text-gray-500">Total Absensi</p>
          <div className="absolute bottom-0 right-0 left-0 h-1/3 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" className="h-full w-full">
              <path 
                d="M0,30 L3,28 L6,29 L9,26 L12,27 L15,25 L18,26 L21,24 L24,25 L27,22 L30,23 L33,21 L36,22 L39,20 L42,21 L45,18 L48,19 L51,16 L54,17 L57,14 L60,15 L63,12 L66,13 L69,10 L72,11 L75,8 L78,9 L81,6 L84,7 L87,4 L90,5 L93,2 L96,3 L100,0 L100,30 Z" 
                fill="url(#blue-gradient)" 
                strokeWidth="2"
                stroke="#3B82F6" 
              />
              <defs>
                <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#93C5FD" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Total Hadir Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-green-100 p-2 rounded-md">
              <CheckCircle size={18} className="text-green-600" />
            </span>
            <span className="font-semibold text-green-600">{totalHadir} kali</span>
          </div>
          <p className="text-gray-500">Total Hadir</p>
          <div className="absolute bottom-0 right-0 left-0 h-1/3 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" className="h-full w-full">
              <path 
                d="M0,30 L3,28 L6,29 L9,26 L12,27 L15,25 L18,26 L21,24 L24,25 L27,22 L30,23 L33,21 L36,22 L39,20 L42,21 L45,18 L48,19 L51,16 L54,17 L57,14 L60,15 L63,12 L66,13 L69,10 L72,11 L75,8 L78,9 L81,6 L84,7 L87,4 L90,5 L93,2 L96,3 L100,0 L100,30 Z" 
                fill="url(#green-gradient)" 
                strokeWidth="2"
                stroke="#10B981" 
              />
              <defs>
                <linearGradient id="green-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#6EE7B7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Total Izin/Sakit Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-100 p-2 rounded-md">
              <FileText size={18} className="text-amber-600" />
            </span>
            <span className="font-semibold text-amber-600">{totalIzinSakit} kali</span>
          </div>
          <p className="text-gray-500">Total Izin/Sakit</p>
          <div className="absolute bottom-0 right-0 left-0 h-1/3 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" className="h-full w-full">
              <path 
                d="M0,30 L3,28 L6,29 L9,26 L12,27 L15,25 L18,26 L21,24 L24,25 L27,22 L30,23 L33,21 L36,22 L39,20 L42,21 L45,18 L48,19 L51,16 L54,17 L57,14 L60,15 L63,12 L66,13 L69,10 L72,11 L75,8 L78,9 L81,6 L84,7 L87,4 L90,5 L93,2 L96,3 L100,0 L100,30 Z" 
                fill="url(#amber-gradient)" 
                strokeWidth="2"
                stroke="#F59E0B" 
              />
              <defs>
                <linearGradient id="amber-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#FCD34D" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Total Alpha Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-100 p-2 rounded-md">
              <AlertTriangle size={18} className="text-red-600" />
            </span>
            <span className="font-semibold text-red-600">{totalAlpha} kali</span>
          </div>
          <p className="text-gray-500">Total Alpa</p>
          <div className="absolute bottom-0 right-0 left-0 h-1/3 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" className="h-full w-full">
              <path 
                d="M0,30 L3,28 L6,29 L9,26 L12,27 L15,25 L18,26 L21,24 L24,25 L27,22 L30,23 L33,21 L36,22 L39,20 L42,21 L45,18 L48,19 L51,16 L54,17 L57,14 L60,15 L63,12 L66,13 L69,10 L72,11 L75,8 L78,9 L81,6 L84,7 L87,4 L90,5 L93,2 L96,3 L100,0 L100,30 Z" 
                fill="url(#red-gradient)" 
                strokeWidth="2"
                stroke="#EF4444" 
              />
              <defs>
                <linearGradient id="red-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#FCA5A5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-[#1D2939]">Data Absensi</h2>
              <p className="text-[#667085] text-sm mt-1">Kelola data absensi dengan lebih fleksibel!</p>
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
                data={filteredData}
                filename="data_absensi.csv"
                headers={[
                  { label: "Nama", key: "nama" },
                  { label: "Tanggal", key: "tanggal" },
                  { label: "Jam Masuk", key: "jam_masuk" },
                  { label: "Istirahat", key: "jam_istirahat" },
                  { label: "Kembali", key: "jam_kembali" },
                  { label: "Pulang", key: "jam_pulang" },
                  { label: "Metode", key: "metode" },
                  { label: "Status", key: "status" },
                ]}
              >
                <button className="flex items-center gap-2 border border-gray-300 text-[#344054] px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#0069AB] hover:text-white">
                  <Download size={16} />
                  Export
                </button>
              </CSVLink>
            </div>
          </div>

          <div className="border-b border-gray-200 my-5" />

          <div className="flex justify-end items-center">
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

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Siswa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jam Masuk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Istirahat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kembali
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pulang
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={item.image}
                            alt={item.nama}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.nama}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.jam_masuk}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.jam_istirahat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.jam_kembali}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.jam_pulang}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.metode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === "Hadir"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Terlambat"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === "Izin" || item.status === "Sakit"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Empty state */}
        {!loading && filteredData.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No data found</p>
          </div>
        )}
        
        {/* Information about total rows */}
        <div className="bg-white px-4 py-3 flex items-center border-t border-gray-200 sm:px-6">
          <div>
            <p className="text-sm text-gray-700">
              Menampilkan <span className="font-medium">{filteredData.length}</span> data dari total <span className="font-medium">{data.length}</span> data absensi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}