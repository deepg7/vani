import { Request, Response, Router } from "express";
import Vehicle, { VehicleInput } from "../../models/vehicle";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const payload = req.body.payload as VehicleInput;
    const vehicle = await Vehicle.create(payload);
    return res.status(201).send(vehicle);
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
