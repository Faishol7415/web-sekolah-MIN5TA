import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../pages/public/Home';
import Dashboard from '../pages/admin/Dashboard';
import Login from '../pages/admin/Login';

import Profile from '../pages/public/Profile';
import News from '../pages/public/News';
import NewsDetail from '../pages/public/NewsDetail';
import Achievement from '../pages/public/Achievement';
import Contact from '../pages/public/Contact';

import CategoryList from '../pages/admin/categories/CategoryList';
import SliderList from '../pages/admin/sliders/SliderList';
import SliderForm from '../pages/admin/sliders/SliderForm';
import SchoolProfileList from '../pages/admin/profiles/SchoolProfileList';
import SchoolProfileForm from '../pages/admin/profiles/SchoolProfileForm';
import PostList from '../pages/admin/posts/PostList';
import PostForm from '../pages/admin/posts/PostForm';
import AchievementList from '../pages/admin/achievements/AchievementList';
import UserList from '../pages/admin/users/UserList';
import Settings from '../pages/admin/settings/Settings';
import ActivityLog from '../pages/admin/activity/ActivityLog';
import ProtectedRoute from '../components/common/ProtectedRoute';

const AppRoutes = () => {
  return (
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
      <Route path="*" element={<div className="p-20 text-center text-2xl font-bold">404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
