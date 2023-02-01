import { Request, Response, Router } from "express";
import { checkRole, checkUser } from "../../config/firebase";
import { ACTIVE, INACTIVE } from "../../config/utils/constants";
import errorHandler, {
  ForbiddenError,
  NotFoundError,
} from "../../config/utils/errorhandler";
import Booking from "../../models/booking";
import User from "../../models/user";
import Vehicle from "../../models/vehicle";

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
 *             200:
 *                 description: Booking complete.
 */
router.post("/:vid", checkUser, async (req: Request, res: Response) => {
  try {
    const { phone } = req;
    const user = await User.findOne({ where: { phone } });
    const { vid } = req.params;
    if (vid == null) throw new ForbiddenError();
    const vehicle = await Vehicle.findByPk(vid);
    if (!vehicle || !user) throw new NotFoundError();
    const booking = await Booking.create({
      VehicleId: Number(vid),
      UserId: Number(user.id),
      status: ACTIVE,
    });
    return res.status(201).send(booking);
  } catch (e) {
    return errorHandler(e, req, res);
  }
});

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
router.patch("/:id/:sid", checkUser, async (req: Request, res: Response) => {
  try {
    //add transaction
    const { id, sid } = req.params;
    if (!id || !sid) throw new NotFoundError();
    const checkBooking = await Booking.findOne({
      where: { id },
      include: ["user"],
    });
    const { phone } = req;
    const user = await User.findOne({ where: { phone } });
    //@ts-ignore
    console.log(checkBooking.user);
    //@ts-ignore
    if (checkBooking?.user.id != user?.id) throw new ForbiddenError();
    const booking = await Booking.update(
      { status: INACTIVE },
      { where: { id } }
    );
    if (!booking) throw new NotFoundError();
    const vehicleID = (await Booking.findByPk(id))?.VehicleId;
    if (!vehicleID) throw new NotFoundError();
    const vehicle = await Vehicle.update(
      { StationId: Number(sid) },
      { where: { id: vehicleID } }
    );
    return res.status(200).send(booking);
  } catch (e) {
    return errorHandler(e, req, res);
  }
});

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
router.get("/", checkUser, checkRole, async (req: Request, res: Response) => {
  try {
    return res.status(200).send(
      await Booking.findAll({
        include: ["user", "vehicle"],
        where: { status: ACTIVE },
      })
    );
  } catch (e) {
    return errorHandler(e, req, res);
  }
});

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
router.get("/user", checkUser, async (req: Request, res: Response) => {
  try {
    const { phone } = req;
    const user = await User.findOne({ where: { phone } });
    if (!user) throw new NotFoundError();
    //joins
    const bookings = await Booking.findAll({
      where: { UserId: user.id, status: ACTIVE },
      include: ["user", "vehicle"],
    });
    if (!bookings) throw new NotFoundError();
    return res.status(200).send(bookings);
  } catch (e) {
    console.log(e);
    return errorHandler(e, req, res);
  }
});

export default router;
