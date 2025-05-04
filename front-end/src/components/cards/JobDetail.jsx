import React from 'react';

export default function JobDetail({ job, onBack }) {
  return (
    <div className="max-w-6xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Bagian Kiri - Detail Lowongan */}
          <div className="w-full md:w-2/3 p-6">
            <h2 className="text-xl font-bold mb-4">Detail Lowongan</h2>
            
            <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
              <img 
                src="/api/placeholder/800/300" 
                alt="Building" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-white rounded-full p-1 border-4 border-white shadow-md">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                  {job.icon}
                </div>
              </div>
            </div>
            
            <h1 className="text-xl font-bold mb-1">{job.company}</h1>
            <p className="text-gray-600 mb-4">{job.location}</p>
            
            <p className="text-gray-600 mb-6">
              Perusahaan ini bergerak di bidang Informasi dan Teknologi untuk pengembangan Industri
            </p>
            
            <h3 className="font-semibold text-lg mb-4">Informasi Detail</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 text-center text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-gray-500">Status Lowongan:</p>
                  <p className={`font-medium ${job.status === 'Berlangsung' ? 'text-orange-600' : 'text-teal-600'}`}>
                    {job.status}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 text-center text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-gray-500">Total Pendaftar:</p>
                  <p className="font-medium">{job.pendaftar}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 text-center text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-gray-500">Durasi Lowongan:</p>
                  <p className="font-medium">{job.durasi}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 text-center text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-gray-500">Lokasi Penempatan:</p>
                  <p className="font-medium">{job.lokasiPenempatan}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 text-center text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-gray-500">Website:</p>
                  <p className="font-medium text-blue-600">@{job.website.split('//')[1]}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex space-x-4">
              <button className="px-6 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50">
                Tutup Lowongan
              </button>
              <button className="px-6 py-2.5 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600">
                Edit
              </button>
            </div>
          </div>
          
          {/* Bagian Kanan - Daftar Pelamar */}
          <div className="w-full md:w-1/3 bg-gray-50 p-6 border-l border-gray-200">
            <h3 className="font-semibold text-lg mb-4">Daftar Pelamar</h3>
            
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Pelamar {item}</p>
                    <p className="text-sm text-gray-500">Lamar pada 15 Juni 2025</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-2 py-1 rounded-full text-xs ${item % 2 === 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                      {item % 2 === 0 ? 'Menunggu' : 'Diterima'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 text-center text-blue-600 py-2 hover:underline">
              Lihat Semua Pelamar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}