import { Helmet } from 'react-helmet-async';
import { FaHistory, FaBullseye, FaEye } from 'react-icons/fa';
import Card from '../../components/common/Card';

const Profile = () => {
  return (
    <>
      <Helmet>
        <title>Profil | MIN 5 Tulungagung</title>
      </Helmet>
      
      {/* Header Banner */}
      <div className="bg-primary pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-profile" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-profile)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Profil Madrasah</h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">Mengenal lebih dekat sejarah, visi, misi, dan struktur organisasi MIN 5 Tulungagung.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        
        {/* Visi Misi Tujuan */}
        <div className="grid grid-cols-1 gap-8 mb-20">
          <Card hover={true} className="border-t-4 border-t-amber-400 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 text-2xl">
                <FaEye />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Visi</h2>
            </div>
            <p className="text-xl text-slate-700 dark:text-slate-200 leading-relaxed font-bold italic text-center px-4 md:px-12 py-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              "Terwujudnya Madrasah yang unggul, lulusan yang bertaqwa, mandiri, cerdas, berbudaya lingkungan dan berkepribadian yang berlandaskan gotong royong."
            </p>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card hover={true} className="border-t-4 border-t-primary p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl">
                  <FaBullseye />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Misi</h2>
              </div>
              <ul className="space-y-4 text-slate-600 dark:text-slate-300">
                {[
                  "Meningkatkan manajemen pelayanan mutu",
                  "Meningkatkan kualitas pendidik & tenaga kependidikan",
                  "Meningkatkan sarana dan prasarana yang berkualitas",
                  "Meningkatkan pembelajaran yang efektif dan efisien",
                  "Meningkatkan iklim kompetitif dalam bidang akademik dan non akademik",
                  "Meningkatkan peserta didik yang berkualitas dan siap bersaing di era global",
                  "Meningkatkan pembiasaan pelaksanaan ajaran agama Islam",
                  "Meningkatkan nilai-nilai akhlak mulia",
                  "Melaksanakan kegiatan ketentuan dan aturan yang sesuai dengan norma lingkungan dan kepribadian yang berlandaskan gotong royong",
                  "Meningkatkan hubungan kerjasama internal dan eksternal"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary font-bold min-w-[24px]">{index + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card hover={true} className="border-t-4 border-t-emerald-500 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 text-2xl">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M473.7 73.8l-2.4-2.5c-46-47-118-51.7-169.6-14.8L336 159.9l-96 64 48 128-144-144 96-64-28.6-86.5C159.7 19.6 87 24 40.7 71.4l-2.4 2.4C-4.3 117.4-3.5 190.2 44.5 238l69.8 69.7-104 104c-13.8 13.8-13.8 36.2 0 50l11.3 11.3c13.8 13.8 36.2 13.8 50 0l104-104 69.7 69.8c47.7 47.9 120.3 48.9 164.1 6.3l2.4-2.4c46.4-46.2 46.8-121.7 1.1-167.4L272 131.2l96-64 128 48-144 144 96-64 85.9-29.2c47.9-44.5 48.7-118.8 6.4-162z"></path></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Tujuan</h2>
              </div>
              <ul className="space-y-4 text-slate-600 dark:text-slate-300">
                {[
                  "Mewujudkan manajemen pelayanan mutu yang berkelanjutan untuk meningkatkan kepercayaan masyarakat",
                  "Meningkatkan pelayanan publikasi dan informasi melalui media secara online",
                  "Membimbing dan mengarahkan lulusan dalam memilih jenjang sekolah lanjutan",
                  "Peningkatan sarana dan prasarana yang berkualitas dan berbasis IT",
                  "Mewujudkan tempat ibadah dan kegiatan yang memadai",
                  "Mewujudkan tempat belajar yang nyaman, indah dan sehat",
                  "Peningkatan kemampuan pendidik dan tenaga kependidikan yang professional melalui TOT",
                  "Peningkatan proses belajar mengajar yang efektif dan efisien",
                  "Juara-juara dalam bidang akademik dan non akademik",
                  "Peningkatan kegiatan pengembangan diri guna menambah wawasan peserta didik",
                  "Peningkatan nilai-nilai akhlak mulia peserta didik yang tampak pada perilaku dalam kehidupan sehari-hari",
                  "Terlaksananya tata tertib yang sesuai dengan ketentuan norma lingkungan dan norma kepribadian yang berlandaskan gotong-royong",
                  "Peningkatan kerjasama internal dan eksternal dalam segala kegiatan yang berhubungan dengan kurikulum, kesiswaan, sarana prasarana dan kehumasan",
                  "Terlaksananya madrasah yang peduli dan berdaya lingkungan yang memanfaatkan 3R",
                  "Terwujudnya madrasah yang bebas dari sampah plastik"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-emerald-500 font-bold min-w-[24px]">{index + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Sejarah Singkat */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-2xl shadow-sm">
              <FaHistory />
            </div>
            <h2 className="text-3xl font-heading font-bold text-slate-800 dark:text-white">Sejarah Singkat</h2>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow duration-300">
            <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
              <p className="text-justify leading-relaxed">
                Sejarah MIN 5 Tulungagung bermula dari perubahan status MI PSM Rejotangan menjadi MI Negeri pada 25 Oktober 1993. Di bawah kepemimpinan Drs. Hardiyono, M.Ag. (2007–2014) dan kemudian H. Rohmad, S.Pd., madrasah ini mengalami kemajuan pesat, baik dari segi penataan manajerial, sarana prasarana, maupun peningkatan prestasi akademik dan non-akademik yang signifikan, sehingga menjadikannya salah satu madrasah favorit di tingkat kecamatan.
              </p>
              <p className="text-justify leading-relaxed mt-4">
                Dalam upaya pembinaan akhlak karimah siswa terhadap Allah SWT maupun sesama, para guru di MIN 5 Tulungagung menerapkan tiga metode utama: ketauladanan, pembiasaan, dan latihan. Metode ketauladanan diwujudkan melalui perilaku guru sebagai panutan dan penerapan slogan 5S (senyum, sapa, salam, sopan, santun), sementara metode pembiasaan dan latihan diimplementasikan melalui rutinitas ibadah harian, kegiatan ekstrakurikuler, serta kolaborasi aktif antara pihak sekolah dan orang tua siswa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
