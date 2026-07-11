import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaFilePdf, FaFileWord, FaFileExcel, FaFileArchive, FaFile } from 'react-icons/fa';
import api from '../../../api/axios';
import DataTable from '../../../components/admin/DataTable';
import Modal from '../../../components/admin/Modal';
import Button from '../../../components/common/Button';

const getFileIcon = (type) => {
  switch (type) {
    case 'pdf': return <FaFilePdf className="text-red-500 text-xl" />;
    case 'doc':
    case 'docx': return <FaFileWord className="text-blue-500 text-xl" />;
    case 'xls':
    case 'xlsx': return <FaFileExcel className="text-green-500 text-xl" />;
    case 'zip':
    case 'rar': return <FaFileArchive className="text-purple-500 text-xl" />;
    default: return <FaFile className="text-slate-400 text-xl" />;
  }
};

const DownloadList = () => {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    file_type: 'pdf',
    file_path: ''
  });
  const [formError, setFormError] = useState('');
  
  const queryClient = useQueryClient();

  // Fetch data
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-downloads', page],
    queryFn: async () => {
      const response = await api.get(`/admin/downloads?page=${page}`);
      return response.data;
    },
    keepPreviousData: true,
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (newData) => api.post('/admin/downloads', newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-downloads'] });
      closeModal();
    },
    onError: (error) => {
      setFormError(error.response?.data?.message || 'Gagal menyimpan file unduhan');
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/downloads/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-downloads'] });
      closeModal();
    },
    onError: (error) => {
      setFormError(error.response?.data?.message || 'Gagal mengubah data unduhan');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/downloads/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-downloads'] });
    },
  });

  const columns = [
    { 
      key: 'title', 
      label: 'Judul / Nama File', 
      render: (row) => (
        <div className="flex items-center gap-3">
          {getFileIcon(row.file_type)}
          <div>
            <p className="font-bold">{row.title}</p>
            <p className="text-xs text-slate-500 line-clamp-1">{row.description}</p>
          </div>
        </div>
      ) 
    },
    { 
      key: 'type', 
      label: 'Tipe', 
      render: (row) => <span className="uppercase text-xs font-bold text-slate-500">{row.file_type}</span> 
    },
    { 
      key: 'downloads_count', 
      label: 'Diunduh', 
      render: (row) => <span className="font-mono text-xs">{row.downloads_count}x</span> 
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

  const openModal = (item = null) => {
    setFormError('');
    if (item) {
      setEditingItem(item);
      setFormData({ 
        title: item.title, 
        description: item.description || '',
        file_type: item.file_type || 'pdf',
        file_path: item.file_path || ''
      });
    } else {
      setEditingItem(null);
      setFormData({ title: '', description: '', file_type: 'pdf', file_path: '' });
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
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <Helmet>
        <title>Kelola Pusat Unduhan | CMS MIN 5 Tulungagung</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Kelola Unduhan</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manajemen file publik (Brosur, Formulir, Tata Tertib, dll).</p>
        </div>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <FaPlus /> Tambah File
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
        title={editingItem ? 'Edit File Unduhan' : 'Tambah File Unduhan Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {formError}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Judul File <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
              placeholder="Contoh: Formulir Pendaftaran PPDB 2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tipe File <span className="text-red-500">*</span>
              </label>
              <select 
                required
                value={formData.file_type}
                onChange={(e) => setFormData({...formData, file_type: e.target.value})}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="pdf">PDF (.pdf)</option>
                <option value="doc">Word (.doc / .docx)</option>
                <option value="xls">Excel (.xls / .xlsx)</option>
                <option value="zip">Archive (.zip / .rar)</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                URL Path (Sementara)
              </label>
              <input 
                type="text" 
                value={formData.file_path}
                onChange={(e) => setFormData({...formData, file_path: e.target.value})}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                placeholder="/uploads/files/sample.pdf"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi Singkat
            </label>
            <textarea 
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Penjelasan singkat mengenai file ini"
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
              {isMutating ? <span className="flex items-center gap-2"><FaSpinner className="animate-spin" /> Menyimpan...</span> : 'Simpan File'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default DownloadList;
