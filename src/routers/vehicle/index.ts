import { Request, Response, Router } from "express";
import { Op } from "sequelize";
import Booking from "../../models/booking";
import Vehicle, { VehicleInput } from "../../models/vehicle";
import { checkUser, checkRole } from "../../config/firebase";
import errorHandler, { ForbiddenError } from "../../config/utils/errorhandler";
import User from "../../models/user";
import { ACTIVE, ADMIN } from "../../config/utils/constants";
const router = Router();

/**
 * @swagger
 * /vehicle:
 *     post:
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
router.post("/", checkUser, checkRole, async (req: Request, res: Response) => {
  try {
    const payload = req.body.payload as VehicleInput;
    const vehicle = await Vehicle.create(payload);
    return res.status(201).send(vehicle);
  } catch (e) {
    return errorHandler(e, req, res);
  }
});

/**
 * @swagger
 * /vehicle:
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
router.get("/:sid", checkUser, async (req: Request, res: Response) => {
  try {
    let { sid } = req.params;
    const vehicles = await Vehicle.findAll({
      where: { stationID: sid == "0" ? null : sid },
    });
    let avlblV: Vehicle[] = [];
    if (sid == "0") {
      const { phone } = req;
      const user = await User.findOne({ where: { phone } });
      if (!user || user.role !== ADMIN) throw new ForbiddenError();
      avlblV = vehicles;
    } else {
      const vids = vehicles.map((v) => v.id);
      const bookings = await Booking.findAll({
        where: { VehicleId: { [Op.in]: vids }, status: "active" },
      });
      const bookedVIDs = bookings.map((b) => b.VehicleId);
      avlblV = vehicles.filter((v) => !bookedVIDs.includes(v.id));
    }

    return res.send(avlblV);
  } catch (e) {
    return errorHandler(e, req, res);
  }
});

/**
 * @swagger
 * /vehicle/all:
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
    return res.status(200).send(await Vehicle.findAll());
  } catch (e) {
    return errorHandler(e, req, res);
  }
});

/**
 * @swagger
 * /vehicle:
 *     patch:
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
router.patch(
  "/:id/:sid",
  checkUser,
  checkRole,
  async (req: Request, res: Response) => {
    try {
      const { id, sid } = req.params;
      const booking = await Booking.findOne({
        where: { status: ACTIVE, VehicleId: id },
      });
      if (booking) throw new ForbiddenError();
      const vehicle = await Vehicle.update(
        { stationID: Number(sid) == 0 ? null : Number(sid) },
        { where: { id } }
      );
      return res.status(200).send(vehicle);
    } catch (e) {
      return errorHandler(e, req, res);
    }
  }
);

export default router;
