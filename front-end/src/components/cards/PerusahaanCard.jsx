import { useState } from "react";

const CompanyCardWithModal = () => {
  // State untuk data perusahaan
  const [companyName, setCompanyName] = useState("PT. HUMMA TECHNOLOGY INDONESIA");
  const [description, setDescription] = useState(
    "Perusahaan ini bergerak di bidang Informasi dan Teknologi untuk perkembangan Industri"
  );
  const [contactPerson, setContactPerson] = useState("Afrizal Himawan");
  
  // State untuk modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State untuk form data
  const [branchName, setBranchName] = useState("Jakarta"); // Nama cabang
  const [businessField, setBusinessField] = useState("Informasi dan Teknologi"); // Bidang Usaha
  const [address, setAddress] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Fungsi untuk membuka modal
  const openModal = () => setIsModalOpen(true);

  // Fungsi untuk menutup modal
  const closeModal = () => setIsModalOpen(false);

  // Handle alamat change
  const handleAddressChange = (e) => {
    const text = e.target.value;
    setAddress(text);
    setCharCount(text.length);
  };

  return (
    <>
      {/* Kartu utama */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Gambar Header */}
        <div>
          <img
            src="/assets/img/Cover.png"
            alt="Cover"
            className="w-full h-60 object-cover"
          />
        </div>

        {/* Info Perusahaan */}
        <div className="w-full px-6 pt-4 pb-4 flex justify-between items-start">
          {/* Logo dan info */}
          <div className="flex items-start gap-4">
            <img
              src="/assets/img/logoperusahaan.png"
              alt="Logo"
              className="w-14 h-14 rounded-full border border-gray-200"
            />

            <div>
              <h2 className="text-lg font-semibold text-black-800 flex items-center gap-2 mb-2">
                {companyName}
                {/* Icon centang verified dengan warna biru */}
                <i className="bi bi-patch-check-fill" style={{ color: "#0069AB" }}></i>

                {/* Nama cabang */}
                <span className="text-sm text-black-600">(Cabang {branchName})</span>
              </h2>
              <p className="text-sm text-black-600">
                Perusahaan ini bergerak di bidang {businessField} untuk perkembangan Industri
              </p>

              {/* Lokasi dan Kontak */}
              <div className="text-xs text-black-500 flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1">
                  <i className="bi bi-person-fill"></i> {contactPerson}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyCardWithModal;
