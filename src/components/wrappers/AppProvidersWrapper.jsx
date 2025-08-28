import { Suspense, useEffect } from 'react';
import FallbackLoading from '../FallbackLoading';
import Aos from 'aos';
import { NotificationProvider } from '@/context/useNotificationContext';
import { LayoutProvider } from '@/context/useLayoutContext';
import { AuthProvider } from '@/context/useAuthContext';
const AppProvidersWrapper = ({
  children
}) => {
  useEffect(() => {
    Aos.init();
    if (document) {
      const e = document.querySelector('#__next_splash');
      if (e?.hasChildNodes()) {
        document.querySelector('#splash-screen')?.classList.add('remove');
      }
      e?.addEventListener('DOMNodeInserted', () => {
        document.querySelector('#splash-screen')?.classList.add('remove');
      });
    }
  }, []);
  return <LayoutProvider>
    <AuthProvider>
      <NotificationProvider>
        <Suspense fallback={<FallbackLoading />}>{children}</Suspense>
      </NotificationProvider>
    </AuthProvider>
  </LayoutProvider>
};
export default AppProvidersWrapper;
