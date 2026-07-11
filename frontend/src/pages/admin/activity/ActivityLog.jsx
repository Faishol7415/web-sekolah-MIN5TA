import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { FaHistory, FaFilter } from 'react-icons/fa';
import api from '../../../api/axios';
import DataTable from '../../../components/admin/DataTable';

const ActivityLog = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');

  // Fetch data
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-activity-logs', page, filter],
    queryFn: async () => {
      const response = await api.get(`/admin/activity-logs?page=${page}&action=${filter}`);
      return response.data;
    },
    keepPreviousData: true,
  });

  const columns = [
    { 
      key: 'created_at', 
      label: 'Waktu', 
      render: (row) => (
        <div>
          <p className="font-bold text-slate-800 dark:text-white">{new Date(row.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          <p className="text-xs text-slate-500">{new Date(row.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      ) 
    },
    { 
      key: 'user', 
      label: 'Pengguna', 
      render: (row) => (
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {row.user?.name || 'Sistem'}
        </span>
      ) 
    },
    { 
      key: 'action', 
      label: 'Aksi', 
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          row.action.toLowerCase().includes('create') ? 'bg-emerald-100 text-emerald-700' :
          row.action.toLowerCase().includes('update') ? 'bg-blue-100 text-blue-700' :
          row.action.toLowerCase().includes('delete') ? 'bg-red-100 text-red-700' :
          'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
        }`}>
          {row.action}
        </span>
      ) 
    },
    { 
      key: 'description', 
      label: 'Keterangan', 
      render: (row) => <span className="text-sm">{row.description}</span> 
    },
    { 
      key: 'ip_address', 
      label: 'IP Address', 
      render: (row) => <span className="font-mono text-xs text-slate-400">{row.ip_address || '-'}</span> 
    }
  ];

  return (
    <>
      <Helmet>
        <title>Log Aktivitas | CMS MIN 5 Tulungagung</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <FaHistory className="text-primary" /> Log Aktivitas
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pantau seluruh perubahan data dan riwayat aktivitas administrator.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <FaFilter className="text-slate-400 ml-2" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent border-none text-sm outline-none text-slate-700 dark:text-slate-300 pr-4"
          >
            <option value="">Semua Aktivitas</option>
            <option value="create">Hanya Penambahan</option>
            <option value="update">Hanya Perubahan</option>
            <option value="delete">Hanya Penghapusan</option>
          </select>
        </div>
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
    </>
  );
};

export default ActivityLog;
