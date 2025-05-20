import { useState } from 'react';
import { Calendar } from 'lucide-react';

export default function ProjectListing() {
  const [projects] = useState([
    {
      id: 1,
      title: 'Solo Project',
      date: '24 Maret 2024',
      image: '/assets/img/Cover3.png',
      type: 'solo'
    },
    {
      id: 2,
      title: 'Mini Project',
      date: '12 April 2024',
      image: '/assets/img/Cover3.png',
      type: 'mini'
    },
    {
      id: 3,
      title: 'Big Project',
      date: '24 Juli 2024',
      image: '/assets/img/Cover3.png',
      type: 'big'
    },
    {
      id: 4,
      title: 'Solo Project',
      date: '15 Agustus 2024',
      image: '/assets/img/Cover3.png',
      type: 'solo'
    },
    {
      id: 5,
      title: 'Mini Project',
      date: '10 September 2024',
      image: '/assets/img/Cover3.png',
      type: 'mini'
    },
    {
      id: 6,
      title: 'Big Project',
      date: '30 Oktober 2024',
      image: '/assets/img/Cover3.png',
      type: 'big'
    }
  ]);

  const handleViewDetail = (id) => {
    console.log(`Viewing project detail for ID: ${id}`);
    // Navigation logic would go here
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Project</h1>
        <a href="#" className="text-blue-500 hover:text-blue-700 text-sm">See All</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg overflow-hidden border border-[#CED2D9]">
            <div className="px-2 py-2 flex justify-center">
              <img
                src={project.image}
                alt={project.title}
                className="h-35 w-full object-contain rounded-lg"
              />
            </div>
            <div className="px-4 py-2">
              <h3 className="font-medium text-gray-800">{project.title}</h3>
              <div className="flex items-center mt-2 text-gray-500 text-sm">
                <Calendar size={16} className="mr-1" />
                <span className="text-xs">{project.date}</span>
              </div>
              <button
                onClick={() => handleViewDetail(project.id)}
                className="mt-4 w-full py-2 bg-white text-blue-500 border-2 border-blue-500 rounded-full text-sm hover:bg-blue-50 transition font-medium"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}