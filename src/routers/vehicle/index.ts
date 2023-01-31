import e, { Request, Response, Router } from "express";
import { Op } from "sequelize";
import Booking from "../../models/booking";
import Vehicle, { VehicleInput } from "../../models/vehicle";

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
router.post("/", async (req: Request, res: Response) => {
  try {
    //cehck user and role
    const payload = req.body.payload as VehicleInput;
    const vehicle = await Vehicle.create(payload);
    return res.status(201).send(vehicle);
  } catch (e) {
    return res.send(e);
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
router.get("/:sid", async (req: Request, res: Response) => {
  try {
    let { sid } = req.params;
    const vehicles = await Vehicle.findAll({
      where: { stationID: sid == "0" ? null : sid },
    });
    // return res.send(vehicles);
    let avlblV: Vehicle[] = [];
    //if 0 check user role
    if (sid == "0") {
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
    return res.send(e);
  }
});

import checkUser from "../../config/firebase";

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
router.get("/", checkUser, async (req: Request, res: Response) => {
  try {
    return res.status(200).send(await Vehicle.findAll());
  } catch (e) {
    return res.send(e);
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
router.patch("/:id/:sid", async (req: Request, res: Response) => {
  try {
    //check null/id/not booked currently
    const { id, sid } = req.params;
    const vehicle = await Vehicle.update(
      { stationID: Number(sid) },
      { where: { id } }
    );
  } catch (e) {
    return res.send(e);
  }
});

export default router;
