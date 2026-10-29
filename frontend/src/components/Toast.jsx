import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={20} color="#10b981" />,
    error: <AlertCircle size={20} color="#ef4444" />,
    info: <Info size={20} color="#3b82f6" />,
  };

  return (
    <div className="toast-container">
      <div className={`toast toast-${toast.type || 'info'}`}>
        {icons[toast.type || 'info']}
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toast.message}</span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            marginLeft: '0.5rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
