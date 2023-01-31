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

router.get("/", async (req: Request, res: Response) => {
  try {
    const stations = await Station.findAll();
    return res.status(200).send(stations);
  } catch (e) {
    return res.send(e);
  }
});

router.get("/:pincode", async (req: Request, res: Response) => {
  try {
    const stations = await Station.findAll({
      where: {
        pincode: req.params.pincode,
      },
    });
    return res.status(200).send(stations);
  } catch (e) {
    return res.send(e);
  }
});

export default router;
