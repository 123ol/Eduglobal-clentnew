import PageMetaData from '@/components/PageMetaData';
import Counter from './components/Counter';
import CoursesList from './components/CoursesList';
const DashboardPage = () => {
  return <>
      <PageMetaData title="Student Dashboard" />
      <Counter />
      <CoursesList />
    </>;
};
export default DashboardPage;
