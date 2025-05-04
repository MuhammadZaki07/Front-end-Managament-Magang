import React, { useState } from "react";
import { CalendarDays, Download, Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import TablePendaftaran from "./TablePendaftaran";
import TableIzin from "./TableIzin";

export default function ApprovalTable() {
  const [activeTab, setActiveTab] = useState("pendaftaran");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const dataPendaftaran = [
    {
      id: 1,
      nama: "Arya Pratama",
      jurusan: "Teknik Mesin",
      kelas: "11",
      masaMagang: "15 Februari 2025",
      sekolah: "SMK NEGERI 5 SURABAYA",
      image: "/assets/img/post1.png",
      berkas: [
        { nama: "CV.jpg", url: "/assets/berkas/CV.jpg" },
        { nama: "Foto.jpg", url: "/assets/berkas/Foto.jpg" },
        { nama: "Ijazah.docx", url: "/assets/berkas/Ijazah.docx" },
        { nama: "ppp.docx", url: "/assets/berkas/ppp.docx" },
      ],
    },
    {
      id: 2,
      nama: "Budi Santoso",
      jurusan: "Teknik Elektronika",
      kelas: "12",
      masaMagang: "1 Maret 2025",
      sekolah: "SMK NEGERI 7 MALANG",
      image: "/assets/img/post2.png",
      berkas: [
        { nama: "CV.pdf", url: "/assets/berkas/CV.pdf" },
        { nama: "Foto.jpg", url: "/assets/berkas/Foto.jpg" },
        { nama: "Ijazah.pdf", url: "/assets/berkas/Ijazah.pdf" },
      ],
    },
    {
      id: 3,
      nama: "Cynthia Riana",
      jurusan: "Teknik Komputer",
      kelas: "11",
      masaMagang: "20 Februari 2025",
      sekolah: "SMK NEGERI 4 JEMBER",
      image: "/assets/img/post1.png",
      berkas: [
        { nama: "CV.docx", url: "/assets/berkas/CV.docx" },
        { nama: "Foto.png", url: "/assets/berkas/Foto.png" },
        { nama: "Ijazah.docx", url: "/assets/berkas/Ijazah.docx" },
      ],
    },
    // Tambahkan data lainnya di sini
  ];

  const dataIzin = [
    {
      id: 1,
      nama: "Dewi Anggraini",
      sekolah: "SMK NEGERI 1 MALANG",
      tanggalIzin: "10 April 2025",
      tanggalKembali: "12 April 2025",
      status: "Izin",
      image: "/assets/img/post1.png", // Gambar profil
      buktiKegiatan: "/berkas/izin/izin.jpg", // Gambar bukti kegiatan
    },
    {
      id: 2,
      nama: "Rizki Ananda",
      sekolah: "SMK NEGERI 2 BLITAR",
      tanggalIzin: "8 April 2025",
      tanggalKembali: "10 April 2025",
      status: "Sakit",
      image: "/assets/img/post2.png",
    },
    {
      id: 3,
      nama: "Agus Setiawan",
      sekolah: "SMK NEGERI 3 YOGYAKARTA",
      tanggalIzin: "5 April 2025",
      tanggalKembali: "7 April 2025",
      status: "Izin",
      image: "/assets/img/post1.png",
      buktiKegiatan: "/berkas/izin/izin2.jpg",
    },
    {
      id: 4,
      nama: "Siti Nurhayati",
      sekolah: "SMK NEGERI 4 SURABAYA",
      tanggalIzin: "3 April 2025",
      tanggalKembali: "6 April 2025",
      status: "Sakit",
      image: "/assets/img/post2.png",
      buktiKegiatan: "/berkas/izin/izin2.jpg",
    },
    // Tambahkan data lainnya di sini
  ];

  const CustomButton = React.forwardRef(({ value, onClick }, ref) => (
    <button className="flex items-center gap-2 bg-white text-[#344054] py-2 px-4 rounded-md shadow border border-[#667797] hover:bg-[#0069AB] hover:text-white text-sm" onClick={onClick} ref={ref} type="button">
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
              <h2 className="text-xl font-semibold text-[#1D2939]">Data Approval</h2>
              <p className="text-[#667085] text-sm mt-1">Kelola data penerimaan dengan maksimal!</p>
            </div>

            <div className="flex items-center gap-3">
              <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} customInput={<CustomButton />} dateFormat="dd MMMM yyyy" showPopperArrow={false} />
              <CSVLink
                data={activeTab === "pendaftaran" ? dataPendaftaran : dataIzin}
                filename={`data_${activeTab}.csv`}
                headers={
                  activeTab === "pendaftaran"
                    ? [
                        { label: "Nama", key: "nama" },
                        { label: "Jurusan", key: "jurusan" },
                        { label: "Kelas", key: "kelas" },
                        { label: "Masa Magang", key: "masaMagang" },
                        { label: "Sekolah", key: "sekolah" },
                      ]
                    : [
                        { label: "Nama", key: "nama" },
                        { label: "Sekolah", key: "sekolah" },
                        { label: "Tanggal Izin", key: "tanggalIzin" },
                        { label: "Tanggal Kembali", key: "tanggalKembali" },
                        { label: "Status", key: "status" },
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
              <button className={`px-4 py-2 rounded-lg text-sm border ${activeTab === "pendaftaran" ? "bg-[#0069AB] text-white" : "border-gray-300 text-[#344054]"}`} onClick={() => setActiveTab("pendaftaran")}>
                Pendaftaran
              </button>
              <button className={`px-4 py-2 rounded-lg text-sm border ${activeTab === "izin" ? "bg-[#0069AB] text-white" : "border-gray-300 text-[#344054]"}`} onClick={() => setActiveTab("izin")}>
                Izin/Sakit
              </button>
            </div>

            <div className="relative">
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Search size={16} />
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        {activeTab === "pendaftaran" ? <TablePendaftaran data={dataPendaftaran} searchTerm={searchTerm} selectedDate={selectedDate} /> : <TableIzin data={dataIzin} searchTerm={searchTerm} selectedDate={selectedDate} />}
      </div>
    </div>
  );
}
