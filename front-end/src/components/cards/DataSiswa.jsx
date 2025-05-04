import { Edit, X, Search } from "lucide-react";
import { useState } from "react";
import { CSVLink } from "react-csv";

export default function StudentTable() {
  const allStudentsData = [
    { id: 1, name: "Sakura Haruno", sekolah: "Tokyo University", project: "UI Redesign", status: "Completed", image: "/assets/img/post1.png" },
    { id: 2, name: "Naruto Uzumaki", sekolah: "Konoha Institute", project: "Backend API", status: "In Progress", image: "/assets/img/post2.png" },
    { id: 3, name: "Levi Ackerman", sekolah: "Survey Corps Academy", project: "DevOps Automation", status: "Completed", image: "/assets/img/post1.png" },
    { id: 4, name: "Hinata Shoyo", sekolah: "Karasuno High", project: "Landing Page", status: "In Progress", image: "/assets/img/post2.png" },
    { id: 5, name: "Mikasa Ackerman", sekolah: "Survey Corps Academy", project: "Design System", status: "Completed", image: "/assets/img/post1.png" },
    { id: 6, name: "Luffy D. Monkey", sekolah: "Grand Line School", project: "API Integration", status: "Completed", image: "/assets/img/post2.png" },
    { id: 7, name: "Ichigo Kurosaki", sekolah: "Soul Reaper University", project: "Mini CRM", status: "In Progress", image: "/assets/img/post1.png" },
    { id: 8, name: "Nobara Kugisaki", sekolah: "Jujutsu Tech", project: "Auth System", status: "Completed", image: "/assets/img/post2.png" },
    { id: 9, name: "Katsuki Bakugo", sekolah: "UA High", project: "Dashboard Admin", status: "In Progress", image: "/assets/img/post1.png" },
  ];

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredStudents = allStudentsData.filter((student) => {
    // Filter berdasarkan status yang dipilih dan pencarian nama
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
      { label: "Nama", key: "name" },
      { label: "Asal Sekolah", key: "sekolah" },
      { label: "Project", key: "project" },
      { label: "Status", key: "status" },
    ],
  };

  return (
    <div className="relative">
      {/* Search & Filter Controls */}
      <div className="flex justify-between items-center mb-4 gap-3">
        <div className="flex items-center border border-gray-300 bg-white rounded-md px-3 py-2 w-full max-w-sm">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Cari nama..."
            className="outline-none text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
          >
            <option value="All">Tampilkan Semua</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
          </select>

          <CSVLink
            {...csvReport}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
          >
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
          <tbody className="text-black text-sm" style={{ backgroundColor: "#F7F6FE" }}>
            {currentStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-100">
                <td className="p-3 flex items-center gap-3">
                  <img src={student.image} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                  <span className="font-medium">{student.name}</span>
                </td>
                <td className="p-3">{student.sekolah}</td>
                <td className="p-3">{student.project}</td>
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
                  <button className="p-2 rounded-md hover:bg-purple-100 transition-all">
                    <Edit className="h-5 w-5 text-purple-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 text-sm text-gray-600">
          <div>
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} entries
          </div>
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
