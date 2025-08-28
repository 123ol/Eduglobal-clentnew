import PageMetaData from '@/components/PageMetaData';
import BillingAddress from './components/BillingAddress';
import BillingHistory from './components/BillingHistory';
import PaymentMethods from './components/PaymentMethods';
const PaymentInfoPage = () => {
  return <>
      <PageMetaData title="Payment Info" />
      <PaymentMethods />
      <BillingAddress />
      <BillingHistory />
    </>;
};
export default PaymentInfoPage;
