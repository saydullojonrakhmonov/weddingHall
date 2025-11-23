import express from 'express';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';
import checkRole from '../middlewares/checkRole.js';

// Controllers
import deleteBooking from '../controllers/owner/deleteBooking.js';
import createVenueByOwner from '../controllers/owner/addVenue.js';
import getOwnerVenues from '../controllers/owner/getOwnVenues.js';
import updateVenue from '../controllers/owner/updateVenue.js';
import getVenueById from '../controllers/owner/getVenue.js';
import getAllBookings from '../controllers/owner/getVenuesBookings.js';
import cancelBooking from '../controllers/owner/cancelBooking.js';

const router = express.Router();

// Check role
router.use(checkRole(["owner"]));

// Routes
router.get("/venues", getOwnerVenues);
router.get("/venues/:id", getVenueById);
router.get("/bookings", getAllBookings);

router.post("/venues", uploadMiddleware, createVenueByOwner);

router.put("/venues/:id", updateVenue);
router.put("/bookings/:id/cancel", cancelBooking);

router.delete("/bookings/:id", deleteBooking);

export default router; // ✅ make sure to export `router`, not `ownerRouter`
