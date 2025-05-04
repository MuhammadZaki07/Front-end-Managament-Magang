import React from "react";
import StatusCards from "../../components/cards/StatusCards";
import Card from "../../components/cards/Card";
import ApprovalChart from "../../components/charts/ApprovalChart";
import StudentStatisticsChart from "../../components/charts/StudentStatisticsChart";
import StudentStatusChart from "../../components/charts/StudentStatusChart"
import OfficeHours from "../../components/cards/OfficeHours";


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
            <StudentStatisticsChart/>
          </Card>
        </div>

        {/* Kalender di sebelah kanan */}
        <div className="flex-[3] flex flex-col gap-5">
          <Card className="px-4 py-4">
            <ApprovalChart />
          </Card>
        </div>
      </div>
      {/* Bagian Chart dan Kalender */}
      <div className="flex w-full gap-5">
        {/* Chart di sebelah kiri */}
        <div className="flex-[7] w-full flex flex-col gap-5">
          <Card className="px-4 py-6">
            <OfficeHours/>
          </Card>
        </div>

        {/* Kalender di sebelah kanan */}
        <div className="flex-[4] flex flex-col gap-5">
          <Card className="px-4 py-4">
            <StudentStatusChart />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
