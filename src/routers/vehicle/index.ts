import { Request, Response, Router } from "express";
import { Op } from "sequelize";
import Booking from "../../models/booking";
import Vehicle, { VehicleInput } from "../../models/vehicle";

const router = Router();

//CREATE VEHICLE
router.post("/", async (req: Request, res: Response) => {
  try {
    const payload = req.body.payload as VehicleInput;
    const vehicle = await Vehicle.create(payload);
    return res.status(201).send(vehicle);
  } catch (e) {
    return res.send(e);
  }
});

//GET VEHICLE FOR A PARTICULAR STATION
router.get("/:sid", async (req: Request, res: Response) => {
  try {
    const { sid } = req.params;
    const vehicles = await Vehicle.findAll({ where: { stationID: sid } });
    // return res.send(vehicles);
    const vids = vehicles.map((v) => v.id);
    const bookings = await Booking.findAll({
      where: { VehicleId: { [Op.in]: vids }, status: "active" },
    });
    const bookedVIDs = bookings.map((b) => b.VehicleId);
    const avlblV = vehicles.filter((v) => !bookedVIDs.includes(v.id));
    return res.send(avlblV);
  } catch (e) {
    return res.send(e);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    return res.status(200).send(await Vehicle.findAll());
  } catch (e) {
    return res.send(e);
  }
});

export default router;
