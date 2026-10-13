import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastContainer } from './components/common/ToastContainer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Public Auth & Info Pages
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { BrowseEquipment } from './pages/BrowseEquipment';
import { EquipmentDetails } from './pages/EquipmentDetails';
import { HowItWorks } from './pages/HowItWorks';
import { About } from './pages/About';

// Dashboard Layout & Pages
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { OwnerHome } from './pages/dashboard/OwnerHome';
import { FarmerHome } from './pages/dashboard/FarmerHome';
import { MyMachinery } from './pages/dashboard/MyMachinery';
import { AddMachinery } from './pages/dashboard/AddMachinery';
import { EditMachinery } from './pages/dashboard/EditMachinery';
import { OwnerRequests } from './pages/dashboard/OwnerRequests';
import { MyRentals } from './pages/dashboard/MyRentals';
import { NotificationsPage } from './pages/dashboard/NotificationsPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';

// Smart dispatcher for legacy /dashboard route
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.accountType === 'owner') {
    return <Navigate to="/equipment-owner/home" replace />;
  }
  return <Navigate to="/farmer/home" replace />;
};

// Layout component to manage Navbar and Footer visibility
const AppContent = () => {
  const location = useLocation();
  const normalizedPath = location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const isAuthPage = normalizedPath === '/signup' || normalizedPath === '/login';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAuthPage && <Navbar />}
      <div style={{ flex: 1 }}>
        <Routes>
          {/* 1. Default Route redirects to Signup */}
          <Route path="/" element={<Navigate to="/signup" replace />} />

          {/* 2. Authentication Pages */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* 3. Public Browse & Info */}
          <Route path="/browse" element={<BrowseEquipment />} />
          <Route path="/equipment/:id" element={<EquipmentDetails />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />

          {/* 4. Equipment Owner Protected Routes */}
          <Route
            path="/equipment-owner"
            element={
              <ProtectedRoute requiredAccountType="owner">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/equipment-owner/home" replace />} />
            <Route path="home" element={<OwnerHome />} />
            <Route path="add-equipment" element={<AddMachinery />} />
            <Route path="my-machinery" element={<MyMachinery />} />
            <Route path="machinery/:id/edit" element={<EditMachinery />} />
            <Route path="requests" element={<OwnerRequests />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* 5. Farmer / Renter Protected Routes */}
          <Route
            path="/farmer"
            element={
              <ProtectedRoute requiredAccountType="renter">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/farmer/home" replace />} />
            <Route path="home" element={<FarmerHome />} />
            <Route path="browse" element={<BrowseEquipment />} />
            <Route path="rentals" element={<MyRentals />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* 6. Common / Shared Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardRedirect />} />
            <Route path="machinery" element={<MyMachinery />} />
            <Route path="machinery/add" element={<AddMachinery />} />
            <Route path="machinery/:id/edit" element={<EditMachinery />} />
            <Route path="requests" element={<OwnerRequests />} />
            <Route path="rentals" element={<MyRentals />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback to /signup */}
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </div>
      {!isAuthPage && <Footer />}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
