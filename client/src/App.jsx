import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RiderDashboard from './pages/RiderDashboard'
import DriverDashboard from './pages/DriverDashboard'
import BookRide from './pages/BookRide'
import MyRides from './pages/MyRides'
import Profile from './pages/Profile'
import RateDriver from './pages/RateDriver'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/AdminLogin'
import AdminRegister from './pages/admin/AdminRegister'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminRides from './pages/admin/AdminRides'
import AdminComplaints from './pages/admin/AdminComplaints'
import AdminPayments from './pages/admin/AdminPayments'
import AdminRatings from './pages/admin/AdminRatings'
import AdminReports from './pages/admin/AdminReports'
import AdminSettings from './pages/admin/AdminSettings'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rider & Driver Routes */}
      <Route path="/rider/dashboard" element={<RiderDashboard />} />
      <Route path="/driver/dashboard" element={<DriverDashboard />} />
      <Route path="/book-ride" element={<BookRide />} />
      <Route path="/my-rides" element={<MyRides />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/rate-driver/:rideId/:driverId" element={<RateDriver />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/rides" element={<AdminRides />} />
      <Route path="/admin/complaints" element={<AdminComplaints />} />
      <Route path="/admin/payments" element={<AdminPayments />} />
      <Route path="/admin/ratings" element={<AdminRatings />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/settings" element={<AdminSettings />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App