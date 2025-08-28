import Footer from './components/Footer';
import TopNavigationBar from './components/TopNavigationBar';
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
