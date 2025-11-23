import express from 'express';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';
import checkRole from '../middlewares/checkRole.js';
import getOwnerVenues from '../controllers/owner/getOwnVenues.js';
import getVenueById from '../controllers/owner/getVenue.js';
import getAllBookings from '../controllers/owner/getAllBookings.js';
import createVenueByOwner from '../controllers/owner/addVenue.js';
import updateVenue from '../controllers/owner/updateVenue.js';
import cancelBooking from '../controllers/owner/cancelBooking.js';
import deleteBooking from '../controllers/owner/deleteBooking.js';

// Controllers

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

export default router; 
