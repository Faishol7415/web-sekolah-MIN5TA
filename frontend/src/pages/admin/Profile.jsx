import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { FaSave, FaUser, FaLock, FaImage, FaUpload, FaSpinner } from 'react-icons/fa';
import api, { getFileUrl } from '../../api/axios';
import Button from '../../components/common/Button';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../contexts/AuthContext';
import ImageCropper from '../../components/admin/ImageCropper';

const Profile = () => {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
    avatar: user?.avatar || ''
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('umum');
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put('/auth/profile', data);
      return response.data;
    },
    onSuccess: (data) => {
      showToast('success', 'Profil berhasil diperbarui!');
      
      // Update local storage and context with new user data
      const token = localStorage.getItem('auth_token');
      // login function from useAuth expects (user, token)
      login(data.user, token);
      
      // Clear passwords
      setFormData(prev => ({
        ...prev,
        password: '',
        password_confirmation: ''
      }));
      setErrors({});
    },
    onError: (error) => {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        showToast('error', 'Mohon periksa kembali isian form Anda.');
      } else {
        showToast('error', error.response?.data?.message || 'Gagal memperbarui profil');
      }
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    
    // Jangan kirim field password jika kosong agar tidak terkena validasi min:8
    if (!dataToSubmit.password) {
      delete dataToSubmit.password;
      delete dataToSubmit.password_confirmation;
    }
    
    updateMutation.mutate(dataToSubmit);
  };

  // Image Upload Handlers
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showToast('error', 'Ukuran gambar maksimal 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result); // Pass data URL instead of File object
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedBlob) => {
    setShowCropper(false);
    setIsUploading(true);

    const uploadData = new FormData();
    uploadData.append('file', croppedBlob, 'avatar.jpg');

    try {
      const response = await api.post('/admin/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFormData(prev => ({
        ...prev,
        avatar: response.data.path
      }));
      showToast('success', 'Foto profil berhasil diunggah!');
    } catch (error) {
      showToast('error', 'Gagal mengunggah foto profil');
    } finally {
      setIsUploading(false);
      setSelectedImage(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Profil Saya | Admin MIN 5 Tulungagung</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Profil Saya</h1>
        <p className="text-slate-500 dark:text-slate-400">Kelola informasi akun Anda</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-sm border border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('umum')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                activeTab === 'umum' 
                  ? 'bg-primary/10 text-primary font-medium dark:bg-primary/20 dark:text-primary-400' 
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50'
              }`}
            >
              <FaUser /> Data Umum
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                activeTab === 'password' 
                  ? 'bg-primary/10 text-primary font-medium dark:bg-primary/20 dark:text-primary-400' 
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50'
              }`}
            >
              <FaLock /> Ganti Password
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {activeTab === 'umum' && (
                <div className="space-y-6 animate-in fade-in">
                  
                  {/* Avatar Upload */}
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      {formData.avatar ? (
                        <img 
                          src={getFileUrl(formData.avatar)} 
                          alt="Avatar" 
                          className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 dark:border-slate-700 shadow-sm"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border-4 border-slate-50 dark:border-slate-800 shadow-sm text-slate-400">
                          <FaUser className="text-4xl" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 pt-2">
                      <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Foto Profil</h3>
                      <div className="flex gap-3">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                          {isUploading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                          Unggah Foto
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageSelect}
                            disabled={isUploading}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">JPG, PNG atau GIF (Max. 2MB)</p>
                    </div>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-700" />

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border ${
                          errors.name 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-slate-200 dark:border-slate-600 focus:ring-primary-500'
                        } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2`}
                        required
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name[0]}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border ${
                          errors.email 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-slate-200 dark:border-slate-600 focus:ring-primary-500'
                        } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2`}
                        required
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email[0]}</p>}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
                    <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-1">Perhatian</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">Biarkan kosong jika Anda tidak ingin mengubah password.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        errors.password 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-slate-200 dark:border-slate-600 focus:ring-primary-500'
                      } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2`}
                      placeholder="Minimal 8 karakter"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password[0]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-primary-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                <Button 
                  type="submit" 
                  variant="primary" 
                  icon={updateMutation.isPending ? FaSpinner : FaSave}
                  isLoading={updateMutation.isPending}
                  className="px-6"
                >
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showCropper && selectedImage && (
        <ImageCropper
          imageSrc={selectedImage}
          onCropDone={handleCropComplete}
          onCancel={() => {
            setShowCropper(false);
            setSelectedImage(null);
          }}
          aspect={1}
        />
      )}
    </>
  );
};

export default Profile;
