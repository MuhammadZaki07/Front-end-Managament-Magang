import React, { useState, useEffect } from "react";
import { CalendarDays, Search, Filter } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TablePendaftaran from "./TablePeserta";

export default function ApprovalTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDivisi, setSelectedDivisi] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // For dynamic dropdown options
  const [divisiOptions, setDivisiOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  const dataPendaftaran = [
    {
      id: 1,
      namaLengkap: "Jane Cooper",
      email: "Contoh@gmail.com",
      statusMagang: "Peserta Aktif",
      sekolah: "SMKN 12 Tulungagung",
      divisi: "UI/UX Designer",
      image: "/assets/img/post1.png",
    },
    {
      id: 2,
      namaLengkap: "Arya Pratama",
      email: "arya.pratama@gmail.com",
      statusMagang: "Alumni",
      sekolah: "SMK NEGERI 5 SURABAYA",
      divisi: "Mechanical Engineer",
      image: "/assets/img/post1.png",
    },
    {
      id: 3,
      namaLengkap: "Budi Santoso",
      email: "budi.santoso@gmail.com",
      statusMagang: "Peserta Aktif",
      sekolah: "SMK NEGERI 7 MALANG",
      divisi: "Elektronika Engineer",
      image: "/assets/img/post1.png",
    },
    {
      id: 4,
      namaLengkap: "Cynthia Riana",
      email: "cynthia.riana@gmail.com",
      statusMagang: "Peserta Aktif",
      sekolah: "SMK NEGERI 4 JEMBER",
      divisi: "Software Developer",
      image: "/assets/img/post1.png",
    },
    // Tambahkan data lainnya di sini
  ];

  // Extract unique options from data on component mount
  useEffect(() => {
    // Get unique divisi values
    const uniqueDivisi = [...new Set(dataPendaftaran.map((item) => item.divisi))];
    setDivisiOptions(uniqueDivisi);

    // Get unique status values
    const uniqueStatus = [...new Set(dataPendaftaran.map((item) => item.statusMagang))];
    setStatusOptions(uniqueStatus);
  }, []);

  const CustomButton = React.forwardRef(({ value, onClick }, ref) => (
    <button className="flex items-center gap-2 bg-white border-gray-200 text-[#344054] py-2 px-4 rounded-md shadow border border-[#667797] hover:bg-[#0069AB] hover:text-white text-sm" onClick={onClick} ref={ref} type="button">
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
              <h2 className="text-xl font-semibold text-[#1D2939]">Peserta Magang</h2>
            </div>

            <div className="flex items-center gap-3">
              <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} customInput={<CustomButton />} dateFormat="dd MMMM yyyy" showPopperArrow={false} />
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 border border-gray-300 text-[#344054] px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#0069AB] hover:text-white">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200 my-5" />

          {/* Form Filter - tanpa label dan urutan: search, divisi, status magang */}
          {showFilters && (
            <div className="flex gap-4 justify-end">
              {/* Search Input */}
              <div className="w-52 relative">
                <input type="text" placeholder="Cari Nama / Email" className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <span className="absolute left-3 top-[9px] text-gray-400">
                  <Search size={16} />
                </span>
              </div>

              {/* Divisi Dropdown - Dynamic Options */}
              <div className="w-44">
                <select className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm shadow-sm" value={selectedDivisi} onChange={(e) => setSelectedDivisi(e.target.value)}>
                  <option value="">Semua Divisi</option>
                  {divisiOptions.map((divisi, index) => (
                    <option key={index} value={divisi}>
                      {divisi}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Magang Dropdown - Dynamic Options */}
              <div className="w-44">
                <select className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm shadow-sm" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                  <option value="">Semua Status</option>
                  {statusOptions.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <TablePendaftaran data={dataPendaftaran} searchTerm={searchTerm} selectedDate={selectedDate} selectedDivisi={selectedDivisi} selectedStatus={selectedStatus} />
      </div>
    </div>
  );
}
