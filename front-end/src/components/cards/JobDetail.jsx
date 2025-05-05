import React, { useEffect } from 'react';

const JobDetail = ({ job, onClose }) => {
  if (!job) return null;
  
  // Add ESC key handler to close the detail panel
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  // Fixed social media URLs for consistent display
  const socialMedia = {
    instagram: job.instagram || "@Hummatech.co.id",
    website: job.website || "hummatech.co.id",
    linkedin: job.linkedin || "@Hummatech.co.id"
  };
  
  // Added company description if not present
  const description = job.description || "Perusahaan ini bergerak di bidang Informasi dan Teknologi untuk perkembangan Industri";
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg h-fit sticky top-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Detail Lowongan</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
      
      <div className="mb-4 relative">
        <img
          src="/api/placeholder/400/160" 
          alt="Office Buildings"
          className="w-full h-32 object-cover rounded-lg"
        />
        <div className="relative -mt-8 flex justify-center">
          <div className="w-16 h-16 bg-white rounded-full p-1 shadow-md">
            <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              <i className="bi bi-building text-blue-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      
      <h3 className="text-center text-lg font-bold mt-2">{job.company}</h3>
      <p className="text-center text-sm text-gray-500 mb-2">{job.location}</p>
      <p className="text-center text-xs text-gray-600 mb-6">{description}</p>
      
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Informasi Detail</h4>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2 w-1/2">
            <div className="w-5 h-5 text-blue-500">
              <i className="bi bi-graph-up-arrow"></i>
            </div>
            <span className="text-sm text-gray-500">Status Lowongan:</span>
          </div>
          <div className="w-1/2">
            <span className={`px-2 py-1 rounded-full text-xs ${
              job.status === "Berlangsung" 
                ? "bg-orange-100 text-orange-500" 
                : "bg-emerald-100 text-emerald-500"
            }`}>
              {job.status}
            </span>
          </div>
        </div>
        
        {/* Bagian informasi lainnya */}
        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2 w-1/2">
            <div className="w-5 h-5 text-blue-500">
              <i className="bi bi-people-fill"></i>
            </div>
            <span className="text-sm text-gray-500">Total Pendaftar:</span>
          </div>
          <div className="w-1/2 text-sm font-medium">{job.pendaftar}</div>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2 w-1/2">
            <div className="w-5 h-5 text-blue-500">
              <i className="bi bi-calendar-event"></i>
            </div>
            <span className="text-sm text-gray-500">Durasi Lowongan:</span>
          </div>
          <div className="w-1/2 text-sm font-medium">{job.durasi}</div>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2 w-1/2">
            <div className="w-5 h-5 text-blue-500">
              <i className="bi bi-geo-alt-fill"></i>
            </div>
            <span className="text-sm text-gray-500">Lokasi Penempatan:</span>
          </div>
          <div className="w-1/2 text-sm font-medium">{job.lokasiPenempatan}</div>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2 w-1/2">
            <div className="w-5 h-5 text-blue-500">
              <i className="bi bi-instagram"></i>
            </div>
            <span className="text-sm text-gray-500">Instagram:</span>
          </div>
          <div className="w-1/2 text-sm font-medium">{socialMedia.instagram}</div>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2 w-1/2">
            <div className="w-5 h-5 text-blue-500">
              <i className="bi bi-globe"></i>
            </div>
            <span className="text-sm text-gray-500">Website:</span>
          </div>
          <div className="w-1/2 text-sm font-medium">{socialMedia.website}</div>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2 w-1/2">
            <div className="w-5 h-5 text-blue-500">
              <i className="bi bi-linkedin"></i>
            </div>
            <span className="text-sm text-gray-500">LinkedIn:</span>
          </div>
          <div className="w-1/2 text-sm font-medium">{socialMedia.linkedin}</div>
        </div>
      </div>
      
      <div className="mt-8 flex gap-2">
        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50 flex-1">
          Tutup
        </button>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 flex-1">
          Edit
        </button>
      </div>
    </div>
  );
};

export default JobDetail;