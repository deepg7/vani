import { Request, Response, Router } from "express";
import { Op } from "sequelize";
import Booking from "../../models/booking";
import Vehicle, { VehicleInput } from "../../models/vehicle";
import { checkUser, checkRole } from "../../config/firebase";
import errorHandler, { ForbiddenError } from "../../config/utils/errorhandler";
import User from "../../models/user";
import { ACTIVE, ADMIN } from "../../config/utils/constants";
import Station from "../../models/station";
const router = Router();

/**
 * @swagger
 * /vehicle:
 *     post:
 *         summary:
 *         parameters:
 *             - in: header
 *               name: Authorization
 *               type: string
 *               description: Bearer + firebase access token
 *         responses:
 *             200:
 *                 description: Returns created vehicle
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
 * /vehicle/{sid}:
 *     get:
 *         summary: Get all available vehicles at a particular station
 *         parameters:
 *             - in: header
 *               name: Authorization
 *               type: string
 *               description: Bearer + firebase Access token
 *             - in: path
 *               name: sid
 *               type: number
 *               description: station id for which vehicles are to be fetched, enter 0 for vehicles with no station assigned.
 *         responses:
 *             200:
 *                 description: A list of vehicles available at the given station
 */
router.get("/:sid", checkUser, async (req: Request, res: Response) => {
  try {
    let { sid } = req.params;
    const vehicles = await Vehicle.findAll({
      where: { StationId: sid == "0" ? null : sid },
      include: Station,
    });
    console.log(vehicles);
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
 *         summary: Get all available vehicles. Used for "assign vehicle to station" functionality. only for admins.
 *         parameters:
 *            - in: header
 *               name: Authorization
 *               type: string
 *               description: Bearer + firebase Access token
 *         responses:
 *             200:
 *                 description: Get all available vehicles across all stations including those with stationId = 0.
 */
router.get("/", checkUser, checkRole, async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.findAll();
    const bookings = await Booking.findAll({ where: { status: ACTIVE } });
    const vids = vehicles.map((v) => v.id);
    const bookedVids = bookings.map((b) => b.VehicleId);
    const availableVehicles = vehicles.filter(
      (v) => !bookedVids.includes(v.id)
    );
    return res.status(200).send(availableVehicles);
  } catch (e) {
    return errorHandler(e, req, res);
  }
});

/**
 * @swagger
 * /vehicle/{id}/{sid}:
 *     patch:
 *         summary:
 *         parameters: Update station id of a vehicle. Only for admins.
 *             - in: path
 *               name: id
 *               type: integer
 *               description: Id of vehicle whose station has to be changed.
 *             - in: path
 *               name: sid
 *               type: integer
 *               description: Id of station where this vehicle must be assigned.
 *         responses:
 *             200:
 *                 description: Station id of vehicle updated successfully if data[0]=1, if data[0]=0, vehicle not found.
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
        { StationId: Number(sid) == 0 ? null : Number(sid) },
        { where: { id } }
      );
      return res.status(200).send(vehicle);
    } catch (e) {
      return errorHandler(e, req, res);
    }
  }
);

export default router;
