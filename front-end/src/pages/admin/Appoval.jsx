import DataApproval from "../../components/cards/DataApproval";
import ApprovalData from "../../components/cards/ApprovalData";

const Approval = () => {
  const approvalImage = "/assets/img/banner/Rectangle 1110.png";

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Banner with image */}
        <div className="relative">
          <img src={approvalImage} alt="Approval Image" className="w-full h-48 object-cover" />
          <h2 className="absolute top-0 left-0 p-6 text-3xl font-bold text-white">
            Approval
          </h2>
        </div>

        {/* Card that overlaps with the banner */}
        <div className="relative -mt-24 px-6">
          <ApprovalData />
        </div>
        
        {/* Data approval table component with minimal spacing */}
        <div className="mt-8 px-6 pb-6">
          <DataApproval />
        </div>
      </div>
    </div>
  );
};

export default Approval;