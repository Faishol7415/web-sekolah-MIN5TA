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

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    content: '',
    excerpt: '',
    status: 'draft',
    image: ''
  });
  const [error, setError] = useState('');

  const toast = useToast();
  const [cropImage, setCropImage] = useState(null);
  const [cropAspect, setCropAspect] = useState(16 / 9);

  // Fetch Categories for dropdown
  const { data: categories } = useQuery({
    queryKey: ['admin-categories-all'],
    queryFn: async () => {
      const response = await api.get('/admin/categories?per_page=100');
      // CategoryController returns paginated format: {data: [...], current_page, ...}
      return response.data.data || [];
    }
  });

  // Fetch Post if in edit mode
  const { data: postData, isLoading: isLoadingPost } = useQuery({
    queryKey: ['admin-post', id],
    queryFn: async () => {
      const response = await api.get(`/admin/posts/${id}`);
      return response.data.data;
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (postData) {
      setFormData({
        title: postData.title || '',
        category_id: postData.category_id || '',
        content: postData.content || '',
        excerpt: postData.excerpt || '',
        status: postData.status || 'draft',
        image: postData.image || ''
      });
    }
  }, [postData]);

  // Mutations
  const mutation = useMutation({
    mutationFn: (data) => {
      if (isEditMode) {
        return api.put(`/admin/posts/${id}`, data);
      }
      return api.post('/admin/posts', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast.success(isEditMode ? 'Berita berhasil diperbarui!' : 'Berita berhasil ditambahkan!');
      navigate('/admin/berita');
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Gagal menyimpan berita.';
      setError(msg);
      toast.error(msg);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    mutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content: content
    });
  };

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/admin/upload', formData, {
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

  if (isEditMode && isLoadingPost) {
    return <div className="flex justify-center p-12"><FaSpinner className="animate-spin text-3xl text-primary" /></div>;
  }

  return (
    <>
      <Helmet>
        <title>{isEditMode ? 'Edit Berita' : 'Tulis Berita Baru'} | CMS MIN 5 Tulungagung</title>
      </Helmet>

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
            to="/admin/berita"
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              {isEditMode ? 'Edit Berita' : 'Tulis Berita Baru'}
            </h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Form */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Judul Berita <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary font-bold text-lg"
                  placeholder="Masukkan judul berita yang menarik"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Isi Konten <span className="text-red-500">*</span>
                </label>
                <div className="bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 dark:[&_.ql-toolbar]:border-slate-600 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[400px]">
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
                        ['link', 'image', 'video'],
                        ['clean']
                      ],
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Ringkasan / Excerpt
                </label>
                <textarea 
                  name="excerpt"
                  rows="3"
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Ringkasan singkat berita (opsional, akan diambil otomatis dari konten jika kosong)"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Sidebar Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Publikasi</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="draft">Draf (Simpan sementara)</option>
                  <option value="published">Publikasikan (Live)</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Kategori</label>
                <select 
                  name="category_id"
                  required
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="" disabled>-- Pilih Kategori --</option>
                  {categories?.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <Button 
                type="submit" 
                className="w-full flex justify-center items-center gap-2"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {mutation.isPending ? 'Menyimpan...' : 'Simpan Berita'}
              </Button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Gambar Utama (Featured Image)</h3>
              
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-900 relative overflow-hidden group">
                {formData.image ? (
                  <>
                    {(() => {
                      return (
                        <img 
                          src={getFileUrl(formData.image)} 
                          alt="Featured" 
                          className="w-full h-40 object-cover rounded-lg"
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
                    <p className="text-sm text-slate-500 mb-4">Pilih gambar dari komputer Anda.</p>
                    <label className="cursor-pointer px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                      {uploadMutation.isPending ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                      {uploadMutation.isPending ? 'Mengunggah...' : 'Pilih Gambar'}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} disabled={uploadMutation.isPending} />
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </form>
    </>
  );
};

export default PostForm;
