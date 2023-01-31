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
 * /booking:
 *     get:
 *         summary: Retrieve all the videos in a paginated response.[made for PART 2 of BASIC REQUIREMENTS]
 *         parameters:
 *             - in: query
 *               name: limit
 *               type: integer
 *               description: max number of tweets to return. Default is 5.
 *             - in: query
 *               name: offset
 *               type: integer
 *               description: number of tweets to offset the results by. Default is 0.
 *             - in: query
 *               name: pageNo
 *               type: integer
 *               description: can be used with limit to get a paginated response
 *         responses:
 *             200:
 *                 description: A paginated list of videos
 */
router.post("/:vid", checkUser, async (req: Request, res: Response) => {
  try {
    //test
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
 * /api/getAll:
 *     get:
 *         summary: Retrieve all the videos in a paginated response.[made for PART 2 of BASIC REQUIREMENTS]
 *         parameters:
 *             - in: query
 *               name: limit
 *               type: integer
 *               description: max number of tweets to return. Default is 5.
 *             - in: query
 *               name: offset
 *               type: integer
 *               description: number of tweets to offset the results by. Default is 0.
 *             - in: query
 *               name: pageNo
 *               type: integer
 *               description: can be used with limit to get a paginated response
 *         responses:
 *             200:
 *                 description: A paginated list of videos
 */
router.patch("/:id/:sid", checkUser, async (req: Request, res: Response) => {
  try {
    //add transaction
    const { id, sid } = req.params;
    if (!id || !sid) throw new NotFoundError();
    const booking = await Booking.update(
      { status: INACTIVE },
      { where: { id } }
    );
    if (!booking) throw new NotFoundError();
    const vehicleID = (await Booking.findByPk(id))?.VehicleId;
    if (!vehicleID) throw new NotFoundError();
    const vehicle = await Vehicle.update(
      { stationID: Number(sid) },
      { where: { id: vehicleID } }
    );
    return res.status(201).send(booking);
  } catch (e) {
    return errorHandler(e, req, res);
  }
});

/**
 * @swagger
 * /api/getAll:
 *     get:
 *         summary: Retrieve all the videos in a paginated response.[made for PART 2 of BASIC REQUIREMENTS]
 *         parameters:
 *             - in: query
 *               name: limit
 *               type: integer
 *               description: max number of tweets to return. Default is 5.
 *             - in: query
 *               name: offset
 *               type: integer
 *               description: number of tweets to offset the results by. Default is 0.
 *             - in: query
 *               name: pageNo
 *               type: integer
 *               description: can be used with limit to get a paginated response
 *         responses:
 *             200:
 *                 description: A paginated list of videos
 */
router.get("/", checkUser, checkRole, async (req: Request, res: Response) => {
  try {
    //joins
    return res
      .status(200)
      .send(await Booking.findAll({ include: [User, Vehicle] }));
  } catch (e) {
    return errorHandler(e, req, res);
  }
});

router.get("/user", checkUser, async (req: Request, res: Response) => {
  try {
    const { phone } = req;
    const user = await User.findOne({ where: { phone } });
    if (!user) throw new NotFoundError();
    //joins
    const bookings = await Booking.findAll({
      where: { UserId: user.id },
      include: [User, Vehicle],
    });
    if (!bookings) throw new NotFoundError();
    return res.status(200).send(bookings);
  } catch (e) {
    return errorHandler(e, req, res);
  }
});

export default router;
