import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/cards/Loading';
import AddStudentModal from '../../components/modal/AddStudentModal';

export default function DetailMentor() {
  const { mentorId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshStudentsList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/mentor/${mentorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (response.data?.data?.peserta) {
        setStudents(response.data.data.peserta);
      }
    } catch (error) {
      console.error("Gagal memuat ulang data siswa:", error);
      setError("Gagal memperbarui data siswa");
    }
  };

  console.log(students);
  

  useEffect(() => {
    const fetchMentorDetails = async () => {
      if (!mentorId) {
        console.error("ID Mentor tidak ditemukan di parameter URL");
        setError("ID Mentor tidak valid");
        setLoading(false);
        return;
      }
      
      try {
        // Fetch mentor details
        const mentorResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/mentor/${mentorId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        if (mentorResponse.data?.data) {
          setMentor(mentorResponse.data.data);
          setStudents(mentorResponse.data.data.peserta || []); // Inisialisasi students
        } else {
          console.error("Data mentor kosong dari API");
          setError("Data mentor tidak ditemukan");
        }
      } catch (error) {
        console.error("Error mengambil detail mentor:", error);
        setError("Gagal memuat data mentor");
      } finally {
        setLoading(false);
      }
    };

    if (mentorId) {
      fetchMentorDetails();
    } else {
      setLoading(false);
      setError("ID Mentor tidak ditemukan");
    }
  }, [mentorId]);

  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.sekolah?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;
  
  if (error && !mentor) {
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-6 min-h-[300px]">
        <div className="text-red-500 text-xl font-medium mb-2">Error</div>
        <div className="text-gray-600">{error}</div>
        <div className="mt-4 text-gray-500">Silakan kembali ke halaman sebelumnya.</div>
      </div>
    );
  }

  // Get mentor info
  const user = mentor?.user || {};
  const division = mentor?.divisi?.nama || 'Division Not Available';
  const divisionId = mentor?.divisi?.id;

  return (
    <div className="bg-white min-h-screen p-4">
      {/* Back button */}
      <div className="flex items-center mb-4">
        <button className="text-gray-700 p-2 rounded-full hover:bg-gray-200 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Left sidebar - Mentor details */}
        <div className="md:w-100 ">
          <div className="mb-6">
            <h2 className="font-bold text-lg text-center mb-6">Detail Mentor</h2>
            
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4">
                {mentor?.foto?.find(f => f.type === 'profile')?.path ? (
                  <img 
                    src={`${import.meta.env.VITE_API_URL_FILE}/storage/${mentor.foto.find(f => f.type === 'profile').path}`}
                    alt="Mentor avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src="/api/placeholder/100/100" alt="Mentor avatar" className="w-full h-full object-cover" />
                )}
              </div>
              <h3 className="font-bold text-xl text-center">{user.nama || 'Name Not Available'}</h3>
              <div className="bg-blue-500 text-white text-xs rounded-full px-3 py-1 mt-2 uppercase font-semibold tracking-wider">
                {division}
              </div>
            </div>

            <div className="text-center text-sm text-gray-600 mb-4">
              <p>{user.email || 'Email Not Available'}</p>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-red-500">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right content - Students list */}
        <div className="flex-1">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">Detail Siswa Bimbingan</h2>
              <div className="flex items-center">
                <div className="relative mr-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-2 top-2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                  onClick={() => setIsModalOpen(true)}
                >
                  Tambah Siswa
                </button>
              </div>
            </div>

            {/* Table with border-top and border-bottom only */}
            <div className="overflow-x-auto bg-white rounded-lg border-t border-b border-gray-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-gray-700 font-semibold">No</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Nama</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Sekolah</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                      <tr key={student.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 text-gray-600">{index + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden mr-3">
                              {student?.foto?.path? (
                                <img 
                                  src={`${import.meta.env.VITE_API_URL_FILE}/storage/${student.foto.path}`}
                                  alt="Student avatar" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img src="/api/placeholder/100/100" alt="Mentor avatar" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <span className="font-medium">{student.nama || "N/A"}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{student.email || "N/A"}</td>
                        <td className="py-3 px-4 text-gray-600">{student.sekolah || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-6 text-center text-gray-500">
                        Tidak ada siswa yang ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      
      {/* Add Student Modal */}
      <AddStudentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mentorId={mentorId}
        divisionId={divisionId}
        onSuccess={refreshStudentsList}
      />
    </div>
  );
}