import Button from "../../Button";
import LogoCompany from "../../LogoCompany";

const MyPartner = () => {
  const data = ["airbnb", "Amazon", "FeedEx", "Google", "HubSpot", "Microsoft"];
  return (
    <section className="w-full py-32 px-44 bg-white">
      <div className="space-y-3">
        <h1 className="uppercase text-2xl text-center text-color-blue font-bold">
          My Partner
        </h1>
        <p className="text-slate-800 text-center font-semibold text-xl">
          Tumbuh bersama Kolaborasi menuju kesuksesan
        </p>
      </div>
      <div className="border-y-2 border-slate-300/[0.5] py-13 grid grid-cols-6 gap-8 mt-8">
        {data.map((item, index) => (
          <LogoCompany key={index + 1} titleLogo={item} />
        ))}
      </div>
      <div className="flex justify-center">
      <Button icon={`bi-arrow-right`}>Lihat semua divisi</Button>
      </div>
    </section>
  );
};

export default MyPartner;
