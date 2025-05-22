import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ParticipantDetailView = () => {
  const { id } = useParams(); // Get ID from URL parameters
  const [participant, setParticipant] = useState(null);
  const [projectTracks, setProjectTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to track which tracks are expanded
  const [expandedTracks, setExpandedTracks] = useState({});
  // State to track which revisions are expanded
  const [expandedRevisions, setExpandedRevisions] = useState({});

  // Fetch participant data from API
  useEffect(() => {
    const fetchParticipantData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/peserta-progress/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.status === "success") {
          const data = response.data.data;
          
          // Transform participant data
          const transformedParticipant = {
            name: data.nama,
            divisi: data.divisi,
            school: data.sekolah,
            nisn: data.nomor_identitas,
            email: data.email,
            company: data.perusahaan,
            cabang: data.cabang,
            RFID: data.rfid || "N/A", // RFID might not be in API response
            mentor: data.mentor,
            period: `${formatDate(data.mulai_magang)} - ${formatDate(data.selesai_magang)}`,
            profileImage: data.foto?.find((f) => f.type === "profile")?.path 
              ? `${import.meta.env.VITE_API_URL}/storage/${data.foto.find((f) => f.type === "profile").path}` 
              : "/assets/img/default-avatar.png"
          };

          setParticipant(transformedParticipant);

          // Transform progress data to project tracks
          const transformedTracks = data.progress.map((progress, index) => ({
            id: progress.id,
            stage: `Tahap ${index + 1}`, // You might want to get actual stage names from another API endpoint
            status: progress.status === 1 ? "Selesai" : "Dikerjakan",
            startDate: formatDate(progress.created_at),
            endDate: progress.status === 1 ? formatDate(progress.updated_at) : null,
            revisions: progress.progress.length > 0 ? [{
              id: 1,
              name: "Revisi Utama",
              tasks: progress.progress.map(p => p.deskripsi)
            }] : []
          }));

          setProjectTracks(transformedTracks);
        } else {
          setError("Failed to fetch participant data");
        }
      } catch (err) {
        console.error("Error fetching participant:", err);
        setError(err.response?.data?.message || "Terjadi kesalahan saat mengambil data peserta");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchParticipantData();
    }
  }, [id]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

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

  // Function to handle marking task as complete
  const handleMarkComplete = async (trackId) => {
    try {
      // You might need to implement an API endpoint to mark tasks as complete
      // Example API call:
      // await axios.put(`${import.meta.env.VITE_API_URL}/peserta-progress/${id}/complete/${trackId}`, {}, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      // });
      
      // For now, just update the local state
      setProjectTracks(prev => 
        prev.map(track => 
          track.id === trackId 
            ? { ...track, status: "Selesai", endDate: formatDate(new Date()) }
            : track
        )
      );
    } catch (err) {
      console.error("Error marking task as complete:", err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center p-8 min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  // No participant data
  if (!participant) {
    return (
      <div className="flex justify-center items-center p-8 min-h-screen">
        <div className="text-gray-500">Participant not found</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-4">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          className="text-gray-600 text-xl"
          onClick={() => window.history.back()}
        >
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
              src={participant.profileImage}
              alt={participant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/assets/img/default-avatar.png";
              }}
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

        {projectTracks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Belum ada progress yang tersedia
          </div>
        ) : (
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
                        <button 
                          className="text-blue-500 bg-blue-50 px-3 py-1 rounded-md text-xs hover:bg-blue-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkComplete(track.id);
                          }}
                        >
                          Tandai Selesai
                        </button>
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
        )}
      </div>
    </div>
  );
};

export default ParticipantDetailView;