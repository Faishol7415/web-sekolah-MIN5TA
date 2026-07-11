import { FaSpinner, FaInbox, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * Reusable DataTable Component
 * @param {Array} columns - Array of objects { key: string, label: string, render: function(item) }
 * @param {Array} data - Array of data objects
 * @param {boolean} isLoading - Loading state from TanStack query
 * @param {boolean} isError - Error state
 * @param {function} refetch - Refetch function from TanStack query
 * @param {Object} pagination - Pagination metadata { current_page, last_page, total }
 * @param {function} onPageChange - Function to handle page change
 */
const DataTable = ({ 
  columns, 
  data = [], 
  isLoading, 
  isError, 
  refetch,
  pagination,
  onPageChange
}) => {

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-6 rounded-xl border border-red-100 dark:border-red-800 text-center">
        <p className="font-bold mb-2">Gagal memuat data</p>
        <p className="text-sm mb-4">Terjadi kesalahan saat mengambil data dari server.</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className={`px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <FaSpinner className="animate-spin text-3xl text-primary mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Memuat data...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  <FaInbox className="text-4xl mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                  <p className="font-medium">Tidak ada data ditemukan</p>
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr key={item.id || rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={`px-6 py-4 text-sm text-slate-700 dark:text-slate-300 ${col.cellClassName || ''}`}>
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.last_page > 1 && (
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Menampilkan halaman <span className="font-bold text-slate-700 dark:text-slate-200">{pagination.current_page}</span> dari <span className="font-bold text-slate-700 dark:text-slate-200">{pagination.last_page}</span> 
            <span className="hidden sm:inline"> (Total {pagination.total} data)</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => onPageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <FaChevronLeft size={14} />
            </button>
            <button 
              onClick={() => onPageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
