import { useState } from 'react';

// Modal component to display revision details
const RevisionModal = ({ isOpen, onClose, revision }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{revision.title}</h3>
          <div className="flex items-center">
            <div className="flex items-center text-red-500 mr-4">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Revisi Belum Selesai</span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-500 text-sm">{revision.date}</p>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Revisi:</h4>
          {revision.tasks.map((task) => (
            <div key={task.id} className="flex items-start mb-3">
              <input 
                type="checkbox" 
                checked={task.completed} 
                className="mt-1 mr-3" 
                readOnly 
              />
              <p className="text-gray-800">{task.text}</p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// Individual Review Card component
const ReviewDetailCard = ({ title, date, tasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  return (
    <>
      <div 
        className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={openModal}
      >
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-3">{date}</p>
        
        <div>
          {tasks.length > 0 ? (
            <ul className="space-y-2">
              {tasks.slice(0, 2).map((task) => (
                <li key={task.id} className="flex items-start">
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    className="mt-1 mr-2" 
                    readOnly 
                  />
                  <p className="text-gray-700 text-sm truncate">{task.text}</p>
                </li>
              ))}
              {tasks.length > 2 && (
                <li className="text-blue-600 text-sm pt-1">
                  +{tasks.length - 2} item lainnya
                </li>
              )}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic">Tidak ada tugas revisi</p>
          )}
        </div>
      </div>
      
      <RevisionModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        revision={{ title, date, tasks }} 
      />
    </>
  );
};

// Main component to display all review cards
const ReviewDetailList = () => {
  const reviewDetails = [
    {
      id: 1,
      title: 'Revisi ke - 1',
      date: 'Selasa, 29 April 2025',
      tasks: [
        { id: 1, text: 'Menambahkan button untuk tampilan section siswa', completed: false },
        { id: 2, text: 'Tambahkan animasi transisi agar lebih interaktif', completed: false },
        { id: 3, text: 'Perjelas alur navigasi pengguna', completed: false },
        { id: 4, text: 'Kombinasi warna yang digunakan belum konsisten dan bisa membingungkan pengguna, mohon diperbaiki.', completed: false },
        { id: 5, text: 'Sesuaikan ukuran teks di tampilan kecil', completed: false },
        { id: 6, text: 'Singkatkan kalimat yang terlalu panjang', completed: false },
        { id: 7, text: 'Layout belum responsif di berbagai ukuran layar, sebaiknya gunakan grid atau flex agar fleksibel.', completed: false }
      ]
    },
    {
      id: 2,
      title: 'Revisi ke - 2',
      date: 'Selasa, 20 April 2025',
      tasks: [
        { id: 1, text: 'Tambah animasi sajikan', completed: true },
        { id: 2, text: 'Desainnya terlalu kaku', completed: false },
        { id: 3, text: 'Perjelas alur navigasi pengguna', completed: false }
      ]
    },
    {
      id: 3,
      title: 'Revisi ke - 3',
      date: 'Jumat, 17 April 2025',
      tasks: [
        { id: 1, text: 'Tambah fitur filter data', completed: true },
        { id: 2, text: 'Perbaiki bug pada form input', completed: true },
        { id: 3, text: 'Tambahkan konfirmasi saat hapus data', completed: false },
        { id: 4, text: 'Perbesar font untuk heading utama', completed: false }
      ]
    },
    {
      id: 4,
      title: 'Revisi ke - 4',
      date: 'Rabu, 15 April 2025',
      tasks: [
        { id: 1, text: 'Optimasi loading page', completed: true },
        { id: 2, text: 'Tambahkan fitur pencarian', completed: true },
        { id: 3, text: 'Perbaiki tampilan di mobile', completed: false }
      ]
    }
  ];
  
  return (
    <div className="p-6 bg-white">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Detail Revisi</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reviewDetails.map((review) => (
          <ReviewDetailCard
            key={review.id}
            title={review.title}
            date={review.date}
            tasks={review.tasks}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewDetailList;