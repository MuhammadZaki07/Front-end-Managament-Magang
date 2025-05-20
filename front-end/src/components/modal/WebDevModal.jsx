import { useState } from 'react';
import { X } from 'lucide-react';

export default function WebDevModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;
  console.log(data);
  
  return (
    <div className="bg-orange-100 p-4 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        <div className="p-6 relative">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-3xl font-bold">{data.nama}</h2>
            <button className="rounded-full p-1 hover:bg-gray-100" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          
          {/* Date */}
          <p className="text-gray-500 mb-6">{data.created_at}</p>
          
          {/* Timeline steps */}
          <div className="divide-y divide-gray-200">
            {data.kategori.map((kategori) => (
              <div key={kategori.id} className="py-4 flex items-center">
                {/* Timeline step */}
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-4">
                  {kategori.urutan} {/* Step number */}
                </div>
                <span className="text-blue-600 font-medium text-lg">{kategori.nama}</span>
              </div>
            ))}
            
          </div>
        </div>
      </div>
    </div>
  );
}
