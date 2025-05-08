import React, { useState } from "react";
import { CalendarDays, Download, Search, CheckCircle, XCircle, AlertTriangle, ChevronDown } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";

export default function ApprovalTable() {
  const [activeTab, setActiveTab] = useState("pendaftaran");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  
  // State for bulk actions
  const [selectedItems, setSelectedItems] = useState([]);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  
  // Original data
  const [dataPendaftaran, setDataPendaftaran] = useState([
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
      status: "pending"
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
      status: "pending"
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
      status: "pending"
    },
  ]);

  const [dataIzin, setDataIzin] = useState([
    {
      id: 1,
      nama: "Dewi Anggraini",
      sekolah: "SMK NEGERI 1 MALANG",
      tanggalIzin: "10 April 2025",
      tanggalKembali: "12 April 2025",
      status: "Izin",
      approvalStatus: "pending",
      image: "/assets/img/post1.png",
      buktiKegiatan: "/berkas/izin/izin.jpg",
    },
    {
      id: 2,
      nama: "Rizki Ananda",
      sekolah: "SMK NEGERI 2 BLITAR",
      tanggalIzin: "8 April 2025",
      tanggalKembali: "10 April 2025",
      status: "Sakit",
      approvalStatus: "pending",
      image: "/assets/img/post2.png",
    },
    {
      id: 3,
      nama: "Agus Setiawan",
      sekolah: "SMK NEGERI 3 YOGYAKARTA",
      tanggalIzin: "5 April 2025",
      tanggalKembali: "7 April 2025",
      status: "Izin",
      approvalStatus: "pending",
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
      approvalStatus: "pending",
      image: "/assets/img/post2.png",
      buktiKegiatan: "/berkas/izin/izin2.jpg",
    },
  ]);

  // Handle checkbox selection
  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    const currentData = activeTab === "pendaftaran" ? dataPendaftaran : dataIzin;
    
    if (selectedItems.length === currentData.length) {
      // If all are selected, unselect all
      setSelectedItems([]);
    } else {
      // Otherwise, select all
      setSelectedItems(currentData.map(item => item.id));
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    if (activeTab === "pendaftaran") {
      const updatedData = dataPendaftaran.map(item => {
        if (selectedItems.includes(item.id)) {
          return { ...item, status: action };
        }
        return item;
      });
      setDataPendaftaran(updatedData);
    } else {
      const updatedData = dataIzin.map(item => {
        if (selectedItems.includes(item.id)) {
          return { ...item, approvalStatus: action };
        }
        return item;
      });
      setDataIzin(updatedData);
    }
    
    // Reset selection after action
    setSelectedItems([]);
    setShowActionDropdown(false);
  };

  // Filter data based on search and date
  const filteredPendaftaran = dataPendaftaran.filter(item => {
    const matchesSearch = Object.values(item).some(
      value => typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesDate = !selectedDate || item.masaMagang.includes(
      selectedDate.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
    
    return matchesSearch && matchesDate;
  });

  const filteredIzin = dataIzin.filter(item => {
    const matchesSearch = Object.values(item).some(
      value => typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesDate = !selectedDate || 
      item.tanggalIzin.includes(
        selectedDate.toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    
    return matchesSearch && matchesDate;
  });

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

  // Get status badge component
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Disetujui</span>;
      case "rejected":
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">Ditolak</span>;
      case "blocked":
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">Diblokir</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">Pending</span>;
    }
  };

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
              <DatePicker 
                selected={selectedDate} 
                onChange={(date) => setSelectedDate(date)} 
                customInput={<CustomButton />} 
                dateFormat="dd MMMM yyyy" 
                showPopperArrow={false} 
              />
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
                        { label: "Status", key: "status" },
                      ]
                    : [
                        { label: "Nama", key: "nama" },
                        { label: "Sekolah", key: "sekolah" },
                        { label: "Tanggal Izin", key: "tanggalIzin" },
                        { label: "Tanggal Kembali", key: "tanggalKembali" },
                        { label: "Status", key: "status" },
                        { label: "Status Approval", key: "approvalStatus" },
                      ]
                }
              >
                {/* <button className="flex items-center gap-2 border border-gray-300 text-[#344054] px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#0069AB] hover:text-white">
                  <Download size={16} />
                  Export
                </button> */}
              </CSVLink>
            </div>
          </div>

          <div className="border-b border-gray-200 my-5" />

          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex gap-2">
              <button 
                className={`px-4 py-2 rounded-lg text-sm border ${activeTab === "pendaftaran" ? "bg-[#0069AB] text-white" : "border-gray-300 text-[#344054]"}`} 
                onClick={() => {
                  setActiveTab("pendaftaran");
                  setSelectedItems([]);
                }}
              >
                Pendaftaran
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm border ${activeTab === "izin" ? "bg-[#0069AB] text-white" : "border-gray-300 text-[#344054]"}`} 
                onClick={() => {
                  setActiveTab("izin");
                  setSelectedItems([]);
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
          
          {/* Bulk Action Controls - Only visible when items are selected */}
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
                      onClick={() => handleBulkAction("approved")}
                    >
                      <CheckCircle size={14} />
                      Setujui
                    </button>
                    <button 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleBulkAction("rejected")}
                    >
                      <XCircle size={14} />
                      Tolak
                    </button>
                    <button 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleBulkAction("blocked")}
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
                    {/* <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-[#0069AB] focus:ring-[#0069AB]"
                        checked={selectedItems.length === filteredPendaftaran.length && filteredPendaftaran.length > 0}
                        onChange={handleSelectAll}
                      />
                    </div> */}
                  </th>
                  <th className="px-6 py-3 text-left">Nama</th>
                  <th className="px-6 py-3 text-left">Jurusan</th>
                  <th className="px-6 py-3 text-left">Kelas</th>
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
                      <img src={item.image} alt={item.nama} className="w-8 h-8 rounded-full" />
                      <span>{item.nama}</span>
                    </td>
                    <td className="px-6 py-4">{item.jurusan}</td>
                    <td className="px-6 py-4">{item.kelas}</td>
                    <td className="px-6 py-4">{item.masaMagang}</td>
                    <td className="px-6 py-4">{item.sekolah}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          className="p-1.5 rounded-full text-green-600 hover:bg-green-50"
                          onClick={() => {
                            const updated = dataPendaftaran.map(i => 
                              i.id === item.id ? {...i, status: "approved"} : i
                            );
                            setDataPendaftaran(updated);
                          }}
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          className="p-1.5 rounded-full text-red-600 hover:bg-red-50"
                          onClick={() => {
                            const updated = dataPendaftaran.map(i => 
                              i.id === item.id ? {...i, status: "rejected"} : i
                            );
                            setDataPendaftaran(updated);
                          }}
                        >
                          <XCircle size={18} />
                        </button>
                        <button 
                          className="p-1.5 rounded-full text-yellow-600 hover:bg-yellow-50"
                          onClick={() => {
                            const updated = dataPendaftaran.map(i => 
                              i.id === item.id ? {...i, status: "blocked"} : i
                            );
                            setDataPendaftaran(updated);
                          }}
                        >
                          <AlertTriangle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPendaftaran.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data yang sesuai dengan pencarian
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
                    {/* <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-[#0069AB] focus:ring-[#0069AB]"
                        checked={selectedItems.length === filteredIzin.length && filteredIzin.length > 0}
                        onChange={handleSelectAll}
                      />
                    </div> */}
                  </th>
                  <th className="px-6 py-3 text-left">Nama</th>
                  <th className="px-6 py-3 text-left">Sekolah</th>
                  <th className="px-6 py-3 text-left">Tanggal Izin</th>
                  <th className="px-6 py-3 text-left">Tanggal Kembali</th>
                  <th className="px-6 py-3 text-left">Status</th>
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
                      <img src={item.image} alt={item.nama} className="w-8 h-8 rounded-full" />
                      <span>{item.nama}</span>
                    </td>
                    <td className="px-6 py-4">{item.sekolah}</td>
                    <td className="px-6 py-4">{item.tanggalIzin}</td>
                    <td className="px-6 py-4">{item.tanggalKembali}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full ${
                        item.status === "Izin" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
                      } text-xs font-medium`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.approvalStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          className="p-1.5 rounded-full text-green-600 hover:bg-green-50"
                          onClick={() => {
                            const updated = dataIzin.map(i => 
                              i.id === item.id ? {...i, approvalStatus: "approved"} : i
                            );
                            setDataIzin(updated);
                          }}
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          className="p-1.5 rounded-full text-red-600 hover:bg-red-50"
                          onClick={() => {
                            const updated = dataIzin.map(i => 
                              i.id === item.id ? {...i, approvalStatus: "rejected"} : i
                            );
                            setDataIzin(updated);
                          }}
                        >
                          <XCircle size={18} />
                        </button>
                        <button 
                          className="p-1.5 rounded-full text-yellow-600 hover:bg-yellow-50"
                          onClick={() => {
                            const updated = dataIzin.map(i => 
                              i.id === item.id ? {...i, approvalStatus: "blocked"} : i
                            );
                            setDataIzin(updated);
                          }}
                        >
                          <AlertTriangle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredIzin.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data yang sesuai dengan pencarian
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