import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

export const toast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const event = new CustomEvent('app-toast', { detail: { message, type } });
    window.dispatchEvent(event);
};

export const Toaster = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const handleToast = (e: any) => {
            const { message, type } = e.detail;
            const id = Math.random().toString(36).substring(7);
            setToasts(prev => [...prev, { id, message, type }]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 3000);
        };

        window.addEventListener('app-toast', handleToast);
        return () => window.removeEventListener('app-toast', handleToast);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map(t => (
                <div key={t.id} className={`p-4 rounded-md shadow-lg flex items-center gap-3 text-white transition-opacity ${t.type === 'error' ? 'bg-destructive' : 'bg-primary'
                    }`}>
                    <span>{t.message}</span>
                    <button onClick={() => removeToast(t.id)}><X size={16} /></button>
                </div>
            ))}
        </div>
    );
};
