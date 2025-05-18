// Dashboard.jsx
import React from 'react';
import StatisticsCard from './StatisticsCard';
import JamKantor from './JamKantor';
import SummaryCards from './SummaryCards';
import MentorPerDivision from './MentorPerDivision';
import Card from './Card';

const Dashboard = () => {
  return (
    <Card>
    <div className="container mx-auto px-2 py-2 min-h-screen">
      {/* Membuat layout grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Kolom Kiri - Lebih Lebar */}
        <div className="flex-[7] w-full flex flex-col gap-2">
          <StatisticsCard />
          <JamKantor/>
        </div>

        {/* Kolom Kanan - Lebih Sempit */}
        <div className="flex-[5] w-full flex flex-col gap-6">
          <SummaryCards />
          <MentorPerDivision />
        </div>
      </div>
    </div>
    </Card>
  );
};

export default Dashboard;
