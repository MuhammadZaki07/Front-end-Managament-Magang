import React from 'react';
import { Link } from 'react-router-dom';
// Project Stage Card Component
const ProjectStageCard = ({ title, icon, message, isCompleted, isLocked }) => {
  return (
    <div className="border border-black rounded-lg p-6 flex flex-col items-center h-full">
      <h3 className="text-xl font-semibold text-black mb-4">{title}</h3>
      
      <div className="flex justify-center mb-3">
        {isLocked ? (
          <div className="text-black">
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <circle cx="12" cy="16" r="1"></circle>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        ) : (
          <div className="flex justify-center">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <p className="text-center text-sm text-black mb-4">
          {message}
        </p>
        
        {isLocked && <p className="text-center font-medium text-black">SEMANGAT!</p>}
      </div>
      
      <div className="w-full mt-auto">
  {!isLocked ? (
    <Link to="/peserta/detail-project">
      <button className="w-full py-2 text-center border border-black rounded-full hover:bg-gray-50 transition-colors duration-200">
        Lihat Detail
      </button>
    </Link>
  ) : (
    <div className="h-10"></div> // Spacer for locked cards
  )}
</div>
    </div>
  );
};

// Route Project Component
const RouteProject = () => {
  // Project stages data
  const stages = [
    {
      id: 1,
      title: "Tahap Pengenalan",
      message: "Selamat! tahap ini sudah selesai",
      isCompleted: true,
      isLocked: false,
      icon: (
        <img 
          src="/assets/svg/Selesai.svg" 
          alt="Tahap Pengenalan" 
          className="w-30 h-30" 
        />
      )
    },
    {
      id: 2,
      title: "Tahap Dasar",
      message: "Selesaikan tahapnya dan lanjut ke tahap selanjutnya!",
      isCompleted: false,
      isLocked: false,
      icon: (
        <img 
          src="/assets/svg/proses.svg" 
          alt="Tahap Dasar" 
          className="w-30 h-30"
        />
      )
    },
    {
      id: 3,
      title: "Tahap Mini Project",
      message: "Tahap in masih terkunci! Selesaikan dulu tahap sebelumnya",
      isCompleted: false,
      isLocked: true,
      icon: null
    },
    {
      id: 4,
      title: "Tahap Big Project",
      message: "Tahap in masih terkunci! Selesaikan dulu tahap sebelumnya",
      isCompleted: false,
      isLocked: true,
      icon: null
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Route Project</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => (
          <ProjectStageCard
            key={stage.id}
            title={stage.title}
            message={stage.message}
            isCompleted={stage.isCompleted}
            isLocked={stage.isLocked}
            icon={stage.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default RouteProject;