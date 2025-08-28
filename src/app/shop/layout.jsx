import Footer from '@/components/shopLayoutComponents/Footer';
import TopNavigationBar from '@/components/shopLayoutComponents/TopNavigationBar';
const layout = ({
  children
}) => {
  return <>
      <TopNavigationBar />
      {children}
      <Footer className="pt-5 bg-light" />
    </>;
};
export default layout;
