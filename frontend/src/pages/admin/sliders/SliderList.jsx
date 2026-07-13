import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import api from '../../../api/axios';
import Button from '../../../components/common/Button';
import { useToast } from '../../../components/common/Toast';

const SliderList = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [deleteId, setDeleteId] = useState(null);
  
  const { data: sliders, isLoading, error } = useQuery({
    queryKey: ['admin-sliders'],
    queryFn: async () => {
      const response = await api.get('/admin/sliders');
      return response.data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/sliders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sliders'] });
      toast.success('Slider berhasil dihapus!');
      setDeleteId(null);
    },
    onError: () => {
      toast.error('Gagal menghapus slider.');
      setDeleteId(null);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus slider ini?')) {
      setDeleteId(id);
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <Helmet>
        <title>Kelola Slider | CMS MIN 5 Tulungagung</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Kelola Slider</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Manajemen gambar banner pada halaman utama.</p>
        </div>
        <Link to="/admin/sliders/tambah">
          <Button className="flex items-center gap-2">
            <FaPlus /> Tambah Slider
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center"><FaSpinner className="animate-spin text-3xl text-primary" /></div>
        ) : error ? (
          <div className="p-6 text-red-500">Gagal memuat data slider.</div>
        ) : sliders?.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Belum ada slider yang ditambahkan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="p-4 font-semibold">Urutan</th>
                  <th className="p-4 font-semibold">Gambar</th>
                  <th className="p-4 font-semibold w-full">Judul</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {sliders?.map((slider) => {
                  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
                  const imgUrl = slider.image.startsWith('http') ? slider.image : `${baseUrl}/storage/${slider.image}`;
                  
                  return (
                    <tr key={slider.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 text-slate-800 dark:text-slate-200">{slider.order}</td>
                      <td className="p-4">
                        <img src={imgUrl} alt={slider.title} className="w-24 h-12 object-cover rounded shadow-sm" />
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{slider.title}</div>
                        <div className="text-xs text-slate-500 truncate max-w-xs">{slider.subtitle}</div>
                      </td>
                      <td className="p-4 text-center">
                        {slider.is_active ? (
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
                            to={`/admin/sliders/edit/${slider.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>
                          <button 
                            onClick={() => handleDelete(slider.id)}
                            disabled={deleteMutation.isPending && deleteId === slider.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Hapus"
                          >
                            {deleteMutation.isPending && deleteId === slider.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default SliderList;
