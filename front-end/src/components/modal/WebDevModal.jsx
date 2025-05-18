import { useState } from 'react';
import { X } from 'lucide-react';

export default function WebDevModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;
  
  return (
    <div className="bg-orange-100 p-4 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        <div className="p-6 relative">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-3xl font-bold">Web Development</h2>
            <button className="rounded-full p-1 hover:bg-gray-100" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          
          {/* Date */}
          <p className="text-gray-500 mb-6">24 Maret 2024</p>
          
          {/* Timeline steps */}
          <div className="divide-y divide-gray-200">
            <div className="py-4 flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-4">
                01
              </div>
              <span className="text-blue-600 font-medium text-lg">Tahap Pengenalan</span>
            </div>
            
            <div className="py-4 flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-4">
                02
              </div>
              <span className="text-blue-600 font-medium text-lg">Tahap Dasar</span>
            </div>
            
            <div className="py-4 flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-4">
                02
              </div>
              <span className="text-blue-600 font-medium text-lg">Tahap Pre Mini Project</span>
            </div>
            
            <div className="py-4 flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-4">
                02
              </div>
              <span className="text-blue-600 font-medium text-lg">Tahap Mini Project</span>
            </div>
            
            <div className="py-4 flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-4">
                02
              </div>
              <span className="text-blue-600 font-medium text-lg">Tahap Big Project</span>
            </div>
            
            <div className="py-4 flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-4">
                02
              </div>
              <span className="text-blue-600 font-medium text-lg">Tahap Real Project</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// import { useState } from 'react';
// import { X } from 'lucide-react';

// export default function WebDevModal({ isOpen, onClose, data }) {
//   if (!isOpen || !data) return null;
  
//   const steps = [
//     { step: 1, title: 'Tahap Pengenalan' },
//     { step: 2, title: 'Tahap Dasar' },
//     { step: 3, title: 'Tahap Pre Mini Project' },
//     { step: 4, title: 'Tahap Mini Project' },
//     { step: 5, title: 'Tahap Big Project' }
//   ];

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
//       <div className="bg-white rounded-lg w-full max-w-lg mx-4 z-50 shadow-lg">
//         <div className="p-6">
//           {/* Header with close button */}
//           <div className="flex justify-between items-center mb-2">
//             <h2 className="text-2xl font-bold">Web Development</h2>
//             <button
//               onClick={onClose}
//               className="rounded-full p-1 hover:bg-gray-100"
//             >
//               <X size={24} />
//             </button>
//           </div>
          
//           {/* Date */}
//           <p className="text-gray-500 mb-8">24 Maret 2024</p>
          
//           {/* Timeline */}
//           <div className="relative pl-8">
//             {/* Vertical line */}
//             <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
//             {/* Timeline steps */}
//             <div className="space-y-12">
//               {steps.map((step) => (
//                 <div key={step.step} className="relative">
//                   {/* Circle - positioned centered on the line */}
//                   <div className="absolute -left-4 mt-1" style={{ transform: 'translateX(-50%)' }}>
//                     <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center border-4 border-white"></div>
//                   </div>
                  
//                   {/* Content */}
//                   <div className="ml-8">
//                     <h3 className="text-lg font-bold">
//                       Step {step.step} : <span className="text-[#667797] font-normal">{step.title}</span>
//                     </h3>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// JANGAN DI HAPUSSS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!




// import { useState } from 'react';
// import { X } from 'lucide-react';

// export default function WebDevModal({ isOpen, onClose, data }) {
//   if (!isOpen || !data) return null;

//   const steps = data.steps || []; // gunakan data asli

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
//       <div className="bg-white rounded-lg w-full max-w-xl mx-4 z-50">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold">{data.title || "Web Development"}</h2>
//             <button 
//               onClick={onClose}
//               className="rounded-full bg-gray-100 p-1"
//             >
//               <X size={20} />
//             </button>
//           </div>
          
//           <div className="mb-4">
//             <p className="text-sm text-gray-600 flex items-center">
//               <span className="mr-2">Tanggal:</span>
//               {data.date || "-"}
//             </p>
//           </div>
          
//           <div className="relative mt-8 mb-6 pl-10">
//             <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gray-200"></div>
            
//             <div className="space-y-8">
//               {steps.map((step, index) => (
//                 <div key={index} className="relative flex items-start">
//                   <div className="absolute -left-10 flex flex-col items-center">
//                     <div className={`w-4 h-4 rounded-full ${step.color || 'bg-blue-500'}`}></div>
//                     <div className="mt-1 text-xs text-gray-500">
//                       Step {step.number}
//                     </div>
//                   </div>
//                   <div className={`${step.color || 'bg-blue-500'} text-white px-4 py-2 rounded-md`}>
//                     {step.title}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           <div className="flex justify-end mt-4">
//             <button 
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
