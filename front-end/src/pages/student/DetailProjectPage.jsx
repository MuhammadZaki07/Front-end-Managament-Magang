// DetailProjectPage.jsx
import React from 'react';
import ProjectHeader from '../../components/cards/ProjectHeader';
import ProgressReview from '../../components/cards/ProgressReview';
import BigProjectCard from '../../components/cards/BigProjectCard';
import ReviewForm from '../../components/cards/ReviewForm';
import ReviewDetailList from '../../components/cards/ReviewDetailList';

const DetailProjectPage = () => {
  return (
    
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column (2/3 width on large screens) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg mb-6">
              <ProjectHeader 
                projectTitle="Tahap Mini"
                studentName="William James Moriarty"
                category="Web Development"
                mentorName="Gojo Satoru"
                mentorTitle="Mentor Web Development"
              />
              <ReviewForm />
            </div>
          </div>
          
          {/* Right column (1/3 width on large screens) */}
          <div className="space-y-6">
            <ProgressReview 
              progressPercent={12.5}
              remainingPercent={87.5}
            />
            <BigProjectCard />
          </div>
        </div>
        
        {/* Bottom section that spans full width */}
        <div className="mt-6">
          <ReviewDetailList />
        </div>
      </div>

  );
};

export default DetailProjectPage;