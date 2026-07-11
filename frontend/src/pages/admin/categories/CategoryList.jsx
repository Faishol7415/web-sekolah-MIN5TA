import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import api from '../../../api/axios';
import DataTable from '../../../components/admin/DataTable';
import Modal from '../../../components/admin/Modal';
import Button from '../../../components/common/Button';

const CategoryList = () => {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');
  
  const queryClient = useQueryClient();

  // Fetch data
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-categories', page],
    queryFn: async () => {
      const response = await api.get(`/admin/categories?page=${page}`);
      return response.data;
    },
    keepPreviousData: true,
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (newCategory) => api.post('/admin/categories', newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      closeModal();
    },
    onError: (error) => {
      setFormError(error.response?.data?.message || 'Gagal menyimpan kategori');
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      closeModal();
    },
    onError: (error) => {
      setFormError(error.response?.data?.message || 'Gagal mengubah kategori');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });

  const columns = [
    { key: 'name', label: 'Nama Kategori', render: (row) => <span className="font-bold">{row.name}</span> },
    { key: 'slug', label: 'Slug', render: (row) => <span className="text-slate-500 font-mono text-xs">{row.slug}</span> },
    { key: 'description', label: 'Deskripsi', render: (row) => <span className="line-clamp-1">{row.description || '-'}</span> },
    {
      key: 'actions',
      label: 'Aksi',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => openModal(row)}
            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            title="Edit"
          >
            <FaEdit />
          </button>
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

  const openModal = (category = null) => {
    setFormError('');
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini? Data yang terhubung mungkin akan terpengaruh.')) {
      deleteMutation.mutate(id);
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <Helmet>
        <title>Kelola Kategori | CMS MIN 5 Tulungagung</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Kelola Kategori</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manajemen kategori untuk berita dan artikel.</p>
        </div>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <FaPlus /> Tambah Kategori
        </Button>
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

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {formError}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nama Kategori <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
              placeholder="Contoh: Pengumuman"
            />
            <p className="text-xs text-slate-500 mt-1">Slug akan di-generate secara otomatis.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi
            </label>
            <textarea 
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Opsional: Keterangan singkat mengenai kategori ini"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700 mt-6">
            <button 
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Batal
            </button>
            <Button type="submit" disabled={isMutating}>
              {isMutating ? <span className="flex items-center gap-2"><FaSpinner className="animate-spin" /> Menyimpan...</span> : 'Simpan Kategori'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CategoryList;
