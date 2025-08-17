'use client';

import { useToast } from '@/app/hooks/use-toast';
import { Toaster } from '@/components/ui/sonner';

export function ToastProvider() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toaster
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onDismiss={dismiss}
        />
      ))}
    </div>
  );
}
