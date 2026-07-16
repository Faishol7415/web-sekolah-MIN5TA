import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Lazy loaded components
const Home = lazy(() => import('../pages/public/Home'));
const Profile = lazy(() => import('../pages/public/Profile'));
const News = lazy(() => import('../pages/public/News'));
const NewsDetail = lazy(() => import('../pages/public/NewsDetail'));
const Achievement = lazy(() => import('../pages/public/Achievement'));
const Contact = lazy(() => import('../pages/public/Contact'));

const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const Login = lazy(() => import('../pages/admin/Login'));
const AdminProfile = lazy(() => import('../pages/admin/Profile'));

const CategoryList = lazy(() => import('../pages/admin/categories/CategoryList'));
const SliderList = lazy(() => import('../pages/admin/sliders/SliderList'));
const SliderForm = lazy(() => import('../pages/admin/sliders/SliderForm'));
const SchoolProfileList = lazy(() => import('../pages/admin/profiles/SchoolProfileList'));
const SchoolProfileForm = lazy(() => import('../pages/admin/profiles/SchoolProfileForm'));
const PostList = lazy(() => import('../pages/admin/posts/PostList'));
const PostForm = lazy(() => import('../pages/admin/posts/PostForm'));
const AchievementList = lazy(() => import('../pages/admin/achievements/AchievementList'));
const UserList = lazy(() => import('../pages/admin/users/UserList'));
const Settings = lazy(() => import('../pages/admin/settings/Settings'));
const ActivityLog = lazy(() => import('../pages/admin/activity/ActivityLog'));

// Loading Fallback
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="profil" element={<Profile />} />
          <Route path="berita" element={<News />} />
          <Route path="berita/:slug" element={<NewsDetail />} />
          <Route path="prestasi" element={<Achievement />} />
          <Route path="kontak" element={<Contact />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="kategori" element={<CategoryList />} />
          <Route path="sliders" element={<SliderList />} />
          <Route path="sliders/tambah" element={<SliderForm />} />
          <Route path="sliders/edit/:id" element={<SliderForm />} />
          <Route path="profil" element={<SchoolProfileList />} />
          <Route path="profil/tambah" element={<SchoolProfileForm />} />
          <Route path="profil/edit/:id" element={<SchoolProfileForm />} />
          <Route path="berita" element={<PostList />} />
          <Route path="berita/tambah" element={<PostForm />} />
          <Route path="berita/edit/:id" element={<PostForm />} />
          <Route path="prestasi" element={<AchievementList />} />
          <Route path="users" element={<UserList />} />
          <Route path="settings" element={<Settings />} />
          <Route path="activity" element={<ActivityLog />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<div className="p-20 text-center text-2xl font-bold dark:text-white">404 Not Found</div>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
