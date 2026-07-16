import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { FaSave, FaArrowLeft, FaSpinner, FaImage, FaUpload } from 'react-icons/fa';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api, { getFileUrl } from '../../../api/axios';
import Button from '../../../components/common/Button';
import { useToast } from '../../../components/common/Toast';
import ImageCropper from '../../../components/admin/ImageCropper';

const SchoolProfileForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    section: 'principal',
    title: '',
    content: '',
    image: '',
    order: 0,
    is_active: true
  });
  const [error, setError] = useState('');

  // Cropper state
  const [cropImage, setCropImage] = useState(null);
  const [cropAspect, setCropAspect] = useState(3 / 4);

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['admin-profile', id],
    queryFn: async () => {
      const response = await api.get(`/admin/school-profiles/${id}`);
      return response.data.data;
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        section: profileData.section || 'principal',
        title: profileData.title || '',
        content: profileData.content || '',
        image: profileData.image || '',
        order: profileData.order ?? 0,
        is_active: profileData.is_active === undefined ? true : !!profileData.is_active
      });
    }
  }, [profileData]);

  const mutation = useMutation({
    mutationFn: (data) => {
      if (isEditMode) {
        return api.put(`/admin/school-profiles/${id}`, data);
      }
      return api.post('/admin/school-profiles', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['admin-profile', id] });
      }
      queryClient.invalidateQueries({ queryKey: ['public-profiles'] });
      toast.success(isEditMode ? 'Konten berhasil diperbarui!' : 'Konten berhasil ditambahkan!');
      navigate('/admin/profil');
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Gagal menyimpan profil.';
      setError(msg);
      toast.error(msg);
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const fd = new FormData();
      fd.append('file', file);
      const response = await api.post('/admin/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: (data) => {
      setFormData((prev) => ({ ...prev, image: data.path }));
      toast.success('Gambar berhasil diunggah!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal mengunggah gambar.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    mutation.mutate(formData);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content: content
    });
  };

  // Open cropper when user selects an image
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImage(reader.result);
        // Set aspect ratio based on section
        setCropAspect(formData.section === 'principal' ? 3 / 4 : 16 / 9);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // After cropping, upload the cropped blob
  const handleCropDone = (croppedBlob) => {
    setCropImage(null);
    const croppedFile = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' });
    uploadMutation.mutate(croppedFile);
  };

  if (isEditMode && isLoadingProfile) {
    return <div className="flex justify-center p-12"><FaSpinner className="animate-spin text-3xl text-primary" /></div>;
  }

  return (
    <>
      <Helmet>
        <title>{isEditMode ? 'Edit Konten' : 'Tambah Konten'} | CMS MIN 5 Tulungagung</title>
      </Helmet>

      {/* Image Cropper Modal */}
      {cropImage && (
        <ImageCropper
          imageSrc={cropImage}
          aspect={cropAspect}
          onCropDone={handleCropDone}
          onCancel={() => setCropImage(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link 
            to="/admin/profil"
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              {isEditMode ? 'Edit Konten Beranda' : 'Tambah Konten Beranda'}
            </h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bagian (Section) <span className="text-red-500">*</span></label>
                <select 
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary font-medium"
                >
                  <option value="principal">Sambutan Kepala Madrasah</option>
                  <option value="video">Video Profil (Link YouTube)</option>
                  <option value="content">Isi Tambahan</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">Pilih blok konten beranda mana yang ingin Anda isi.</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Judul Tampil / Nama <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Misal: Drs. H. Ahmad Fulan, M.Pd.I"
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary font-bold text-lg"
                />
              </div>

              {formData.section === 'video' ? (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Link Video YouTube <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="url" 
                    name="content"
                    required
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Contoh: https://www.youtube.com/embed/xxxxx"
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-slate-500 mt-2">Masukkan URL video YouTube. Gunakan format embed untuk hasil terbaik.</p>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Konten / Isi Profil <span className="text-red-500">*</span>
                  </label>
                  <div className="bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 dark:[&_.ql-toolbar]:border-slate-600 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[300px]">
                    <ReactQuill 
                      theme="snow" 
                      value={formData.content} 
                      onChange={handleContentChange}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          [{ 'align': [] }],
                          ['blockquote', 'link'],
                          ['clean']
                        ],
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Tips: Anda dapat menggunakan fitur &quot;Blockquote&quot; (Tanda Kutip) untuk membedakan ucapan sambutan dengan paragraf biasa.</p>
                </div>
              )}

            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Foto / Gambar (Opsional)</h3>
              
              {formData.section !== 'video' && (
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-900 relative overflow-hidden group mb-6">
                  {formData.image ? (
                    <>
                      {(() => {
                        return (
                          <img 
                            src={getFileUrl(formData.image)} 
                            alt="Profil" 
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        );
                      })()}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100">
                          Ganti Gambar
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                         </label>
                      </div>
                    </>
                  ) : (
                    <>
                      <FaImage className="text-4xl text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500 mb-4">Pilih foto (Rasio portrait disarankan untuk Kepala Madrasah).</p>
                      <label className="cursor-pointer px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        {uploadMutation.isPending ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                        {uploadMutation.isPending ? 'Mengunggah...' : 'Pilih Gambar'}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} disabled={uploadMutation.isPending} />
                      </label>
                    </>
                  )}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Urutan Tampil</label>
                <input 
                  type="number" 
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="mb-6 flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 rounded text-primary focus:ring-primary"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Aktifkan Profil Ini
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full flex justify-center items-center gap-2"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {mutation.isPending ? 'Menyimpan...' : 'Simpan Konten'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default SchoolProfileForm;
