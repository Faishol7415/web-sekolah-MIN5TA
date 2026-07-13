import { createContext, useContext, useState, useCallback } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg) => addToast(msg, 'error'), [addToast]);
  const info = useCallback((msg) => addToast(msg, 'info'), [addToast]);
  const warning = useCallback((msg) => addToast(msg, 'warning'), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const iconMap = {
  success: <FaCheckCircle className="text-emerald-500 text-lg flex-shrink-0" />,
  error: <FaExclamationTriangle className="text-red-500 text-lg flex-shrink-0" />,
  info: <FaInfoCircle className="text-blue-500 text-lg flex-shrink-0" />,
  warning: <FaExclamationTriangle className="text-amber-500 text-lg flex-shrink-0" />,
};

const bgMap = {
  success: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-700',
  error: 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700',
  info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700',
  warning: 'bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-700',
};

const ToastItem = ({ toast, onClose }) => {
  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm animate-slide-in ${bgMap[toast.type] || bgMap.success}`}
    >
      {iconMap[toast.type]}
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex-shrink-0 mt-0.5"
      >
        <FaTimes className="text-xs" />
      </button>
    </div>
  );
};

export default ToastProvider;
