'use client';

import { Bell, CheckCircle2, Info, X } from 'lucide-react';
import { useSocket } from '@/context/SocketContext';

export default function ToastFeed() {
  const { notifications, dismissNotification } = useSocket();

  if (!notifications.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {notifications.map((n) => {
        const isSuccess = n.variant === 'success';
        const isUpdate = n.variant === 'update';
        const Icon = isSuccess ? CheckCircle2 : isUpdate ? Bell : Info;
        const accent = isSuccess
          ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
          : isUpdate
            ? 'border-amber-300 bg-amber-50 text-amber-950'
            : 'border-sky-300 bg-sky-50 text-sky-950';

        return (
          <div
            key={n.id}
            className={`pointer-events-auto rounded-xl border p-3.5 shadow-lg flex items-start gap-3 ${accent}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{n.title}</p>
              <p className="text-xs opacity-90 mt-0.5 break-words">{n.message}</p>
            </div>
            <button
              onClick={() => dismissNotification(n.id)}
              className="p-1 rounded-md hover:bg-black/5 transition-colors"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
