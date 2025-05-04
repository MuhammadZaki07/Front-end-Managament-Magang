import React, { useState, useEffect } from "react";
import { CalendarDays, Download, Search, Filter } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import Jurnal from "./Jurnal";

export default function Pendataan() {
  const [searchSchool, setSearchSchool] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState(""); // "" means all statuses
  const [filteredData, setFilteredData] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const dataJurnal = [
    {
      id: 1,
      nama: "Arya Pratama",
      sekolah: "SMK NEGERI 5 SURABAYA",
      tanggal: "2025-04-15",
      deskripsi: "Mengembangkan halaman landing page menggunakan HTML, Tailwind CSS, dan JavaScript.",
      status: "Mengisi",
      image: "/assets/img/post1.png",
      buktiJurnal: "/berkas/izin/izin.jpg"
    },
    {
      id: 2,
      nama: "Dewi Lestari",
      sekolah: "SMK PGRI 2 JEMBER",
      tanggal: "2025-04-14",
      deskripsi: "Membuat konten sosial media untuk promosi produk menggunakan Canva dan CapCut.",
      status: "Mengisi",
      image: "/assets/img/post2.png",
      buktiJurnal: "/berkas/izin/izin2.jpg"
    },
    {
      id: 3,
      nama: "Budi Santoso",
      sekolah: "SMK NEGERI 1 MALANG",
      tanggal: "2025-04-13",
      deskripsi: "-",
      status: "Tidak Mengisi",
      image: "/assets/img/post1.png",
      buktiJurnal: ""
    },
    {
      id: 4,
      nama: "Siti Nurhaliza",
      sekolah: "SMK MUHAMMADIYAH 1 KEDIRI",
      tanggal: "2025-04-12",
      deskripsi: "-",
      status: "Tidak Mengisi",
      image: "/assets/img/post2.png",
      buktiJurnal: ""
    },
    {
      id: 5,
      nama: "Rizky Aditya",
      sekolah: "SMK NEGERI 3 PASURUAN",
      tanggal: "2025-04-11",
      deskripsi: "-",
      status: "Tidak Mengisi",
      image: "/assets/img/post1.png",
      buktiJurnal: ""
    },
    {
      id: 6,
      nama: "Intan Permata",
      sekolah: "SMK YPM 4 TAMAN",
      tanggal: "2025-04-10",
      deskripsi: "Membuat wireframe website company profile menggunakan Figma.",
      status: "Mengisi",
      image: "/assets/img/post2.png",
      buktiJurnal: "/berkas/izin/izin6.jpg"
    },
    {
      id: 7,
      nama: "Gilang Maulana",
      sekolah: "SMK NEGERI 2 TULUNGAGUNG",
      tanggal: "2025-04-09",
      deskripsi: "-",
      status: "Tidak Mengisi",
      image: "/assets/img/post1.png",
      buktiJurnal: ""
    },
    {
      id: 8,
      nama: "Nadya Rahma",
      sekolah: "SMK PGRI 1 MOJOKERTO",
      tanggal: "2025-04-08",
      deskripsi: "-",
      status: "Tidak Mengisi",
      image: "/assets/img/post2.png",
      buktiJurnal: ""
    },
    {
      id: 9,
      nama: "Fajar Nugroho",
      sekolah: "SMK NEGERI 2 BLITAR",
      tanggal: "2025-04-07",
      deskripsi: "Membuat halaman profil pengguna dan fitur edit data menggunakan React dan Laravel.",
      status: "Mengisi",
      image: "/assets/img/post1.png",
      buktiJurnal: "/berkas/izin/izin1.jpg"
    },
    {
      id: 10,
      nama: "Putri Ayu",
      sekolah: "SMK NEGERI 1 SIDOARJO",
      tanggal: "2025-04-06",
      deskripsi: "Mendesain logo brand lokal untuk UMKM menggunakan Adobe Photoshop.",
      status: "Mengisi",
      image: "/assets/img/post2.png",
      buktiJurnal: "/berkas/izin/izin2.jpg"
    }
  ];

  // Initialize filteredData with all data on component mount
  useEffect(() => {
    setFilteredData(dataJurnal);
  }, []);

  // Filter data automatically when search term, date or status changes
  useEffect(() => {
    const filtered = dataJurnal.filter(item => {
      // Filter by school name
      const schoolMatch = item.sekolah.toLowerCase().includes(searchSchool.toLowerCase());
      
      // Filter by status
      const statusMatch = statusFilter === "" || item.status === statusFilter;
      
      // Filter by date
      let dateMatch = true;
      if (selectedDate) {
        const itemDate = new Date(item.tanggal);
        const filterDate = new Date(selectedDate);
        dateMatch = itemDate.getFullYear() === filterDate.getFullYear() &&
                   itemDate.getMonth() === filterDate.getMonth() &&
                   itemDate.getDate() === filterDate.getDate();
      }
      
      return schoolMatch && statusMatch && dateMatch;
    });
    
    setFilteredData(filtered);
  }, [searchSchool, selectedDate, statusFilter, dataJurnal]);

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

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-[#1D2939]">Jurnal Peserta</h2>
              <p className="text-[#667085] text-sm mt-1">Kelola jurnal peserta magang dengan lebih fleksibel!</p>
            </div>

            <div className="flex items-center gap-3">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                customInput={<CustomButton />}
                dateFormat="dd MMMM yyyy"
                showPopperArrow={false}
                isClearable={true}
              />
              <CSVLink
                data={filteredData.length > 0 ? filteredData : dataJurnal}
                filename="data_jurnal.csv"
                headers={[
                  { label: "Nama", key: "nama" },
                  { label: "Sekolah", key: "sekolah" },
                  { label: "Tanggal", key: "tanggal" },
                  { label: "Deskripsi", key: "deskripsi" },
                  { label: "Status Jurnal", key: "status" },
                ]}
              >
                <button className="flex items-center gap-2 border border-gray-300 text-[#344054] px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#0069AB] hover:text-white">
                  <Download size={16} />
                  Export
                </button>
              </CSVLink>
              
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className={`flex items-center gap-2 border ${showFilters ? 'bg-[#0069AB] text-white' : 'border-gray-300 text-[#344054]'} px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#0069AB] hover:text-white`}
              >
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200 my-5" />

          {/* Filter section - only visible when showFilters is true */}
          {showFilters && (
            <div className="flex justify-end items-center gap-3 mt-2 animate-fadeIn">
              {/* School Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari Sekolah..."
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm"
                  value={searchSchool}
                  onChange={(e) => setSearchSchool(e.target.value)}
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Search size={16} />
                </span>
              </div>
              
              {/* Status Filter Dropdown */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg shadow-sm text-sm px-4 py-2 text-gray-700"
                >
                  <option value="">Semua Status</option>
                  <option value="Mengisi">Mengisi</option>
                  <option value="Tidak Mengisi">Tidak Mengisi</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <Jurnal 
          data={filteredData} 
        />
      </div>
      
      {/* Add this style for animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}