import React, { useState } from "react";
import { CalendarDays, Download, Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import DataPenerimaan from "./DataPenerimaan";
import DataPeringatan from "./DataPeringatan";

export default function Surat() {
  const [activeTab, setActiveTab] = useState("DataPenerimaan");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const dataPenerimaan = [
    {
      id: 1,
      nama: "Arya Pratama",
      sekolah: "SMK NEGERI 5 SURABAYA",
      jurusan: "Teknik Informatika",
      tanggalDaftar: "2024-01-10",
      tanggalDiterima: "2024-01-15",
      image: "/assets/img/post1.png",
    },
    {
      id: 2,
      nama: "Dewi Lestari",
      sekolah: "SMK PGRI 2 JEMBER",
      jurusan: "Teknik Informatika",
      tanggalDaftar: "2024-01-12",
      tanggalDiterima: "2024-01-20",
      image: "/assets/img/post2.png",
    },
    // ... tambahkan data lainnya sesuai kebutuhan
  ];

  const dataPeringatan = [
    {
      id: 1,
      nama: "Dewi Anggraini",
      sekolah: "SMK PGRI 2 JEMBER",
      keteranganSP: "Terlambat lebih dari 10 menit",
      statusSP: "SP 1",
      tanggal: "2024-01-15",
      image: "/assets/img/post2.png",
    },
    {
      id: 2,
      nama: "Rizki Ananda",
      sekolah: "SMK NEGERI 5 SURABAYA",
      keteranganSP: "Tidak masuk tanpa izin",
      statusSP: "SP 2",
      tanggal: "2024-01-18",
      image: "/assets/img/post1.png",
    },
    // Tambahkan data lainnya sesuai kebutuhan
  ];

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
        : "Pilih tanggal"}
    </button>
  ));

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-[#1D2939]">Pendataan Admin</h2>
              <p className="text-[#667085] text-sm mt-1">Kelola pendataan dengan lebih fleksibel!</p>
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
                data={activeTab === "DataPenerimaan" ? dataPenerimaan : dataPeringatan}
                filename={`data_${activeTab}.csv`}
                headers={
                  activeTab === "DataPenerimaan"
                    ? [
                        { label: "Nama", key: "nama" },
                        { label: "Sekolah", key: "sekolah" },
                        { label: "Jurusan", key: "jurusan" },
                        { label: "Tanggal Daftar", key: "tanggalDaftar" },
                        { label: "Tanggal Diterima", key: "tanggalDiterima" },
                      ]
                    : [
                      { label: "Nama", key: "nama" },
                      { label: "Sekolah", key: "sekolah" },
                      { label: "Keterangan SP", key: "keteranganSP" },
                      { label: "Status SP", key: "statusSP" },
                      { label: "Tanggal", key: "tanggal" },
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
                  activeTab === "DataPenerimaan" ? "bg-[#0069AB] text-white" : "border-gray-300 text-[#344054]"
                }`}
                onClick={() => setActiveTab("DataPenerimaan")}
              >
                Data Penerimaan
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm border ${
                  activeTab === "DataPeringatan" ? "bg-[#0069AB] text-white" : "border-gray-300 text-[#344054]"
                }`}
                onClick={() => setActiveTab("DataPeringatan")}
              >
                Data Peringatan
              </button>
            </div>

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

        {activeTab === "DataPenerimaan" ? (
          <DataPenerimaan
            data={dataPenerimaan}
            searchTerm={searchTerm}
            selectedDate={selectedDate}
          />
        ) : (
          <DataPeringatan
            data={dataPeringatan}
            searchTerm={searchTerm}
            selectedDate={selectedDate}
          />
        )}
      </div>
    </div>
  );
}
