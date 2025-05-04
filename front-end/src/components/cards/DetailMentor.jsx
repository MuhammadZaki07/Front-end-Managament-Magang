import { useState } from 'react';

export default function DetailMentor() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Gojo Satoru', email: 'jrs.Contact@gmail.com', school: 'SMAN 12 MALANG', status: 'Offline' },
    { id: 2, name: 'Gojo Satoru', email: 'jrs.Contact@gmail.com', school: 'SMAN 12 MALANG', status: 'Offline' },
    { id: 3, name: 'Gojo Satoru', email: 'jrs.Contact@gmail.com', school: 'SMAN 12 MALANG', status: 'Offline' },
    { id: 4, name: 'Gojo Satoru', email: 'jrs.Contact@gmail.com', school: 'SMAN 12 MALANG', status: 'Offline' },
    { id: 5, name: 'Gojo Satoru', email: 'jrs.Contact@gmail.com', school: 'SMAN 12 MALANG', status: 'Offline' },
    { id: 6, name: 'Gojo Satoru', email: 'jrs.Contact@gmail.com', school: 'SMAN 12 MALANG', status: 'Offline' },
    { id: 7, name: 'Gojo Satoru', email: 'jrs.Contact@gmail.com', school: 'SMAN 12 MALANG', status: 'Offline' },
    { id: 8, name: 'Gojo Satoru', email: 'jrs.Contact@gmail.com', school: 'SMAN 12 MALANG', status: 'Offline' },
    { id: 9, name: 'Gojo Satoru', email: 'jrs.Contact@gmail.com', school: 'SMAN 12 MALANG', status: 'Offline' },
    { id: 10, name: 'Gojo Satoru', email: 'jrs.Contact@gmail.com', school: 'SMAN 12 MALANG', status: 'Offline' },
    { id: 11, name: 'Gojo Satoru', email: 'jrs.Contact@gmail.com', school: 'SMAN 12 MALANG', status: 'Offline' },
    { id: 12, name: 'Gojo Satoru', email: 'jrs.Contact@gmail.com', school: 'SMAN 12 MALANG', status: 'Offline' },
  ]);

  return (
    <div className="flex bg-white rounded-lg shadow-md p-6 h-screen">
      {/* Mentor Profile Section */}
      <div className="w-64 flex flex-col items-center pr-6 border-r border-gray-200">
        <h2 className="font-semibold text-lg mb-4">Detail Mentor</h2>
        <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
          <img
            src="/api/placeholder/150/150"
            alt="Mentor avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-bold text-xl mb-1">Anya Forger</h3>
        <p className="text-blue-600 text-sm font-medium mb-2">UI/UX DESIGNER</p>
        <p className="text-gray-600 text-sm">info@gmail.com</p>
      </div>

      {/* Students List Section */}
      <div className="flex-1 pl-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-lg">Detail Siswa Bimbingan</h2>
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm w-64"
          />
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 text-sm text-gray-600 border-b pb-2">
          <div className="col-span-1">No</div>
          <div className="col-span-3">Nama</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-3">
            <div className="flex items-center">
              Sekolah
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center justify-end">
              Jenis Mapging
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Scrollable Table Content */}
        <div className="h-[600px] overflow-y-auto">
          {students.map((student) => (
            <div key={student.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100 text-sm">
              <div className="col-span-1">{student.id}</div>
              <div className="col-span-3 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 overflow-hidden">
                  <img src="/api/placeholder/32/32" alt="Student avatar" className="w-full h-full object-cover" />
                </div>
                {student.name}
              </div>
              <div className="col-span-3 text-gray-600">{student.email}</div>
              <div className="col-span-3 text-gray-600">{student.school}</div>
              <div className="col-span-2 text-right">
                <span className="text-blue-500 font-medium">{student.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
