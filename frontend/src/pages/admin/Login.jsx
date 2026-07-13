import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Endpoint to backend Laravel API
      const response = await api.post('/auth/login', formData);
      
      if (response.data.access_token) {
        login(response.data.user, response.data.access_token);
        navigate(from, { replace: true });
      } else {
        setError('Respons tidak valid dari server.');
      }
    } catch (err) {
      if (err.response?.status === 422 || err.response?.status === 401) {
        // Validation or Auth error
        const message = err.response.data.message || err.response.data.errors?.email?.[0] || 'Kredensial tidak valid';
        setError(message);
      } else {
        setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login Portal Admin | MIN 5 Tulungagung</title>
      </Helmet>
      
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              M5
            </div>
          </div>
          <h2 className="mt-2 text-center text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
            Portal Administrator
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            MIN 5 Tulungagung CMS
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-100 dark:border-slate-700">
            
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-start gap-3">
                <span className="font-bold shrink-0">!</span>
                <p>{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Alamat Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 block w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors outline-none"
                    placeholder="Masukkan alamat email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 block w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors outline-none"
                    placeholder="Masukkan kata sandi"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                    Ingat saya
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-accent">
                    Lupa sandi?
                  </a>
                </div>
              </div>

              <div>
                <Button 
                  type="submit" 
                  className="w-full flex justify-center py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <FaSpinner className="animate-spin" /> Memproses...
                    </span>
                  ) : 'Masuk ke Dashboard'}
                </Button>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
              <a href="/" className="text-sm text-slate-500 hover:text-primary transition-colors">
                &larr; Kembali ke Beranda Utama
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
