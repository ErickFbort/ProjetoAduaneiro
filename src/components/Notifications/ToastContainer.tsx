import React from 'react';
import Toast, { ToastType } from './Toast';
import './Toast.css';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

interface ToastContainerProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  position = 'top-right'
}) => {
  const groupedToasts = toasts.reduce((groups, toast) => {
    const pos = toast.position || position;
    if (!groups[pos]) {
      groups[pos] = [];
    }
    groups[pos].push(toast);
    return groups;
  }, {} as Record<string, ToastData[]>);

  return (
    <>
      {Object.entries(groupedToasts).map(([pos, toastList]) => (
        <div key={pos} className="toast-container" style={{
          position: 'fixed',
          ...(pos.includes('top') ? { top: '20px' } : { bottom: '20px' }),
          ...(pos.includes('right') ? { right: '20px' } : pos.includes('left') ? { left: '20px' } : { left: '50%', transform: 'translateX(-50%)' }),
          zIndex: 1000
        }}>
          {toastList.map((toast) => (
            <Toast
              key={toast.id}
              {...toast}
              position={pos as any}
              onClose={onRemove}
            />
          ))}
        </div>
      ))}
    </>
  );
};

export default ToastContainer;
