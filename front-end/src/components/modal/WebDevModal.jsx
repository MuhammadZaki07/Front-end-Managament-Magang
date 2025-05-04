import { useState } from 'react';
import { X } from 'lucide-react';

export default function WebDevModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const steps = [
    { number: '01', title: 'Tahap Pengenalan', color: 'bg-blue-800' },
    { number: '02', title: 'Tahap Dasar', color: 'bg-blue-500' },
    { number: '03', title: 'Tahap Pre mini Project', color: 'bg-blue-400' },
    { number: '04', title: 'Tahap Mini Project', color: 'bg-blue-300' },
    { number: '05', title: 'Tahap Big Project', color: 'bg-blue-300' }
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg w-full max-w-xl mx-4 z-50">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Web Development</h2>
            <button 
              onClick={onClose}
              className="rounded-full bg-gray-100 p-1"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 flex items-center">
              <span className="mr-2">Tanggal:</span>
              {data.date || "24 Maret 2024"}
            </p>
          </div>
          
          <div className="relative mt-8 mb-6 pl-10">
            {/* Vertical timeline line */}
            <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gray-200"></div>
            
            {/* Timeline steps */}
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="relative flex items-start">
                  {/* Circle and step number below */}
                  <div className="absolute -left-10 flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${step.color}`}></div>
                    <div className="mt-1 text-xs text-gray-500">
                      Step {step.number}
                    </div>
                  </div>
                  
                  {/* Step bubble */}
                  <div className={`${step.color} text-white px-4 py-2 rounded-md`}>
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
