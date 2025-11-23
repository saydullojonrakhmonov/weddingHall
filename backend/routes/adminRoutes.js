import express from "express";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";
import checkRole from "../middlewares/checkRole.js";

// controllers
import approveVenue from "../controllers/adminController/approveVenue.js";
import assignOwner from "../controllers/adminController/assignOwner.js";
import createVenues from "../controllers/adminController/createVenues.js";
import viewVenue from "../controllers/adminController/viewVenue.js";
import createOwner from "../controllers/adminController/addOwner.js";
import deleteVenue from "../controllers/adminController/deleteVenues.js";
import filterVenue from "../controllers/adminController/filterVenues.js";
import getAllOwners from "../controllers/adminController/viewAllOwners.js";
import updateVenue from "../controllers/adminController/updateVenue.js";
import getAllBookings from "../controllers/adminController/getAllBooking.js";
import cancelBooking from "../controllers/adminController/cancelBooking.js";
import getAllVenues from "../controllers/adminController/getAllVenues.js";
import getUnapprovedVenues from "../controllers/adminController/getUnapproveVenue.js";
import getVenueBookings from "../controllers/adminController/getVenueBooking.js";

const router = express.Router();

// Protect admin routes
router.use(checkRole(["admin"]));

// Owners
router.post("/owners", createOwner);
router.get("/owners", getAllOwners);

// Venues get
router.get("/venues", getAllVenues);
router.get("/venues/filter", filterVenue);
router.get("/venues/unapproved", getUnapprovedVenues);
router.get("/bookings", getAllBookings);
router.get("/venues/:id/bookings", getVenueBookings);
router.get("/venues/:id", viewVenue);

// create venue
router.post("/venues", uploadMiddleware, createVenues);
router.put("/venues/:id", updateVenue);
router.delete("/venues/:id", deleteVenue);
router.put("/bookings/:id/cancel", cancelBooking);
router.put("/venues/:id/approve", approveVenue);
router.put("/venues/:id/assign", assignOwner);

export default router;
