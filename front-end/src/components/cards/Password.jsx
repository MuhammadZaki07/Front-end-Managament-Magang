import React, { useState } from 'react';
import { EyeOff, Eye, Info } from 'lucide-react';

export default function PasswordSettingsCard() {
  const [showLimit, setShowLimit] = useState(false);
  const [showBound, setShowBound] = useState(false);
  const [showFixed, setShowFixed] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-8xl w-full">
      <h2 className="text-lg font-medium mb-4">Password Settings</h2>

      {/* Password Limit */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium">Password Limit</label>
        </div>
        <div className="text-xs text-gray-500 mb-2">Max Amount Password Limit</div>
        <div className="relative w-1/2">
          <input
            type={showLimit ? "text" : "password"}
            className="w-full p-2 border border-gray-200 rounded-lg pr-10"
            defaultValue="30"
          />
          <button
            onClick={() => setShowLimit(!showLimit)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {showLimit ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      </div>

      {/* Password Bound */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium">Password Bound</label>
        </div>
        <div className="text-xs text-gray-500 mb-2">Max Amount Password Bound</div>
        <div className="relative w-1/2">
          <input
            type={showBound ? "text" : "password"}
            className="w-full p-2 border border-gray-200 rounded-lg pr-10"
            defaultValue="30"
          />
          <button
            onClick={() => setShowBound(!showBound)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {showBound ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      </div>

      {/* Konfirmasi Password */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium">Konfirmasi Password</label>
        </div>
        <div className="text-xs text-gray-500 mb-2">Max Amount Fixed Password</div>
        <div className="relative w-1/2">
          <input
            type={showFixed ? "text" : "password"}
            className="w-full p-2 border border-gray-200 rounded-lg pr-10"
            defaultValue="30"
          />
          <button
            onClick={() => setShowFixed(!showFixed)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {showFixed ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      </div>

      {/* Persyaratan Password */}
      <div className="mb-2">
        <label className="text-sm font-medium">Persyaratan Password:</label>
        <ul className="mt-2 text-xs text-gray-700">
          <li className="flex items-start mb-1">
            <Info size={16} className="mr-1 text-blue-500 flex-shrink-0 mt-px" />
            <span>Setidaknya satu karakter huruf besar</span>
          </li>
          <li className="flex items-start mb-1">
            <Info size={16} className="mr-1 text-blue-500 flex-shrink-0 mt-px" />
            <span>Minimal 8 karakter - pastikan tidak identik dengan kata kunci</span>
          </li>
          <li className="flex items-start">
            <Info size={16} className="mr-1 text-blue-500 flex-shrink-0 mt-px" />
            <span>Minimal satu karakter khusus</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
