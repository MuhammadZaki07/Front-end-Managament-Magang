import React, { useState, useEffect } from "react";
import { CalendarDays, Search, Filter } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TablePerusahaan from "./TablePerusahaan";

export default function ApprovalTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dataPerusahaan, setDataPerusahaan] = useState([]);

  useEffect(() => {
    // Data dummy untuk perusahaan
    const dummyPeserta = [
      {
        id: 1,
        nama: "PT. HUMMA TEKNOLOGI INDONESIA",
        lokasi: "Malang, Jawa Timur",
        jml_cabang: "12",
        jml_peserta: "300",
        img: "/assets/img/Profil.png",
        tanggal_daftar: "2024-01-15"
      },
      {
        id: 2,
        nama: "PT. INDOSAT OOREDOO HUTCHISON",
        lokasi: "Jakarta, DKI Jakarta",
        jml_cabang: "8",
        jml_peserta: "150",
        img: "/assets/img/Profil.png",
        tanggal_daftar: "2024-02-10"
      },
      {
        id: 3,
        nama: "PT. BANK CENTRAL ASIA TBK",
        lokasi: "Surabaya, Jawa Timur",
        jml_cabang: "25",
        jml_peserta: "500",
        img: "/assets/img/Profil.png",
        tanggal_daftar: "2024-01-20"
      },
      {
        id: 4,
        nama: "PT. TELKOM INDONESIA PERSERO",
        lokasi: "Bandung, Jawa Barat",
        jml_cabang: "15",
        jml_peserta: "250",
        img: "/assets/img/Profil.png",
        tanggal_daftar: "2024-03-05"
      },
    ];

    setDataPerusahaan(dummyPeserta);
  }, []);

  const CustomButton = React.forwardRef(({ value, onClick }, ref) => (
    <button
      className="flex items-center gap-2 bg-white border-gray-200 text-[#344054] py-2 px-4 rounded-md shadow border hover:bg-[#0069AB] hover:text-white text-sm"
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
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-[#1D2939]">
              Perusahaan Mitra
            </h2>

            <div className="flex items-center gap-3">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                customInput={<CustomButton />}
                dateFormat="dd MMMM yyyy"
                showPopperArrow={false}
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 border border-gray-300 text-[#344054] px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#0069AB] hover:text-white"
              >
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200 my-5" />

          {showFilters && (
            <div className="flex gap-4 justify-end">
              <div className="w-52 relative">
                <input
                  type="text"
                  placeholder="Cari Nama Perusahaan"
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-3 top-[9px] text-gray-400">
                  <Search size={16} />
                </span>
              </div>
            </div>
          )}
        </div>

        <TablePerusahaan
          data={dataPerusahaan}
          searchTerm={searchTerm}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
}