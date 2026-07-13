import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaCheck, FaTimes, FaBook, FaEye } from 'react-icons/fa';
import api from '../../../api/axios';
import Button from '../../../components/common/Button';
import { useToast } from '../../../components/common/Toast';

const SchoolProfileList = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [deleteId, setDeleteId] = useState(null);
  
  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const response = await api.get('/admin/school-profiles');
      return response.data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/school-profiles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['public-profiles'] });
      toast.success('Profil berhasil dihapus!');
      setDeleteId(null);
    },
    onError: () => {
      toast.error('Gagal menghapus profil.');
      setDeleteId(null);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus profil ini?')) {
      setDeleteId(id);
      deleteMutation.mutate(id);
    }
  };

  const getSectionName = (section) => {
    const sections = {
      'principal': 'Sambutan Kepala Madrasah',
      'video': 'Video Profil',
      'content': 'Isi Tambahan'
    };
    return sections[section] || section;
  };

  return (
    <>
      <Helmet>
        <title>Kelola Konten Beranda | CMS MIN 5 Tulungagung</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Kelola Konten Beranda</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Manajemen konten halaman utama (Sambutan Kepala Madrasah, Video Profil, & Isi Tambahan).</p>
        </div>
        <Link to="/admin/profil/tambah">
          <Button className="flex items-center gap-2">
            <FaPlus /> Tambah Konten
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center"><FaSpinner className="animate-spin text-3xl text-primary" /></div>
        ) : error ? (
          <div className="p-6 text-red-500">Gagal memuat data profil.</div>
        ) : profiles?.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Belum ada profil yang ditambahkan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="p-4 font-semibold">Bagian (Section)</th>
                  <th className="p-4 font-semibold w-full">Judul Tampil</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {profiles?.map((profile) => (
                    <tr key={profile.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider">
                           <FaBook /> {getSectionName(profile.section)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{profile.title}</div>
                      </td>
                      <td className="p-4 text-center">
                        {profile.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            <FaCheck size={10} /> Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            <FaTimes size={10} /> Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            to="/"
                            target="_blank"
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Lihat di Beranda"
                          >
                            <FaEye />
                          </Link>
                          <Link 
                            to={`/admin/profil/edit/${profile.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>
                          <button 
                            onClick={() => handleDelete(profile.id)}
                            disabled={deleteMutation.isPending && deleteId === profile.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Hapus"
                          >
                            {deleteMutation.isPending && deleteId === profile.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                          </button>
                        </div>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default SchoolProfileList;
