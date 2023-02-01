import { Router } from "express";
import { checkRole, checkUser } from "../../config/firebase";
import {
  addStation,
  getAllStations,
  getStationByPincode,
} from "../../controllers/station";

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
router.post("/", checkUser, checkRole, addStation);

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
router.get("/", checkUser, getAllStations);

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
router.get("/:pincode", checkUser, getStationByPincode);

export default router;
