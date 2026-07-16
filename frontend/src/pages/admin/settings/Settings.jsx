import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { FaSave, FaSpinner, FaGlobe, FaMapMarkerAlt, FaPhone, FaBuilding } from 'react-icons/fa';
import api from '../../../api/axios';
import Button from '../../../components/common/Button';

const Settings = () => {
  const [formData, setFormData] = useState({
    school_name: 'MIN 5 Tulungagung',
    school_tagline: 'Madrasah Ramah anak - Madrasah Adiwiyata - Tiada Hari Tanpa Prestasi',
    school_address: 'Dusun Pundensari, RT 01 RW 02, Desa/Kecamatan Rejotangan, Kabupaten Tulungagung, Jawa Timur 66293',
    school_email: 'min5tulungagung@gmail.com',
    school_phone: '+62 856-4583-2705',
    school_phone: '+62 856-4583-2705',
    meta_title: 'MIN 5 Tulungagung | Website Resmi',
    meta_description: 'Website resmi MIN 5 Tulungagung. Madrasah Ibtidaiyah Negeri unggulan di Tulungagung.',
    hero_btn2_text: 'Jelajahi Berita',
    hero_btn2_url: '#berita',
    hero_btn2_show: '1',
  });
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const response = await api.get('/admin/settings');
      return response.data;
    }
  });

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...data
      }));
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      return api.post('/admin/settings/batch', data);
    },
    onSuccess: () => {
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setIsSuccess(false), 5000);
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
    onError: () => {
      setError('Gagal menyimpan pengaturan.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? (e.target.checked ? '1' : '0') : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    mutation.mutate(formData);
  };

  return (
    <>
      <Helmet>
        <title>Pengaturan Website | CMS MIN 5 Tulungagung</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Pengaturan Identitas Website</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Kelola informasi dasar sekolah dan konfigurasi SEO.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        
        {isSuccess && (
          <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm border border-emerald-100 font-medium flex items-center gap-2">
            Pengaturan berhasil disimpan. Perubahan mungkin memerlukan muat ulang halaman publik untuk terlihat.
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        {/* Identitas Sekolah */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-3">
            <FaBuilding className="text-primary" />
            <h3 className="font-bold text-slate-800 dark:text-white">Identitas Sekolah</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nama Madrasah
              </label>
              <input 
                type="text" 
                name="school_name"
                value={formData.school_name}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Slogan / Tagline
              </label>
              <input 
                type="text" 
                name="school_tagline"
                value={formData.school_tagline}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
                <FaPhone className="text-slate-400" /> Nomor Telepon / WA
              </label>
              <input 
                type="text" 
                name="school_phone"
                value={formData.school_phone}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
                <FaGlobe className="text-slate-400" /> Email Resmi
              </label>
              <input 
                type="email" 
                name="school_email"
                value={formData.school_email}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
                <FaMapMarkerAlt className="text-slate-400" /> Alamat Lengkap
              </label>
              <textarea 
                name="school_address"
                rows="2"
                value={formData.school_address}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-bold text-slate-800 dark:text-white">Pengaturan SEO Dasar</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Meta Title
              </label>
              <input 
                type="text" 
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                placeholder="Judul website pada pencarian Google"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Meta Description
              </label>
              <textarea 
                name="meta_description"
                rows="3"
                value={formData.meta_description}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Deskripsi singkat website untuk mesin pencari"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Hero Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-bold text-slate-800 dark:text-white">Pengaturan Tombol Sekunder Beranda (Hero)</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <input 
                type="checkbox" 
                name="hero_btn2_show"
                id="hero_btn2_show"
                checked={formData.hero_btn2_show === '1'}
                onChange={handleChange}
                className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="hero_btn2_show" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                Tampilkan Tombol Sekunder
              </label>
            </div>

            {formData.hero_btn2_show === '1' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Teks Tombol
                  </label>
                  <input 
                    type="text" 
                    name="hero_btn2_text"
                    value={formData.hero_btn2_text}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Contoh: Jelajahi Berita"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tautan / URL Tombol
                  </label>
                  <input 
                    type="text" 
                    name="hero_btn2_url"
                    value={formData.hero_btn2_url}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Contoh: #berita"
                  />
                  <p className="text-xs text-slate-500 mt-1">Gunakan awalan <code>#</code> untuk gulir ke bawah halaman.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending} className="flex items-center gap-2 px-8">
            {mutation.isPending ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {mutation.isPending ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
          </Button>
        </div>
        
      </form>
    </>
  );
};

export default Settings;
