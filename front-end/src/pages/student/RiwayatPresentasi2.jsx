import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MeetingScheduleTable() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Generate more varied dummy data
  const generateDummyData = () => {
    const projectTypes = ["Pengenalan 1", "Pengembangan 2", "Implementasi 3", "Review 4", "Testing 5"];
    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
    const methods = ["Online", "Offline"];
    const statuses = ["Dijadwalkan", "Selesai"];
    const locations = ["PT. HUMMATECH", "Ruang Meeting Lt.2", "Co-Working Space", "Kantor Cabang"];

    return Array(45).fill(null).map((_, index) => {
      const projectIndex = index % projectTypes.length;
      const dayIndex = index % days.length;
      const methodIndex = index % 3 === 0 ? 0 : 1; // More offline than online
      const statusIndex = index % 4 === 0 ? 0 : 1; // More completed than scheduled
      
      return {
        id: index + 1,
        project: projectTypes[projectIndex],
        date: `${days[dayIndex]}, ${(20 + dayIndex)} Juni 2025`,
        time: "13.00 - 16.00 WIB",
        method: methods[methodIndex],
        location: methods[methodIndex] === "Online" ? "Link zoom disini" : locations[index % locations.length],
        status: statuses[statusIndex]
      };
    });
  };

  const allMeetings = generateDummyData();
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMeetings = allMeetings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allMeetings.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen p-4">
      {/* Filter section - moved outside the card */}
      <div className="flex justify-end mb-4">
        <div className="relative">
          <button 
            className="flex items-center px-4 py-2 text-sm text-gray-600 bg-white border rounded-md hover:bg-gray-50 shadow-sm"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            Filter by: <span className="font-medium ml-1"></span> <ChevronDown className="ml-2 h-4 w-4" />
          </button>
          {filterOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Semua Tahap</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Tahap Pengenalan</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Tahap Pengembangan</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Tahap Pengujian</a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        {/* Table section */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Project</th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Hari dan Tanggal</th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Jam</th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Metode</th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Lokasi/Link Zoom</th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentMeetings.map((meeting) => (
                <tr key={meeting.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{meeting.project}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{meeting.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{meeting.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{meeting.method}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 text-center">
                    {meeting.method === "Online" ? (
                      <a href="#" className="hover:underline">Link zoom disini</a>
                    ) : (
                      <span className="text-gray-500">{meeting.location}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {meeting.status === "Dijadwalkan" ? (
                      <span className="inline-flex items-center justify-center">
                        <span className="h-2 w-2 bg-orange-400 rounded-full mr-2"></span>
                        <span className="text-sm text-orange-500">Dijadwalkan</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center">
                        <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                        <span className="text-sm text-green-500">Selesai</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination section */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, allMeetings.length)} of {allMeetings.length} entries
          </div>
          <div className="flex space-x-1">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1} 
              className={`relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show a limited number of pages with ellipsis
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      currentPage === pageNumber
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    } rounded-md`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <span
                    key={pageNumber}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                );
              }
              return null;
            })}
            
            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages} 
              className={`relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}