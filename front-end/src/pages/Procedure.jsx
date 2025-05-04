import React from "react";
import Banner from "../components/Banner";
import { StickyScroll } from "../components/ui/StickyScroll";

const Procedure = () => {
  const content = [
    {
      title: "",
      description:
        "",
      image: "",
    },
    {
      sectionTitle: "Prosedur Pendaftaran Perusahaan",
      title: "1. Mulai",
      description:
        "Proses pendaftaran perusahaan untuk program magang dimulai. Pastikan perusahaan Anda memahami seluruh tahapan dan dokumen yang dibutuhkan sebelum melanjutkan proses registrasi.",
      image: "Launching-bro.svg",
    },
    {
      title: "2. Klik 'Daftar sebagai Perusahaan'",
      description:
        "Buka situs resmi kami di manajemen.hummatech.com dan pilih opsi 'Daftar sebagai Perusahaan' untuk memulai proses pendaftaran secara daring.",
      image: "Register.svg",
    },
    {
      title: "3. Isi Formulir Registrasi",
      description:
        "Lengkapi formulir pendaftaran dengan data perusahaan yang valid dan unggah seluruh dokumen pendukung sesuai persyaratan.",
      image: "Reading.svg",
    },
    {
      title: "4. Login ke Akun",
      description:
        "Setelah proses registrasi selesai, login menggunakan email dan kata sandi yang telah Anda daftarkan untuk mengakses dashboard perusahaan.",
      image: "Login.svg",
    },
    {
      title: "5. Selesai",
      description:
        "Akun perusahaan Anda telah aktif dan siap digunakan untuk mengelola siswa magang, termasuk pengaturan divisi, absensi, dan data administrasi lainnya.",
      image: "Done.svg",
    },
  
    {
      sectionTitle: "Prosedur Pendaftaran Magang",
      title: "1. Mulai",
      description:
        "Proses pendaftaran magang dimulai. Pastikan siswa memahami seluruh tahapan dan menyiapkan dokumen yang diperlukan sejak awal.",
      image: "Start.svg",
    },
    {
      title: "2. Siapkan Berkas",
      description:
        "Lengkapi dokumen pendaftaran seperti foto terbaru, CV, Surat Pernyataan Orang Tua, dan Surat Pernyataan Diri untuk keperluan administrasi.",
      image: "Upload-rafiki.svg",
    },
    {
      title: "3. Klik 'Daftar sebagai Siswa Magang'",
      description:
        "Buka situs manajemen.hummatech.com dan klik tombol 'Daftar sebagai Siswa Magang' untuk memulai proses registrasi akun siswa.",
      image: "Register.svg",
    },
    {
      title: "4. Menunggu Persetujuan",
      description:
        "Setelah pendaftaran berhasil, login menggunakan email dan kata sandi yang telah dibuat, kemudian tunggu proses verifikasi dari pihak perusahaan.",
      image: "Process-amico.svg",
    },
    {
      title: "5. Penetapan Divisi",
      description:
        "Perusahaan akan menentukan divisi atau bagian tempat siswa akan melaksanakan kegiatan magang berdasarkan kebutuhan dan profil siswa.",
      image: "Vision board-rafiki.svg",
    },
    {
      title: "6. Magang Dimulai",
      description:
        "Kegiatan magang resmi dimulai sesuai jadwal yang telah ditentukan oleh perusahaan. Pastikan siswa mengikuti seluruh kegiatan dengan disiplin.",
      image: "Company-amico.svg",
    },
    {
      title: "7. Sertifikat Magang",
      description:
        "Setelah siswa menyelesaikan seluruh periode magang, perusahaan akan menerbitkan sertifikat sebagai bukti pengalaman kerja yang sah.",
      image: "Certification-rafiki.svg",
    },
    {
      title: "8. Selesai",
      description:
        "Proses magang dinyatakan selesai. Siswa dapat menggunakan sertifikat yang diterbitkan sebagai nilai tambah dalam portofolio profesional mereka.",
      image: "Done.svg",
    },
    {
      title: "",
      description:
        "",
      image: "",
    },
  ];

  return (
    <>
      <Banner
        title="Procedure"
        subtitle="Home → Procedure"
        backgroundImage="/assets/img/banner/study_tim.jpg"
        possitionIlustration={`right-0 top-18 w-full h-screen z-10`}
        ilustration={`ilustration_blue`}
      />
      <StickyScroll content={content} />
    </>
  );
};

export default Procedure;
