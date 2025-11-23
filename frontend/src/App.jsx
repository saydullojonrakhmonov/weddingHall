import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import NoPage from './pages/NotFound/NoPage';
import VenueDetail from './components/VenueDetail/VenueDetail';
import VenueBooking from './pages/Booking/VenueBooking';
import Register from './pages/User/Register';
import MyBookings from './pages/User/MyBookings';
import AdminRoutes from './routes/AdminRoutes';
import OwnerRoutes from './routes/OwnerRoutes';
import Contact from './pages/Contact/Contact';
import About from './pages/About/About';




const App = () => {
  return (
    <div >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/owner/*" element={<OwnerRoutes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/venue/:id' element={<VenueDetail />} />
          <Route path="/venue/:id/book" element={<VenueBooking />} />
          <Route path='/bookings' element={<MyBookings />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/about' element={<About />} />

          <Route path="/*" element={<NoPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
