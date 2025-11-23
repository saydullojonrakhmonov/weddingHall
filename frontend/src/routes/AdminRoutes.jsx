import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/Admin';
import AdminCreateVenue from '../pages/Admin/AddVenue';
import AllVenues from '../pages/Admin/AllVenues';
import CreateOwner from '../pages/Admin/CreateOwner';
import AssignOwner from '../pages/Admin/AssignOwner';
import AllOwners from '../pages/Admin/AllOwners';
import ApproveVenue from '../pages/Admin/ApproveVenue';
import AllBooking from '../pages/Admin/AllBooking';
import UpdateVenue from '../pages/Admin/UpdateVenue';


function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="add-venue" element={<AdminCreateVenue />} />
        <Route path="venues" element={<AllVenues />} />
        <Route path="add-owner" element={<CreateOwner />} />
        <Route path="assign-owner" element={<AssignOwner />} />
        <Route path="all-owners" element={<AllOwners />} />
        <Route path="approve-venue" element={<ApproveVenue />} />
        <Route path="all-booking" element={<AllBooking />} />
        <Route path="edit-venue/:id" element={<UpdateVenue />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes
