import { Router } from "express";
import { checkRole, checkUser } from "../../config/firebase";
import {
  addVehicle,
  assignVehicleToStation,
  getAllAvailableVehicles,
  getAvailableVehiclesForStation,
} from "../../controllers/vehicle";
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
router.post("/", checkUser, checkRole, addVehicle);

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
router.get("/:sid", checkUser, getAvailableVehiclesForStation);

/**
 * @swagger
 * /vehicle/all:
 *     get:
 *         summary: Get all available vehicles. Used for "assign vehicle to station" functionality. only for admins.
 *         parameters:
 *             - in: header
 *               name: Authorization
 *               type: string
 *               description: Bearer + firebase Access token
 *         responses:
 *             200:
 *                 description: Get all available vehicles across all stations including those with stationId = 0.
 */
router.get("/", checkUser, checkRole, getAllAvailableVehicles);

/**
 * @swagger
 * /vehicle/{id}/{sid}:
 *     patch:
 *         summary: Update station id of a vehicle. Only for admins.
 *         parameters:
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
router.patch("/:id/:sid", checkUser, checkRole, assignVehicleToStation);

export default router;
