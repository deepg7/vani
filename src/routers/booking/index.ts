import { Router } from "express";
import { checkRole, checkUser } from "../../config/firebase";
import {
  createBooking,
  getActiveBookingsOfUser,
  getAllActiveBookings,
  terminateBooking,
} from "../../controllers/booking";

const router = Router();

/**
 * @swagger
 * /booking/{vid}:
 *     post:
 *         summary: Create a booking. Take user phone from auth token, vehicle id from path.
 *         parameters:
 *             - in: header
 *               name: Authorization
 *               type: string
 *               description: Bearer + firebase access token
 *             - in: path
 *               name: vid
 *               type: number
 *               description: Vehicle Id to be booked
 *         responses:
 *             201:
 *                 description: Booking complete.
 */
router.post("/:vid", checkUser, createBooking);

/**
 * @swagger
 * /booking/{id}/{sid}:
 *     patch:
 *         summary: Terminate a booking. Take user phone from auth token, booking id and station id from path.
 *         parameters:
 *             - in: header
 *               name: Authorization
 *               type: string
 *               description: Bearer + firebase access token
 *             - in: path
 *               name: id
 *               type: number
 *               description: Booking id to be terminated
 *             - in: path
 *               name: sid
 *               type: number
 *               description: Station Id at which booking is terminated
 *         responses:
 *             200:
 *                 description: Booking is terminated
 */
router.patch("/:id/:sid", checkUser, terminateBooking);

/**
 * @swagger
 * /booking:
 *     get:
 *         summary: Get all active bookings. Only for admins.
 *         parameters:
 *             - in: header
 *               name: Authorization
 *               type: string
 *               description: Bearer + firebase access token
 *         responses:
 *             200:
 *                 description: A list of active bookings.
 */
router.get("/", checkUser, checkRole, getAllActiveBookings);

/**
 * @swagger
 * /booking/user:
 *     get:
 *         summary: Get all active bookings for a particular user.
 *         parameters:
 *             - in: header
 *               name: Authorization
 *               type: string
 *               description: Bearer + firebase access token
 *         responses:
 *             200:
 *                 description: A list of active bookings of that user.
 */
router.get("/user", checkUser, getActiveBookingsOfUser);

export default router;
