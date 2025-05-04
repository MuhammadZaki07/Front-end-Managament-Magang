import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import NavAdmin from "../components/ui/NavAdmin";

const PerusahaanLayout = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const { role, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarMenus = [
    {
      icon: "bi-grid",
      label: "Dashboard",
      link: "/perusahaan/beranda",
    },
    {
      icon: "bi-building",
      label: "Kelola Cabang",
      hasSubmenu: true,
      submenu: [
        {
          icon: "bi-person",
          label: "Beranda",
          link: "/perusahaan/beranda",
        },
        {
          icon: "bi-person",
          label: "Admin",
          link: "/perusahaan/admin",
        },
        {
          icon: "bi-mortarboard",
          label: "Mentor",
          link: "/perusahaan/mentor",
        },
        {
          icon: "bi-people",
          label: "Peserta Magang",
          link: "/perusahaan/peserta",
        },
        {
          icon: "bi-pc-display",
          label: "Divisi",
          link: "/perusahaan/divisi",
        },
        {
          icon: "bi-buildings",
          label: "Mitra",
          link: "/perusahaan/mitra",
        },
        {
          icon: "bi-check-square",
          label: "Approval",
          link: "/perusahaan/approval",
        },
        {
          icon: "bi-card-list",
          label: "Pendataan",
          link: "/perusahaan/pendataan",
        },
        {
          icon: "bi-card-list",
          label: "Absensi",
          link: "/perusahaan/absensi",
        },
        {
          icon: "bi-envelope",
          label: "Surat",
          link: "/perusahaan/surat",
        },
        {
          icon: "bi-upc-scan",
          label: "RFID",
          link: "/perusahaan/RFID",
        },
        {
          icon: "bi-card-checklist",
          label: "Piket",
          link: "/perusahaan/piket",
        },
      ],
    },
    {
      icon: "bi-grid",
      label: "Lowongan",
      link: "/perusahaan/lowongan",
    },
  ];

  const footerMenus = ["License", "More Themes", "Documentation", "Support"];

  useEffect(() => {
    if ((role && role !== "perusahaan") || !token) {
      const redirectTo = localStorage.getItem("location");
      if (redirectTo) {
        navigate(redirectTo);
        localStorage.removeItem("location");
      } else {
        navigate("/");
      }
    }
  }, [role]);

  return (
    <div className="w-full flex">
      {/* Sidebar */}
      <div className="bg-white border-r border-r-slate-300 w-[238px] h-screen fixed py-4 px-2 z-[50] overflow-y-auto">
        <Link to={`/`}>
          <img
            src="/assets/img/Logo.png"
            alt="Logo"
            className="w-48 mx-auto object-cover"
          />
        </Link>
        <div className="flex flex-col gap-3 mt-8">
          {sidebarMenus.map((menu, idx) => (
            <div key={idx} className="flex flex-col">
              {menu.hasSubmenu ? (
                <>
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === menu.label ? null : menu.label)
                    }
                    className={`px-4 py-2 rounded-lg flex gap-3 text-xs items-center justify-between text-slate-500 transition-all duration-300 ${
                      openMenu === menu.label ? "bg-sky-800 text-white" : "hover:text-sky-500 hover:bg-sky-50"
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <i className={`bi ${menu.icon} text-lg`}></i>
                      <span className="font-light text-sm">{menu.label}</span>
                    </div>
                    <i
                      className={`bi bi-chevron-${
                        openMenu === menu.label ? "up" : "down"
                      } text-xs`}
                    ></i>
                  </button>
                  {openMenu === menu.label && (
                    <div className="ml-4 mt-1 flex flex-col gap-2">
                      {menu.submenu.map((sub, subIdx) => (
                        <Link
                          key={subIdx}
                          to={sub.link}
                          className={`flex items-center gap-3 text-sm px-3 py-1 rounded transition-all text-slate-700 duration-300 ${
                            location.pathname === sub.link
                              ? "bg-sky-50 text-sky-500"
                              : "hover:text-sky-500 hover:bg-sky-50"
                          }`}
                        >
                          <i className={`bi ${sub.icon} text-lg`}></i>
                          <span>{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={menu.link}
                  className={`px-4 py-2 rounded-lg flex gap-3 items-center text-slate-500 transition-all duration-500 ease-in-out ${
                    location.pathname === menu.link && openMenu !== menu.label
                      ? "bg-sky-800 text-white"
                      : "hover:text-sky-500 hover:bg-sky-50"
                  } ${openMenu === menu.label ? "bg-transparent" : ""}`}
                >
                  <i className={`bi ${menu.icon} text-lg`}></i>
                  <span className="font-light text-sm">{menu.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-[238px] flex flex-col min-h-screen">
        <NavAdmin />
        {/* Content wrapper with flex-grow to push footer down */}
        <div className="flex-grow bg-indigo-50 px-3 pt-5 pb-0">
          <Outlet />
        </div>
        
        {/* Footer - positioned at the bottom */}
        <div className="mt-auto">
          <div className="bg-white rounded-t-xl px-5 py-4 w-full flex justify-between">
            <div className="text-slate-400 font-normal text-sm">
              © Copyright Edmate 2024, All Right Reserved
            </div>
            <div className="flex gap-5">
              {footerMenus.map((item, i) => (
                <Link
                  key={i}
                  to="#"
                  className="text-slate-400 text-sm font-normal"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerusahaanLayout;