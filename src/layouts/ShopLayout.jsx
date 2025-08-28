import Preloader from '@/components/Preloader';
import { lazy, Suspense } from 'react';
const TopNavigationBar = lazy(() => import('@/components/shopLayoutComponents/TopNavigationBar'));
const Footer = lazy(() => import('@/components/shopLayoutComponents/Footer'));
const ShopLayout = ({
  children
}) => {
  return <>
      <Suspense>
        <TopNavigationBar />
      </Suspense>
      <Suspense fallback={<Preloader />}>{children}</Suspense>
      <Suspense>
        <Footer className="pt-5 bg-light" />
      </Suspense>
    </>;
};
export default ShopLayout;
