import { Edit, X, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import axios from "axios";

export default function StudentTable() {
  const [allStudentsData, setAllStudentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Fetch data from API
  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/peserta-progress`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.status === "success") {
          // DEBUG: Print raw API response
          console.log("RAW API RESPONSE:", response.data);
          console.log("RAW API DATA:", response.data.data);
          console.log("FIRST STUDENT RAW:", response.data.data[0]);
          
          // Transform API data to match component expectations
          const transformedData = response.data.data.map((student, index) => {
            // DEBUG: Print each student structure
            console.log(`STUDENT ${index}:`, student);
            console.log(`STUDENT ${index} PROGRESS:`, student.progress);
            
            // Ambil id_peserta dari array progress (ambil yang pertama karena id_peserta sama semua)
            let idPeserta = null;
            
            // Coba berbagai cara untuk ambil ID peserta
            if (student.progress && Array.isArray(student.progress) && student.progress.length > 0) {
              idPeserta = student.progress[0].id_peserta;
              console.log(`ID PESERTA from progress[0]:`, idPeserta);
            }
            
            // Fallback: cek apakah ada field lain yang mengandung UUID
            const possibleIdFields = ['id', 'user_id', 'peserta_id', 'uuid', 'id_peserta'];
            for (const field of possibleIdFields) {
              if (student[field] && typeof student[field] === 'string' && student[field].includes('-')) {
                idPeserta = student[field];
                console.log(`ID PESERTA found in field '${field}':`, idPeserta);
                break;
              }
            }
            
            console.log(`FINAL ID PESERTA for ${student.nama}:`, idPeserta);

            return {
              id: idPeserta || `temp-${index + 1}`, // Gunakan id_peserta sebagai ID utama
              apiId: idPeserta, // Store the actual peserta ID for navigation
              name: student.nama,
              sekolah: student.sekolah,
              project: student.project,
              status: student.selesai ? "Completed" : "In Progress",
              email: student.email,
              nomor_identitas: student.nomor_identitas,
              mulai: student.mulai,
              selesai: student.selesai,
              // Get profile image from foto array
              image: student.foto?.find((f) => f.type === "profile")?.path 
                ? `${import.meta.env.VITE_API_URL_FILE}/storage/${student.foto.find((f) => f.type === "profile").path}` 
                : "/assets/img/default-avatar.png", // fallback image
              // Tambahan: simpan juga progress data jika diperlukan
              progressData: student.progress || [],
              // DEBUG: simpan raw data untuk debug
              rawData: student
            };
          });

          console.log("FINAL TRANSFORMED DATA:", transformedData);
          setAllStudentsData(transformedData);
        } else {
          setError("Failed to fetch student data");
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err.response?.data?.message || "Terjadi kesalahan saat mengambil data siswa");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentsData();
  }, []);

  const filteredStudents = allStudentsData.filter((student) => {
    const statusMatch = selectedStatus === "All" || student.status === selectedStatus;
    const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && nameMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const csvReport = {
    data: filteredStudents.length > 0 ? filteredStudents : allStudentsData,
    filename: "students_report.csv",
    headers: [
      { label: "ID Peserta", key: "apiId" },
      { label: "Nama", key: "name" },
      { label: "Email", key: "email" },
      { label: "Nomor Identitas", key: "nomor_identitas" },
      { label: "Asal Sekolah", key: "sekolah" },
      { label: "Project", key: "project" },
      { label: "Status", key: "status" },
      { label: "Tanggal Mulai", key: "mulai" },
      { label: "Tanggal Selesai", key: "selesai" },
    ],
  };
  

  // Function untuk handle navigation ke halaman detail siswa
  const handleEditStudent = (student) => {
    // Use the actual peserta ID for navigation
    const studentId = student.apiId;
    console.log("Student ID untuk navigasi:", studentId);
    console.log("Full student data:", student);
    
    if (studentId) {
      window.location.href = `/mentor/siswa/${studentId}`;
      // console.log(`Navigating to: /mentor/siswa/${studentId}`);
    } else {
      console.error("ID Peserta tidak ditemukan!");
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Search & Filter Controls */}
      <div className="flex justify-between items-center mb-4 gap-3">
        <div className="flex items-center border border-gray-300 bg-white rounded-md px-3 py-2 w-full max-w-sm">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input type="text" placeholder="Cari nama..." className="outline-none text-sm w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="flex gap-3">
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white">
            <option value="All">Tampilkan Semua</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
          </select>

          <CSVLink {...csvReport} className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
            Export CSV
          </CSVLink>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl shadow-sm border border-gray-200 bg-white overflow-hidden">
        <table className="min-w-full text-left divide-y divide-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-white text-black font-bold text-sm">
            <tr>
              <th className="p-3">Nama</th>
              <th className="p-3">Asal Sekolah</th>
              <th className="p-3">Project</th>
              <th className="p-3">Progress</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-black text-sm" style={{ backgroundColor: "#FFFFFF" }}>
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-100">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        // Fallback to default image if profile image fails to load
                        e.target.src = "/assets/img/default-avatar.png";
                      }}
                    />
                    <div>
                      <span className="font-medium block">{student.name}</span>
                      {/* <span className="text-xs text-gray-500">ID: {student.apiId}</span> */}
                    </div>
                  </td>
                  <td className="p-3">{student.sekolah}</td>
                  <td className="p-3 capitalize">{student.project}</td>
                  <td className="p-3">
                    {student.status === "Completed" ? (
                      <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full inline-flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {student.status}
                      </span>
                    ) : (
                      <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full inline-flex items-center gap-1">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        {student.status}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <button onClick={() => handleEditStudent(student)} className="p-2 rounded-md hover:bg-purple-100 transition-all" title={`Edit ${student.name}`}>
                      <Edit className="h-5 w-5 text-purple-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  {searchTerm || selectedStatus !== "All" ? "Tidak ada data yang sesuai dengan filter" : "Tidak ada data siswa"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 text-sm text-gray-600">
            <div>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} entries
            </div>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}