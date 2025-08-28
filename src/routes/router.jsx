import { Route, Routes } from 'react-router-dom';
import { adminRoutes, appRoutes, authRoutes, InstructorRoutes, shopRoutes, studentRoutes } from '@/routes/index';
import AdminLayout from '@/layouts/AdminLayout';
import ShopLayout from '@/layouts/ShopLayout';
import InstructorLayout from '@/layouts/InstructorLayout';
import StudentLayout from '@/layouts/StudentLayout';
import OtherLayout from '@/layouts/OtherLayout';
import { useAuthContext } from '@/context/useAuthContext';

const AppRouter = props => {
  // We still have auth context in case you want to use user info
  const { isAuthenticated } = useAuthContext();

  return (
    <Routes>
      {/* Public / auth routes */}
      {(authRoutes || []).map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={<OtherLayout {...props}>{route.element}</OtherLayout>}
        />
      ))}

      {/* App routes */}
      {(appRoutes || []).map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={<OtherLayout {...props}>{route.element}</OtherLayout>}
        />
      ))}

      {/* Shop routes */}
      {(shopRoutes || []).map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={<ShopLayout {...props}>{route.element}</ShopLayout>}
        />
      ))}

      {/* Instructor routes */}
      {(InstructorRoutes || []).map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={<InstructorLayout {...props}>{route.element}</InstructorLayout>}
        />
      ))}

      {/* Student routes */}
      {(studentRoutes || []).map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={<StudentLayout {...props}>{route.element}</StudentLayout>}
        />
      ))}

      {/* Admin routes */}
      {(adminRoutes || []).map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={<AdminLayout {...props}>{route.element}</AdminLayout>}
        />
      ))}

      {/* Default route: all users land on homepage */}
      <Route path="*" element={<OtherLayout {...props}>{/* put your homepage component here */}</OtherLayout>} />
    </Routes>
  );
};

export default AppRouter;
