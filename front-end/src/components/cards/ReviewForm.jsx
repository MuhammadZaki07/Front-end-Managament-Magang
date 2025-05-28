import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const ReviewForm = ({routeId , onRevisiUpdated}) => {
  const [reviewText, setReviewText] = useState('');
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [submitting, setSubmitting] = useState(false); // New state for submission loading
  const addRevisi = async (e) => {
    e.preventDefault();
    setSubmitting(true)
    if (!submittedReviews || submittedReviews.length === 0) {
      // Show error alert
      await Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Progress tidak boleh kosong!',
        confirmButtonText: 'OK'
      });
      setSubmitting(false)

      return; // stop function supaya axios post ga jalan
    }
    try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/revisi/${routeId}`,
          {progress : submittedReviews},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSubmittedReviews('');

        if (onRevisiUpdated) {
          onRevisiUpdated();
        }

        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Berhasil membuat Revisi',
          confirmButtonText: 'OK'
        });
        
      } catch (err) {
        console.error("Gagal update data:", err);
        
        // Show detailed error in console
        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
          console.error("Response headers:", err.response.headers);
        } else if (err.request) {
          console.error("Request data:", err.request);
        } else {
          console.error("Error message:", err.message);
        }
        
        // Show error alert
        await Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: err.response?.data?.message || 'Terjadi kesalahan saat menambah revisi',
          confirmButtonText: 'OK'
        });
        
      } finally {
        setSubmitting(false); // End loading
      }
  }

  const handleSubmit = () => {
    if (reviewText.trim()) {
      setSubmittedReviews([...submittedReviews, reviewText]);
      setReviewText('');
    }
  };

  const handleDelete = (indexToDelete) => {
    setSubmittedReviews(submittedReviews.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="flex w-full gap-8">
      {/* Left side - Submit form */}
      <div className="w-1/2">
        <div className="px-4 py-4 flex flex-col h-full">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Revisi Yang Diterima</h2>
          <p className="text-sm text-gray-600 mb-3">Masukkan revisi disini untuk upgrade skill kamu!!!</p>
          
          <div className="mb-3 flex-1">
            <textarea
              className="w-full h-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Masukkan Revisimu disini"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end">
            <button 
              className="bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleSubmit}
            >
              Tambah
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Submitted reviews */}
      <div className="w-1/2">
        <div className="px-4 py-4 flex flex-col h-full">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Revisi ditambahkan</h2>
          <p className="text-xs text-gray-600 mb-3">Periksa kembali revisimu, jangan sampai ada yang tertinggal!</p>
          <form onSubmit={addRevisi}>

          <div className="flex-1">
            {submittedReviews.length > 0 ? (
              <div className="space-y-2">
                {submittedReviews.map((review, index) => (
                  <div key={index} className="flex items-start text-sm text-gray-700 group">
                    <span className="font-medium mr-2 text-blue-600 mt-0.5">{index + 1}.</span>
                    <span className="flex-1">{review}</span>
                    <button
                      onClick={() => handleDelete(index)}
                      className="ml-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hapus revisi"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Belum ada revisi yang ditambahkan</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
            type="submit"
            className="bg-blue-600 mt-4 text-white text-sm font-medium px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </>
            ) : 'Simpan'}
          </button>
          </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ReviewForm;