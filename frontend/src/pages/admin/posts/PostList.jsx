import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';
import DataTable from '../../../components/admin/DataTable';
import Button from '../../../components/common/Button';
import { useToast } from '../../../components/common/Toast';

const PostList = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const toast = useToast();

  // Fetch data
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-posts', page],
    queryFn: async () => {
      const response = await api.get(`/admin/posts?page=${page}`);
      return response.data;
    },
    keepPreviousData: true,
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast.success('Berita berhasil dihapus!');
    },
    onError: () => {
      toast.error('Gagal menghapus berita.');
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    { 
      key: 'title', 
      label: 'Judul Berita', 
      render: (row) => (
        <div>
          <p className="font-bold text-slate-800 dark:text-white line-clamp-1">{row.title}</p>
          <p className="text-xs text-slate-500 line-clamp-1">{row.slug}</p>
        </div>
      ) 
    },
    { 
      key: 'category', 
      label: 'Kategori', 
      render: (row) => (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
          {row.category?.name || 'Uncategorized'}
        </span>
      ) 
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          row.status === 'published' 
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        }`}>
          {row.status === 'published' ? 'Dipublikasi' : 'Draf'}
        </span>
      ) 
    },
    { 
      key: 'views', 
      label: 'Dilihat', 
      render: (row) => <span className="text-slate-500 font-mono text-xs">{row.view_count || 0}x</span> 
    },
    {
      key: 'actions',
      label: 'Aksi',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <a 
            href={`/berita/${row.slug}`} 
            target="_blank" 
            rel="noreferrer"
            className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors"
            title="Lihat"
          >
            <FaEye />
          </a>
          <Link 
            to={`/admin/berita/edit/${row.id}`}
            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            title="Edit"
          >
            <FaEdit />
          </Link>
          <button 
            onClick={() => handleDelete(row.id)}
            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            title="Hapus"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Kelola Berita | CMS MIN 5 Tulungagung</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Kelola Berita & Artikel</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manajemen publikasi berita, pengumuman, dan artikel madrasah.</p>
        </div>
        <Link to="/admin/berita/tambah">
          <Button className="flex items-center gap-2">
            <FaPlus /> Tulis Berita Baru
          </Button>
        </Link>
      </div>

      <DataTable 
        columns={columns}
        data={data?.data}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        pagination={data?.meta}
        onPageChange={setPage}
      />
    </>
  );
};

export default PostList;
