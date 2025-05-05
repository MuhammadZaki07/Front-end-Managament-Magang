import React from "react";
import StatusCards from "../../components/cards/StatusCards";
import Card from "../../components/cards/Card";
import DivisiStats from "../../components/charts/DivisiStats";
import StudentStatisticsChart from "../../components/charts/StudentStatisticsChart";
import StudentStatusChart from "../../components/charts/StudentStatusChart";
import OfficeHours from "../../components/cards/OfficeHours";
import ScheduleCard from "../../components/cards/ScheduleCard";
import SummaryProject from "../../components/charts/SummaryProject";
import StatsMentor from "../../components/charts/StatsMentor"
import CountCard from "../../components/cards/CountCards";

const AdminDashboard = () => {
  return (
    <div className="p-4 w-full">
      {/* Status Cards */}
      <Card className="px-4 py-4 mb-5">
        <StatusCards />
      </Card>

      {/* Bagian Chart dan Kalender */}
      <div className="flex w-full gap-5">
        {/* Chart di sebelah kiri */}
        <div className="flex-[8] w-full flex flex-col gap-5">
          <Card className="px-4 py-6">
            <StudentStatisticsChart />
          </Card>
        </div>

        {/* Kalender di sebelah kanan */}
        <div className="flex-[3] flex flex-col gap-5">
          <Card className="px-4 py-4">
            <DivisiStats />
          </Card>
        </div>
      </div>

      {/* Bagian 3 Card */}
      <div className="flex w-full gap-5">
        {/* Card 1 */}
        <div className="flex-[5] flex flex-col gap-5">
          <Card className="px-4 py-6">
            <ScheduleCard />
          </Card>
        </div>

        {/* Card 2 */}
        <div className="flex-[3] flex flex-col gap-5">
          <Card className="px-4 py-4">
            <SummaryProject />
          </Card>
        </div>

        {/* Card 3 yang lebih besar */}
        <div className="flex-[6] flex flex-col gap-5"> {/* Mengubah flex menjadi 6 untuk card ketiga */}
          <Card className="px-4 py-4">
            <StatsMentor />
          </Card>
        </div>
      </div>
      <div className="flex w-full gap-5">
      <div className="flex-[5] flex flex-col gap-5">
          
            <CountCard />

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
