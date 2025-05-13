import React, { useState, useEffect } from "react";
import axios from "axios";
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

  const [dataPendaftaran, setDataPendaftaran] = useState([]);
  const [divisiOptions, setDivisiOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPeserta = async () => {
      try {
        const res = await axios.get(`${apiUrl}/peserta-by-cabang`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success") {
          const pesertaData = res.data.data;
          setDataPendaftaran(pesertaData);

          const divisiSet = new Set();
          const statusSet = new Set();

          pesertaData.forEach((item) => {
            if (item.divisi) divisiSet.add(item.divisi?.nama || "");
            if (item.status_magang) statusSet.add(item.status_magang);
          });

          setDivisiOptions([...divisiSet]);
          setStatusOptions([...statusSet]);
        }
      } catch (err) {
        console.error("Gagal mengambil data peserta:", err);
      }
    };
    fetchPeserta();
  }, []);

  console.log(dataPendaftaran);
  

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
              Peserta Magang
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
                  placeholder="Cari Nama / Email"
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-3 top-[9px] text-gray-400">
                  <Search size={16} />
                </span>
              </div>

              <div className="w-44">
                <select
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm shadow-sm"
                  value={selectedDivisi}
                  onChange={(e) => setSelectedDivisi(e.target.value)}
                >
                  <option value="">Semua Divisi</option>
                  {divisiOptions.map((divisi, index) => (
                    <option key={index} value={divisi}>
                      {divisi}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-44">
                <select
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm shadow-sm"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
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

        <TablePendaftaran
          data={dataPendaftaran}
          searchTerm={searchTerm}
          selectedDate={selectedDate}
          selectedDivisi={selectedDivisi}
          selectedStatus={selectedStatus}
        />
      </div>
    </div>
  );
}
