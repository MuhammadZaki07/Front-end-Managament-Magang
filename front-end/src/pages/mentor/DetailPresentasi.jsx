import React, { useState } from "react";

const ParticipantDetailView = () => {
  // Sample data based on the image
  const participant = {
    name: "Anya Forger",
    divisi: "UI/UX",
    school: "SMK NEGERI 12 MALANG",
    nisn: "20241100090",
    email: "anya@email.com",
    company: "PT. HUMAS TECHNOLOGY INDONESIA",
    cabang: "Malang, Indonesia",
    RFID: "00223456789",
    mentor: "Gojo Satoru",
    period: "15 Jul - 16 Agustus 2025",
  };

  // Sample project track record data with more tasks to demonstrate scrolling
  const projectTracks = [
    {
      id: 1,
      stage: "Tahap Pengenalan",
      status: "Dikerjakan",
      startDate: "25 Januari 2021",
      endDate: "30 Januari 2021",
      revisions: [
        {
          id: 1,
          name: "Revisi Pertama",
          tasks: [
            "Revisi tampilan dashboard agar lebih ringkas dan mudah dibaca.",
            "Revisi tampilan dashboard agar lebih ringkas dan mudah dibaca.",
            "Revisi tampilan dashboard agar lebih ringkas dan mudah dibaca.",
            "Perbarui tata letak komponen untuk meningkatkan UX.",
            "Tambahkan fitur pencarian pada halaman utama.",
            "Perbaiki bug pada navigasi halaman.",
            "Optimalkan waktu loading halaman utama."
          ]
        },
        {
          id: 2,
          name: "Revisi Kedua",
          tasks: [
            "Perbaiki responsivitas tampilan pada perangkat mobile.",
            "Tambahkan filter data berdasarkan tanggal.",
            "Perbaiki tata letak elemen pada halaman profil.",
            "Revisi tampilan form input sesuai feedback pengguna.",
            "Tambahkan validasi pada form registrasi.",
            "Perbaiki bug pada fitur upload foto profil."
          ]
        },
        {
          id: 3,
          name: "Revisi Ketiga",
          tasks: [
            "Optimasi performa loading data dari server.",
            "Perbaiki bug pada fitur pencarian.",
            "Tambahkan fitur export data dalam format PDF.",
            "Implementasi animasi transisi antar halaman.",
            "Tambahkan tema gelap (dark mode).",
            "Revisi skema warna sesuai brand guidelines terbaru.",
            "Perbaiki aksesibilitas untuk pengguna disabilitas."
          ]
        }
      ]
    },
    {
      id: 2,
      stage: "Tahap Dasar",
      status: "Selesai",
      startDate: "25 Januari 2021",
      endDate: "30 Januari 2021",
      revisions: [
        {
          id: 1,
          name: "Revisi Pertama",
          tasks: [
            "Perbaiki struktur navigasi aplikasi.",
            "Sesuaikan warna dengan brand guidelines.",
            "Revisi tampilan form input data."
          ]
        },
        {
          id: 2,
          name: "Revisi Kedua",
          tasks: [
            "Perbaiki animasi transisi antar halaman.",
            "Tambahkan konfirmasi sebelum menghapus data.",
            "Perbaiki tata letak pada tabel data."
          ]
        }
      ]
    },
    {
      id: 3,
      stage: "Tahap Pengenalan",
      status: "Selesai",
      startDate: "25 Januari 2021",
      endDate: "30 Januari 2021",
      revisions: [
        {
          id: 1,
          name: "Revisi Pertama",
          tasks: [
            "Revisi tampilan dashboard agar lebih ringkas dan mudah dibaca.",
            "Perbaiki responsivitas tampilan pada perangkat mobile.",
            "Tambahkan fitur notifikasi."
          ]
        }
      ]
    },
    {
      id: 4,
      stage: "Tahap Pengenalan",
      status: "Selesai",
      startDate: "25 Januari 2021",
      endDate: "30 Januari 2021",
      revisions: [
        {
          id: 1,
          name: "Revisi Pertama",
          tasks: [
            "Perbaiki tampilan grafik statistik.",
            "Tambahkan filter data berdasarkan kategori.",
            "Optimasi loading time halaman dashboard."
          ]
        }
      ]
    }
  ];

  // State to track which tracks are expanded
  const [expandedTracks, setExpandedTracks] = useState({});
  // State to track which revisions are expanded
  const [expandedRevisions, setExpandedRevisions] = useState({});

  // Toggle expanded state for a track
  const toggleTrack = (id) => {
    setExpandedTracks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  
  // Toggle expanded state for a revision
  const toggleRevision = (trackId, revisionId) => {
    const key = `${trackId}-${revisionId}`;
    setExpandedRevisions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Function to render status badge with appropriate color
  const renderStatusBadge = (status) => {
    if (status === "Selesai") {
      return (
        <span className="inline-flex bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
          {status}
        </span>
      );
    } else if (status === "Dikerjakan") {
      return (
        <span className="inline-flex bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs">
          {status}
        </span>
      );
    } else {
      return (
        <span className="inline-flex bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
          {status}
        </span>
      );
    }
  };
  
  // Function to check if "Tandai Selesai" button should be shown
  const shouldShowTandaiSelesai = (status) => {
    return status === "Dikerjakan";
  };

  // Function to determine if checkbox should be checked based on track status
  const isCheckboxChecked = (trackStatus) => {
    return trackStatus === "Selesai";
  };

  return (
    <div className="bg-white min-h-screen p-4">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-6">
        <button className="text-gray-600 text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-lg font-medium">Detail Peserta</h1>
      </div>

      {/* Profile section */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
            <img
              src="/assets/img/Profil.png"
              alt="Anya Forger"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">{participant.name}</h2>
            <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-3">
              {participant.divisi}
            </div>

            <div className="text-sm text-gray-600 mb-1">
              {participant.school} | {participant.nisn}
            </div>

            {/* Detail info */}
            <div className="space-y-2 mt-4 text-sm text-gray-600">
              <div className="flex">
                <div className="w-36">Email</div>
                <div>: {participant.email}</div>
              </div>
              <div className="flex">
                <div className="w-36">Perusahaan</div>
                <div>: {participant.company}</div>
              </div>
              <div className="flex">
                <div className="w-36">Cabang</div>
                <div>: {participant.cabang}</div>
              </div>
              <div className="flex">
                <div className="w-36">RFID</div>
                <div>: {participant.RFID}</div>
              </div>
              <div className="flex">
                <div className="w-36">Mentor</div>
                <div>: {participant.mentor}</div>
              </div>
              <div className="flex">
                <div className="w-36">Durasi Magang</div>
                <div>: {participant.period}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Track Record section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-4 px-4">Track Record Project</h2>

        <div className="space-y-4">
          {projectTracks.map((track) => (
            <div
              key={track.id}
              className="bg-white rounded-lg overflow-hidden border border-[#D5DBE7]"
            >
              <div 
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => toggleTrack(track.id)}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{track.stage}</h3>
                    {shouldShowTandaiSelesai(track.status) && (
                      <div className="text-blue-500 bg-blue-50 px-3 py-1 rounded-md text-xs">
                        Tandai Selesai
                      </div>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    <div className="flex flex-col">
                      <div className="flex items-center">{renderStatusBadge(track.status)}</div>
                      <div className="mt-1">{track.startDate}{track.endDate ? ` - ${track.endDate}` : ""}</div>
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 text-lg transition-transform duration-200" style={{ transform: expandedTracks[track.id] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
              
              {/* Expandable content */}
              {expandedTracks[track.id] && (
                <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-2">
                  <div className="mt-2 mb-4 font-medium">Detail Revisi</div>
                  
                  {/* Revisions list - with max height and scrolling */}
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {track.revisions.map((revision) => (
                      <div key={revision.id} className="border-b border-gray-100 pb-2">
                        {/* Revision header */}
                        <div 
                          className="flex items-center justify-between cursor-pointer pb-2 sticky top-0 bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRevision(track.id, revision.id);
                          }}
                        >
                          <div className="font-medium">{revision.name}</div>
                          <button className="text-gray-400">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              style={{ 
                                transform: expandedRevisions[`${track.id}-${revision.id}`] ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s'
                              }}
                            >
                              <path d="M18 15l-6-6-6 6"/>
                            </svg>
                          </button>
                        </div>

                        {/* Revision tasks */}
                        {expandedRevisions[`${track.id}-${revision.id}`] && (
                          <div className="pl-2">
                            {revision.tasks.map((task, index) => (
                              <div key={index} className="flex items-start gap-2 mb-2">
                                <input 
                                  type="checkbox" 
                                  className="mt-1" 
                                  checked={isCheckboxChecked(track.status)}
                                  readOnly={track.status === "Selesai"}
                                />
                                <div>{task}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParticipantDetailView;