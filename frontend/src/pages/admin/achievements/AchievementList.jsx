import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaImage, FaUpload, FaEye } from 'react-icons/fa';
import api from '../../../api/axios';
import DataTable from '../../../components/admin/DataTable';
import Modal from '../../../components/admin/Modal';
import Button from '../../../components/common/Button';
import { useToast } from '../../../components/common/Toast';
import ImageCropper from '../../../components/admin/ImageCropper';

const AchievementList = () => {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    type: 'akademik',
    level: '',
    rank: '',
    participant: '',
    date: '',
    year: new Date().getFullYear().toString(),
    image: ''
  });
  const [formError, setFormError] = useState('');
  
  const toast = useToast();
  const [cropImage, setCropImage] = useState(null);
  
  const queryClient = useQueryClient();

  // Fetch data
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-achievements', page],
    queryFn: async () => {
      const response = await api.get(`/admin/achievements?page=${page}`);
      return response.data;
    },
    keepPreviousData: true,
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (newData) => api.post('/admin/achievements', newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-achievements'] });
      toast.success('Data prestasi berhasil ditambahkan!');
      closeModal();
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Gagal menyimpan data prestasi';
      setFormError(msg);
      toast.error(msg);
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/achievements/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-achievements'] });
      toast.success('Data prestasi berhasil diubah!');
      closeModal();
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Gagal mengubah data prestasi';
      setFormError(msg);
      toast.error(msg);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/achievements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-achievements'] });
      toast.success('Data prestasi berhasil dihapus!');
    },
    onError: () => {
      toast.error('Gagal menghapus data prestasi.');
    }
  });

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const uploadData = new FormData();
      uploadData.append('file', file);
      const response = await api.post('/admin/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: (data) => {
      setFormData({ ...formData, image: data.path });
      toast.success('Gambar berhasil diunggah!');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Gagal mengunggah gambar.';
      setFormError(msg);
      toast.error(msg);
    }
  });

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleCropDone = (croppedBlob) => {
    setCropImage(null);
    const croppedFile = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' });
    uploadMutation.mutate(croppedFile);
  };

  const columns = [
    { key: 'title', label: 'Judul / Nama Prestasi', render: (row) => <span className="font-bold">{row.title}</span> },
    { 
      key: 'type', 
      label: 'Jenis', 
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          row.type === 'akademik' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {row.type === 'akademik' ? 'Akademik' : 'Non-Akademik'}
        </span>
      ) 
    },
    { key: 'date', label: 'Tanggal & Tahun', render: (row) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">{row.year}</span>
        {row.date && <span className="text-xs text-slate-500">{new Date(row.date).toLocaleDateString('id-ID')}</span>}
      </div>
    )},
    { key: 'level', label: 'Tingkat', render: (row) => (
      <div className="flex flex-col">
        <span className="text-sm font-bold text-slate-800 dark:text-white">{row.level}</span>
      </div>
    )},
    {
      key: 'actions',
      label: 'Aksi',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => setViewingItem(row)}
            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
            title="Lihat"
          >
            <FaEye />
          </button>
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
        title: item.title || '', 
        description: item.description || '',
        type: item.type || 'akademik',
        level: item.level || '',
        rank: item.rank || '',
        participant: item.participant || '',
        date: item.date || '',
        year: item.year || new Date().getFullYear().toString(),
        image: item.image || ''
      });
    } else {
      setEditingItem(null);
      setFormData({ 
        title: '', 
        description: '', 
        type: 'akademik', 
        level: '',
        participant: '',
        date: '', 
        year: new Date().getFullYear().toString(),
        image: '' 
      });
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
    if (window.confirm('Apakah Anda yakin ingin menghapus data prestasi ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending || uploadMutation.isPending;

  return (
    <>
      <Helmet>
        <title>Kelola Prestasi | CMS MIN 5 Tulungagung</title>
      </Helmet>

      {cropImage && (
        <ImageCropper
          imageSrc={cropImage}
          aspect={4/3}
          onCropDone={handleCropDone}
          onCancel={() => setCropImage(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Kelola Prestasi</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manajemen data pencapaian siswa dan madrasah.</p>
        </div>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <FaPlus /> Tambah Prestasi
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
        title={editingItem ? 'Edit Prestasi' : 'Tambah Prestasi Baru'}
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
              Judul / Nama Prestasi <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
              placeholder="Contoh: Juara 1 Olimpiade Matematika"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select 
                required
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              >
                <option value="akademik">Akademik</option>
                <option value="non_akademik">Non-Akademik</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tingkat <span className="text-red-500">*</span>
              </label>
              <select 
                required
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              >
                <option value="">Pilih Tingkat</option>
                <option value="Kecamatan">Kecamatan</option>
                <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                <option value="Karesidenan">Karesidenan</option>
                <option value="Provinsi">Provinsi</option>
                <option value="Nasional">Nasional</option>
                <option value="Internasional">Internasional</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nama Siswa / Nama Tim (Opsional)
            </label>
            <input 
              type="text" 
              value={formData.participant}
              onChange={(e) => setFormData({...formData, participant: e.target.value})}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
              placeholder="Contoh: Ahmad Fulan"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tanggal
              </label>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tahun <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                placeholder="Contoh: 2026"
                maxLength="4"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Dengan Event :
            </label>
            <textarea 
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Contoh: Olimpiade Sains Nasional Tingkat Provinsi"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Foto Bukti / Dokumentasi (Opsional)
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-900 relative overflow-hidden group">
              {formData.image ? (
                <>
                  <img 
                    src={formData.image.startsWith('http') ? formData.image : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${formData.image}`} 
                    alt="Prestasi" 
                    className="w-full h-32 object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100">
                      Ganti Foto
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                     </label>
                  </div>
                </>
              ) : (
                <>
                  <FaImage className="text-3xl text-slate-400 mb-2" />
                  <p className="text-xs text-slate-500 mb-3">Format JPG/PNG, maksimal 2MB</p>
                  <label className="cursor-pointer px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    {uploadMutation.isPending ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                    {uploadMutation.isPending ? 'Mengunggah...' : 'Pilih Foto'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} disabled={uploadMutation.isPending} />
                  </label>
                </>
              )}
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
              {isMutating ? <span className="flex items-center gap-2"><FaSpinner className="animate-spin" /> Menyimpan...</span> : 'Simpan Prestasi'}
            </Button>
          </div>
        </form>
      </Modal>

            {/* View Modal */}
      <Modal 
        isOpen={!!viewingItem} 
        onClose={() => setViewingItem(null)} 
        title="Detail Prestasi (Preview)"
        maxWidth="max-w-md"
      >
        {viewingItem && (() => {
          const rankText = (viewingItem.title || '').toLowerCase();
          let bgGradient = 'from-primary to-accent';
          let textColor = 'text-accent';
          
          if (rankText.includes('1') || rankText.includes('emas') || rankText.includes('umum')) {
            bgGradient = 'from-yellow-400 to-amber-600';
            textColor = 'text-amber-600';
          } else if (rankText.includes('2') || rankText.includes('perak')) {
            bgGradient = 'from-slate-300 to-slate-500';
            textColor = 'text-slate-500';
          } else if (rankText.includes('3') || rankText.includes('perunggu')) {
            bgGradient = 'from-orange-400 to-orange-600';
            textColor = 'text-orange-600';
          } else if (rankText.includes('harapan')) {
            bgGradient = 'from-blue-400 to-indigo-600';
            textColor = 'text-indigo-600';
          }

          return (
          <div className="flex justify-center p-4">
            {/* Same layout as Landing Page Card */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md flex flex-col w-full max-w-sm">
              <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img 
                  src={viewingItem.image ? (viewingItem.image.startsWith('http') ? viewingItem.image : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${viewingItem.image}`) : 'https://images.unsplash.com/photo-1567057419565-4349c49d8a04?q=80&w=2072&auto=format&fit=crop'} 
                  alt={viewingItem.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-primary-dark dark:text-primary font-bold px-3 py-1 rounded-full text-xs shadow-md">
                  {viewingItem.level || 'Tingkat'}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow relative z-10 text-left">
                <div className={`absolute -top-6 right-6 w-12 h-12 bg-gradient-to-br ${bgGradient} rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-slate-800`}>
                  {viewingItem.type === 'akademik' ? (
                    <svg className="w-5 h-5 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-4.293-1.455c-.234.35-.512.671-.827.955A3.989 3.989 0 015 15a3.989 3.989 0 01-2.656-1.065 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5.165 9.113l-1.092 3.4A1.985 1.985 0 005 13c.672 0 1.258-.339 1.597-.861a1 1 0 011.366-.36l.51.319a2.001 2.001 0 002.554 0l.51-.319a1 1 0 011.366.36c.339.522.925.861 1.597.861.166 0 .326-.02.479-.059l-1.092-3.4-1.954-1.788a1 1 0 01-.158-1.29l.794-1.144-3.52-1.408-3.52 1.408.794 1.144a1 1 0 01-.158 1.29l-1.954 1.788z" clipRule="evenodd"></path></svg>
                  ) : (
                    <svg className="w-5 h-5 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
                  )}
                </div>
                
                <h3 className="font-heading font-bold text-xl text-slate-800 dark:text-white mb-2 line-clamp-2">
                  {viewingItem.title || 'Judul Prestasi'}
                </h3>
                
                {viewingItem.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 italic">
                    Dengan event : {viewingItem.description}
                  </p>
                )}
                
                <div className="mt-auto space-y-2">
                  {viewingItem.level && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <svg className="w-4 h-4 text-slate-400 min-w-[16px]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-4.293-1.455c-.234.35-.512.671-.827.955A3.989 3.989 0 015 15a3.989 3.989 0 01-2.656-1.065 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                      <span className="truncate">Tingkat {viewingItem.level}</span>
                    </div>
                  )}
                  {viewingItem.participant && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <svg className="w-4 h-4 text-slate-400 min-w-[16px]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                      <span className="truncate">{viewingItem.participant}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <svg className="w-4 h-4 text-slate-400 min-w-[16px]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                    <span>
                      {viewingItem.date ? new Date(viewingItem.date).toLocaleDateString('id-ID') : `Tahun ${viewingItem.year || '-'}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )
        })()}
      </Modal>
    </>
  );
};

export default AchievementList;
