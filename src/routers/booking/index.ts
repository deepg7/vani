import { Request, Response, Router } from "express";
import Booking from "../../models/booking";
import User from "../../models/user";
import Vehicle from "../../models/vehicle";

const router = Router();

const ACTIVE = "active";
const INACTIVE = "inactive";

router.post("/:uid/:vid", async (req: Request, res: Response) => {
  try {
    const { uid, vid } = req.params;
    const user = await User.findByPk(uid);
    const vehicle = await Vehicle.findByPk(vid);
    if (!vehicle || !user) throw new Error("err");
    const booking = await Booking.create({
      VehicleId: Number(vid),
      UserId: Number(uid),
      status: ACTIVE,
    });
    return res.status(201).send(booking);
  } catch (e) {
    return res.send(e);
  }
});

//toDO ADD A TRANSACTION HERE
router.patch("/:id/:sid", async (req: Request, res: Response) => {
  try {
    const { id, sid } = req.params;
    if (!id || !sid) throw new Error("empty");
    const booking = await Booking.update(
      { status: INACTIVE },
      { where: { id } }
    );
    const vehicleID = (await Booking.findByPk(id))?.VehicleId;
    if (!vehicleID) throw new Error("err");
    const vehicle = await Vehicle.update(
      { stationID: Number(sid) },
      { where: { id: vehicleID } }
    );
    return res.status(201).send(booking);
  } catch (e) {
    return res.send(e);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    return res
      .status(200)
      .send(await Booking.findAll({ where: { VehicleId: 1 } }));
  } catch (e) {
    return res.send(e);
  }
});

export default router;
