import React, { useState } from 'react';
import { CalendarDays, Search, Download } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GantiModal from "../modal/GantiModal";
import { CSVLink } from "react-csv";

// CustomButton Component to be used for the DatePicker
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

export default function Surat() {
  const [activeTab, setActiveTab] = useState("DataPenerimaan");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  // State modal
  const [isGantiModalOpen, setIsGantiModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const dataPenerimaan = [
    {
      id: 1,
      nama: "Arya Pratama",
      sekolah: "SMK NEGERI 5 SURABAYA",
      jurusan: "Teknik Informatika",
      tanggalMulai: "2024-01-10",
      tanggalSelesai: "2024-06-10",
      email: "arya.pratama@example.com",
      image: "/assets/img/post1.png",
    },
    {
      id: 2,
      nama: "Dewi Lestari",
      sekolah: "SMK PGRI 2 JEMBER",
      jurusan: "Teknik Informatika",
      tanggalMulai: "2024-01-12",
      tanggalSelesai: "2024-06-12",
      email: "dewi.lestari@example.com",
      image: "/assets/img/post2.png",
    },
    // ... data lainnya
  ];

  // Fungsi untuk membuka modal Tempatkan
  const handlePlace = (item) => {
    setSelectedItem(item);
    setIsTempatkanModalOpen(true);
  };

  // Fungsi untuk membuka modal Ganti
  const handleChange = (item) => {
    setSelectedItem(item);
    setIsGantiModalOpen(true);
  };

  // Fungsi untuk menangani simpan data Tempatkan
  const handleSimpanTempatkan = (formData) => {
    console.log("Tempatkan data:", formData);
    // Tambahkan logika untuk menyimpan data
  };

  // Fungsi untuk menangani simpan data Ganti
  const handleSimpanGanti = (formData) => {
    console.log("Ganti data:", formData);
    // Tambahkan logika untuk menyimpan data
  };

  const filteredData = dataPenerimaan.filter((item) => {
    const isMatchSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());

    const isMatchDate = selectedDate
      ? new Date(item.tanggalMulai).toLocaleDateString() ===
        selectedDate.toLocaleDateString()
      : true;

    return isMatchSearch && isMatchDate;
  });

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6">
          {/* Header bagian */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-[#1D2939]">Pendataan Admin</h2>
              <p className="text-[#667085] text-xs mt-1">Kelola pendataan dengan lebih fleksibel!</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Tanggal picker */}
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                customInput={<CustomButton value={selectedDate} />}
                dateFormat="dd MMMM yyyy"
                showPopperArrow={false}
              />
              {/* Export CSV */}
              <CSVLink
                data={dataPenerimaan}
                filename={`data_penerimaan.csv`}
                headers={[
                  { label: "Nama", key: "nama" },
                  { label: "Sekolah", key: "sekolah" },
                  { label: "Jurusan", key: "jurusan" },
                  { label: "Tanggal Mulai", key: "tanggalMulai" },
                  { label: "Tanggal Selesai", key: "tanggalSelesai" },
                  { label: "Email", key: "email" },
                ]}
              >
                <button className="flex items-center gap-2 border border-gray-300 text-[#344054] px-4 py-2 rounded-lg text-xs hover:bg-[#0069AB] hover:text-white">
                  <Download size={16} />
                  Export
                </button>
              </CSVLink>
            </div>
          </div>

          <div className="border-b border-gray-200 my-5" />

          {/* Search bar */}
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 text-xs border border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Search size={16} />
              </span>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-xs">
            <thead className="bg-[#F9FAFB] text-[#667085] border-t border-gray-200">
              <tr>
                <th className="px-3 py-3 text-center font-medium" style={{ width: '50px' }}>No</th>
                <th className="px-3 py-3 text-center font-medium" style={{ width: '200px' }}>Foto & Nama Lengkap</th>
                <th className="px-3 py-3 text-center font-medium">Sekolah</th>
                <th className="px-3 py-3 text-center font-medium" style={{ width: '120px' }}>Tanggal Mulai</th>
                <th className="px-3 py-3 text-center font-medium" style={{ width: '125px' }}>Tanggal Selesai</th>
                <th className="px-3 py-3 text-center font-medium">Email</th>
                <th className="px-3 py-3 text-center font-medium">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50 text-center">
                  <td className="px-3 py-3" style={{ width: '50px' }}>{index + 1}</td>
                  <td className="px-3 py-3 flex justify-start items-center gap-3">
                    <img src={item.image} alt={item.nama} className="w-10 h-10 rounded-full object-cover" />
                    <span>{item.nama}</span>
                  </td>
                  <td className="px-3 py-3">{item.sekolah}</td>
                  <td className="px-3 py-3" style={{ width: '120px' }}>{item.tanggalMulai}</td>
                  <td className="px-3 py-3" style={{ width: '120px' }}>{item.tanggalSelesai}</td>
                  <td className="px-3 py-3">{item.email}</td>
                  <td className="px-3 py-3 flex justify-center gap-3">                    
                    {/* Tombol Ganti */}
                    <button
                      onClick={() => handleChange(item)}  // Memanggil modal Ganti
                      className="text-blue-500 hover:text-blue-700 py-1 px-3 border border-blue-500 rounded-md text-sm"
                    >
                      Ganti
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal Ganti */}
      <GantiModal
        isOpen={isGantiModalOpen}
        onClose={() => setIsGantiModalOpen(false)}
        onSimpan={handleSimpanGanti}
        data={selectedItem}
      />
    </div>
  );
}
