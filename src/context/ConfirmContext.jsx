import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmContext = createContext();

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

export const ConfirmProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'danger', // danger, warning, info
  });
  const [resolveCallback, setResolveCallback] = useState(null);

  const confirm = useCallback((options = {}) => {
    setConfig((prev) => ({ ...prev, ...options }));
    setIsOpen(true);
    return new Promise((res) => {
      setResolveCallback(() => res);
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolveCallback) resolveCallback(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolveCallback) resolveCallback(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  config.type === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {config.title}
                  </h3>
                  <p className="mt-2 text-slate-500 font-medium text-sm leading-relaxed">
                    {config.message}
                  </p>
                </div>
                <button 
                  onClick={handleCancel}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
              <button
                onClick={handleConfirm}
                className={`flex-1 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                  config.type === 'danger' 
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                }`}
              >
                {config.confirmText}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all active:scale-[0.98]"
              >
                {config.cancelText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
