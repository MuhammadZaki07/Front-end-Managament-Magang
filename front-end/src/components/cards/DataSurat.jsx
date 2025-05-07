import React, { useState } from "react";
import { CalendarDays, Download, Search, Filter, FileText, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import DataPenerimaan from "./DataPenerimaan";
import DataPeringatan from "./DataPeringatan";

// New Modal Component for Warning Letter
const WarningLetterModal = ({ isOpen, onClose, dataPeringatan }) => {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentSchool, setStudentSchool] = useState("");
  const [spLevel, setSpLevel] = useState("SP 1");
  const [letterDate, setLetterDate] = useState(new Date());
  const [reason, setReason] = useState("");

  // Find student's school when they are selected
  const handleStudentChange = (e) => {
    const selectedName = e.target.value;
    setSelectedStudent(selectedName);

    // Find the student in dataPeringatan and get their school
    const student = dataPeringatan.find((student) => student.nama === selectedName);
    if (student) {
      setStudentSchool(student.sekolah);
    } else {
      setStudentSchool("");
    }
  };

  const handleSubmit = () => {
    // Create the warning letter with the form data
    console.log({
      student: selectedStudent,
      school: studentSchool,
      spLevel,
      date: letterDate,
      reason,
    });

    // Reset form and close modal
    setSelectedStudent("");
    setStudentSchool("");
    setSpLevel("SP 1");
    setLetterDate(new Date());
    setReason("");
    onClose();
  };

  // Date picker custom input
  const CustomDateButton = React.forwardRef(({ value, onClick }, ref) => (
    <button className="flex items-center gap-2 bg-white border border-gray-300 text-[#344054] py-2 px-3 rounded-md hover:bg-gray-50 text-sm w-full" onClick={onClick} ref={ref} type="button">
      <CalendarDays size={16} />
      {value ? value : "Pilih tanggal"}
    </button>
  ));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#1D2939]">Buat Surat Peringatan</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <select value={selectedStudent} onChange={handleStudentChange} className="w-full border border-gray-300 rounded-md p-2 text-sm">
              <option value="">Pilih Siswa</option>
              {dataPeringatan.map((student) => (
                <option key={student.id} value={student.nama}>
                  {student.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sekolah</label>
            <input type="text" value={studentSchool} className="w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-50" readOnly />
          </div>

          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat SP</label>
              <select value={spLevel} onChange={(e) => setSpLevel(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm">
                <option value="SP 1">SP 1</option>
                <option value="SP 2">SP 2</option>
                <option value="SP 3">SP 3</option>
              </select>
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <DatePicker selected={letterDate} onChange={(date) => setLetterDate(date)} customInput={<CustomDateButton />} dateFormat="dd/MM/yyyy" />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Alasan</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm min-h-24" placeholder="Masukkan alasan peringatan..." />
          </div>

          <div className="flex justify-end">
            <button onClick={onClose} className="mr-2 px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Batal
            </button>
            <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-[#0069AB] text-white rounded-lg hover:bg-blue-700">
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Surat() {
  const [activeTab, setActiveTab] = useState("DataPenerimaan");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedJurusan, setSelectedJurusan] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    {
      id: 3,
      nama: "Elisa Fitriana",
      sekolah: "SMK Negeri 4 Bojonegoro",
      jurusan: "Rekayasa Perangkat Lunak",
      tanggalDaftar: "2024-01-12",
      tanggalDiterima: "2024-01-20",
      image: "/assets/img/post2.png",
    },
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
  ];

  // Extract unique jurusan options from dataPenerimaan
  const jurusanOptions = [...new Set(dataPenerimaan.map((item) => item.jurusan))];

  const handleBuatSurat = (id) => {
    setIsModalOpen(true);
    console.log(`Membuka modal surat untuk data dengan ID: ${id}`);
  };

  const CustomButton = React.forwardRef(({ value, onClick }, ref) => (
    <button className="flex items-center gap-2 bg-white border-gray-200 text-[#344054] py-2 px-4 rounded-md shadow border border-[#667797] hover:bg-[#0069AB] hover:text-white text-sm" onClick={onClick} ref={ref} type="button">
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

  // Handler untuk pencarian - memastikan searchTerm diperbarui dengan benar
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    console.log("Search term updated:", value); // Untuk debugging
  };

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
              <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} customInput={<CustomButton />} dateFormat="dd MMMM yyyy" showPopperArrow={false} />
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
              <button className={`px-4 py-2 rounded-lg text-sm border ${activeTab === "DataPenerimaan" ? "bg-[#0069AB] text-white" : "border-gray-300 text-[#344054]"}`} onClick={() => setActiveTab("DataPenerimaan")}>
                Data Penerimaan
              </button>
              <button className={`px-4 py-2 rounded-lg text-sm border ${activeTab === "DataPeringatan" ? "bg-[#0069AB] text-white" : "border-gray-300 text-[#344054]"}`} onClick={() => setActiveTab("DataPeringatan")}>
                Data Peringatan
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Search size={16} />
                </span>
              </div>

              {activeTab === "DataPenerimaan" ? (
                <div className="relative">
                  <select 
                    className="w-46 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg appearance-none" 
                    value={selectedJurusan} 
                    onChange={(e) => setSelectedJurusan(e.target.value)}
                  >
                    <option value="">Semua Jurusan</option>
                    {jurusanOptions.map((jurusan, index) => (
                      <option key={index} value={jurusan}>
                        {jurusan}
                      </option>
                    ))}
                  </select>
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <Filter size={16} />
                  </span>
                </div>
              ) : (
                <button 
                  className="flex items-center gap-2 bg-white text-black px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-[#0069AB] hover:text-white" 
                  onClick={() => handleBuatSurat()}
                >
                  <FileText size={16} />
                  Buat Surat
                </button>
              )}
            </div>
          </div>
        </div>

        {activeTab === "DataPenerimaan" ? (
          <DataPenerimaan data={dataPenerimaan} searchTerm={searchTerm} selectedDate={selectedDate} selectedJurusan={selectedJurusan} />
        ) : (
          <DataPeringatan data={dataPeringatan} searchTerm={searchTerm} selectedDate={selectedDate} onBuatSurat={handleBuatSurat} />
        )}
      </div>

      {/* Warning Letter Modal */}
      <WarningLetterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} dataPeringatan={dataPeringatan} />
    </div>
  );
}