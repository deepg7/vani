import { Request, Response, Router } from "express";
import Booking, { BookingInput } from "../../models/booking";
import User from "../../models/user";
import Vehicle from "../../models/vehicle";

const router = Router();

router.post("/:uid/:vid", async (req: Request, res: Response) => {
  try {
    const { uid, vid } = req.params;
    const user = await User.findByPk(uid);
    const vehicle = await Vehicle.findByPk(vid);
    if (!vehicle || !user) return res.send("bye");
    const booking = await Booking.create({
      VehicleId: Number(vid),
      UserId: Number(uid),
      status: "active",
    });
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
