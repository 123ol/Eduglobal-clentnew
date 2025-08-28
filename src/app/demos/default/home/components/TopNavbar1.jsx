import LogoBox from '@/components/LogoBox';
import TopNavbar from '@/components/TopNavbar';
import { Container } from 'react-bootstrap';
import AppMenu from '@/components/TopNavbar/components/AppMenu';
import ProfileDropdown from '@/components/TopNavbar/components/ProfileDropdown';

const TopNavbar1 = () => {
  return (
    <TopNavbar>
      <Container fluid className="px-3 px-xl-5 d-flex align-items-center">
        <LogoBox height={36} width={150} />
        <AppMenu
          menuClassName="me-auto d-flex align-items-center"
          showExtraPages
          showCategories
         
          searchInput
        />
        <ProfileDropdown className="ms-1 ms-lg-0" />
      </Container>
    </TopNavbar>
  );
};

export default TopNavbar1;