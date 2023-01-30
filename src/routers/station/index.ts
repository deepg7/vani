import { Request, Response, Router } from "express";
import Station, { StationInput } from "../../models/station";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const payload = req.body.payload as StationInput;
    const station = await Station.create(payload);
    return res.status(201).send(station);
  } catch (e) {
    return res.send(e);
  }
});

export default router;
