import { Request, Response, Router } from "express";
import Station, { StationInput } from "../../models/station";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const payload = req.body.payload as StationInput;
  const station = await Station.create(payload);
  return res.status(201).send(station);
});

export default router;
