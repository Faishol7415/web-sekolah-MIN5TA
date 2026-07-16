import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaUserCircle, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../../api/axios';
import DataTable from '../../../components/admin/DataTable';
import Modal from '../../../components/admin/Modal';
import Button from '../../../components/common/Button';
import { useAuth } from '../../../contexts/AuthContext';

const UserList = () => {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    role: 'admin',
    is_active: true
  });
  const [formError, setFormError] = useState('');

  // Fetch data
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: async () => {
      const response = await api.get(`/admin/users?page=${page}`);
      return response.data;
    },
    keepPreviousData: true,
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (newData) => api.post('/admin/users', newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      closeModal();
    },
    onError: (error) => {
      setFormError(error.response?.data?.message || 'Gagal menyimpan pengguna');
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      closeModal();
    },
    onError: (error) => {
      setFormError(error.response?.data?.message || 'Gagal mengubah data pengguna');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const columns = [
    { 
      key: 'user', 
      label: 'Pengguna', 
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.avatar ? (
            <img src={row.avatar} alt={row.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
          ) : (
            <FaUserCircle className="w-10 h-10 text-slate-300" />
          )}
          <div>
            <p className="font-bold flex items-center gap-2">
              {row.name} 
              {currentUser?.id === row.id && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full">Anda</span>}
            </p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ) 
    },
    { 
      key: 'role', 
      label: 'Peran', 
      render: (row) => (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 w-fit">
          <FaShieldAlt /> {row.roles?.[0]?.name || 'Admin'}
        </span>
      ) 
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          row.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
        }`}>
          {row.is_active ? 'Aktif' : 'Non-Aktif'}
        </span>
      ) 
    },
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
          {currentUser?.id !== row.id && (
            <button 
              onClick={() => handleDelete(row.id)}
              className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              title="Hapus"
            >
              <FaTrash />
            </button>
          )}
        </div>
      ),
    },
  ];

  const openModal = (item = null) => {
    setFormError('');
    setShowPassword(false);
    if (item) {
      setEditingItem(item);
      setFormData({ 
        name: item.name, 
        email: item.email,
        password: '', // Blank on edit unless changing
        role: item.roles?.[0]?.name || 'admin',
        is_active: item.is_active === 1 || item.is_active === true
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', email: '', password: '', role: 'admin', is_active: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      // Don't send empty password on update
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.password) {
        delete dataToSubmit.password;
      }
      updateMutation.mutate({ id: editingItem.id, data: dataToSubmit });
    } else {
      if (!formData.password) {
        setFormError('Kata sandi wajib diisi untuk pengguna baru.');
        return;
      }
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus akun pengguna ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <Helmet>
        <title>Kelola Pengguna | CMS MIN 5 Tulungagung</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Manajemen Pengguna</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Kelola akun administrator dan penulis.</p>
        </div>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <FaPlus /> Tambah Pengguna
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
        title={editingItem ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {formError}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Alamat Email <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                placeholder="admin@sekolah.com"
                disabled={editingItem && currentUser?.id === editingItem.id} // Cannot edit own email easily here
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Kata Sandi {editingItem ? '(Kosongkan jika tidak diubah)' : <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full p-2.5 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Peran (Role)
              </label>
              <select 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                disabled={editingItem && currentUser?.id === editingItem.id} // Cannot change own role
              >
                <option value="admin">Administrator</option>
                <option value="editor">Penulis/Author</option>
              </select>
            </div>
            
            <div className="flex flex-col justify-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded"
                  disabled={editingItem && currentUser?.id === editingItem.id} // Cannot deactivate oneself
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Akun Aktif</span>
              </label>
            </div>
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
              {isMutating ? <span className="flex items-center gap-2"><FaSpinner className="animate-spin" /> Menyimpan...</span> : 'Simpan Pengguna'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UserList;
