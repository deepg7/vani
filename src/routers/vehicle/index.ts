import { Request, Response, Router } from "express";
import Vehicle, { VehicleInput } from "../../models/vehicle";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const payload = req.body.payload as VehicleInput;
  const vehicle = await Vehicle.create(payload);
  return res.status(201).send(vehicle);
});

router.get("/", async (req: Request, res: Response) => {
  return res.status(200).send(await Vehicle.findAll());
});

export default router;
