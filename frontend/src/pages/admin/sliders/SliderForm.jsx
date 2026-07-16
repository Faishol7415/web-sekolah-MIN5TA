import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { FaSave, FaArrowLeft, FaSpinner, FaImage, FaUpload } from 'react-icons/fa';
import api, { getFileUrl } from '../../../api/axios';
import Button from '../../../components/common/Button';
import { useToast } from '../../../components/common/Toast';
import ImageCropper from '../../../components/admin/ImageCropper';

const SliderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    button_url: '',
    button2_text: '',
    button2_url: '',
    order: 0,
    is_active: true
  });
  const [error, setError] = useState('');

  const toast = useToast();
  const [cropImage, setCropImage] = useState(null);
  const [cropAspect, setCropAspect] = useState(16 / 9);

  const { data: sliderData, isLoading: isLoadingSlider } = useQuery({
    queryKey: ['admin-slider', id],
    queryFn: async () => {
      const response = await api.get(`/admin/sliders/${id}`);
      return response.data.data;
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (sliderData) {
      setFormData({
        title: sliderData.title || '',
        subtitle: sliderData.subtitle || '',
        image: sliderData.image || '',
        button_text: sliderData.button_text || '',
        button_url: sliderData.button_url || '',
        button2_text: sliderData.button2_text || '',
        button2_url: sliderData.button2_url || '',
        order: sliderData.order ?? 0,
        is_active: sliderData.is_active === undefined ? true : !!sliderData.is_active
      });
    }
  }, [sliderData]);

  const mutation = useMutation({
    mutationFn: (data) => {
      if (isEditMode) {
        return api.put(`/admin/sliders/${id}`, data);
      }
      return api.post('/admin/sliders', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sliders'] });
      toast.success(isEditMode ? 'Slider berhasil diperbarui!' : 'Slider berhasil ditambahkan!');
      navigate('/admin/sliders');
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Gagal menyimpan slider.';
      setError(msg);
      toast.error(msg);
    }
  });

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

  if (isEditMode && isLoadingSlider) {
    return <div className="flex justify-center p-12"><FaSpinner className="animate-spin text-3xl text-primary" /></div>;
  }

  return (
    <>
      <Helmet>
        <title>{isEditMode ? 'Edit Slider' : 'Tambah Slider'} | CMS MIN 5 Tulungagung</title>
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
            to="/admin/sliders"
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              {isEditMode ? 'Edit Slider' : 'Tambah Slider'}
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Judul Utama <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary font-bold text-lg"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Sub-judul (Opsional)
                </label>
                <textarea 
                  name="subtitle"
                  rows="3"
                  value={formData.subtitle}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary resize-none"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Teks Tombol Aksi (Opsional)
                  </label>
                  <input 
                    type="text" 
                    name="button_text"
                    value={formData.button_text}
                    onChange={handleChange}
                    placeholder="Misal: Profil Madrasah"
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tautan Tombol (Opsional)
                  </label>
                  <input 
                    type="text" 
                    name="button_url"
                    value={formData.button_url}
                    onChange={handleChange}
                    placeholder="Misal: /profil"
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Teks Tombol Kedua (Opsional)
                  </label>
                  <input 
                    type="text" 
                    name="button2_text"
                    value={formData.button2_text}
                    onChange={handleChange}
                    placeholder="Misal: Jelajahi Berita"
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tautan Tombol Kedua (Opsional)
                  </label>
                  <input 
                    type="text" 
                    name="button2_url"
                    value={formData.button2_url}
                    onChange={handleChange}
                    placeholder="Misal: #berita"
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Gambar Slider</h3>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-900 relative overflow-hidden group mb-4">
                {formData.image ? (
                  <>
                    {(() => {
                      return (
                        <img 
                          src={getFileUrl(formData.image)} 
                          alt="Slider" 
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
                    <p className="text-sm text-slate-500 mb-4">Pilih gambar rasio 16:9 untuk hasil terbaik.</p>
                    <label className="cursor-pointer px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                      {uploadMutation.isPending ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                      {uploadMutation.isPending ? 'Mengunggah...' : 'Pilih Gambar'}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} disabled={uploadMutation.isPending} />
                    </label>
                  </>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Urutan Tampil (Order)</label>
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
                  Aktifkan Slider Ini
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full flex justify-center items-center gap-2"
                disabled={mutation.isPending || (!formData.image)}
              >
                {mutation.isPending ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {mutation.isPending ? 'Menyimpan...' : 'Simpan Slider'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default SliderForm;
