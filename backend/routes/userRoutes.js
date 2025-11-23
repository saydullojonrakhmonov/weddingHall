import express from 'express';
import authentication from '../middlewares/authentication.js';
import checkRole from '../middlewares/checkRole.js';


import getAllVenues from '../controllers/user/getVenues.js';
import getVenue from '../controllers/user/getVenue.js';
import bookVenue from '../controllers/user/bookVenue.js';
import getUserBookings from '../controllers/user/getUserBookings.js';
import  getBookedDates  from '../controllers/user/bookedDates.js';
import loginUser from '../controllers/user/login.js';
import registerUser from '../controllers/user/registerUser.js';

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/venues", getAllVenues); 
router.get("/venues/:id", getVenue); 
router.get("/venues/:id/booked-dates", getBookedDates); 

// Protected routes
router.use(authentication);
router.use(checkRole(["user"]));
router.post("/venues/:id/book", bookVenue); 
router.get("/bookings", getUserBookings);

export default router;
