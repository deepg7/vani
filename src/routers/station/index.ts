import { Request, Response, Router } from "express";
import errorHandler from "../../config/utils/errorhandler";
import Station, { StationInput } from "../../models/station";
import { checkRole, checkUser } from "../../config/firebase";

const router = Router();

/**
 * @swagger
 * /station:
 *     post:
 *         summary: Create a station. Only for admins.
 *         parameters:
 *             - in: header
 *               name: Authorization
 *               type: string
 *               description: Bearer + firebase access token
 *         responses:
 *             200:
 *                 description: A station is created.
 */
router.post("/", checkUser, checkRole, async (req: Request, res: Response) => {
  try {
    const payload = req.body.payload as StationInput;
    const station = await Station.create(payload);
    return res.status(201).send(station);
  } catch (e) {
    return errorHandler(e, req, res);
  }
});

/**
 * @swagger
 * /station:
 *     get:
 *         summary: Get all stations.
 *         parameters:
 *             - in: header
 *               name: Authorization
 *               type: string
 *               description: Bearer + firebase Access token
 *         responses:
 *             200:
 *                 description: A list of stations
 */
router.get("/", checkUser, async (req: Request, res: Response) => {
  try {
    const stations = await Station.findAll();
    return res.status(200).send(stations);
  } catch (e) {
    return errorHandler(e, req, res);
  }
});

/**
 * @swagger
 * /station/{pincode}:
 *     get:
 *         summary: Retrieve all the stations of a particular pincode.
 *         parameters:
 *             - in: header
 *               name: Authorization
 *               type: string
 *               description: Bearer + firebase Access token
 *             - in: path
 *               name: pincode
 *               type: integer
 *               description: valid 6 digit pincode
 *         responses:
 *             200:
 *                 description: A list of stations having given pincode.
 */
router.get("/:pincode", checkUser, async (req: Request, res: Response) => {
  try {
    const { pincode } = req.params;
    const stations = await Station.findAll({
      where: {
        pincode,
      },
    });
    return res.status(200).send(stations);
  } catch (e) {
    return errorHandler(e, req, res);
  }
});

export default router;
