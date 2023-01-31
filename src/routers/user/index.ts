import { Request, Response, Router } from "express";
import checkUser from "../../config/firebase";
import User, { UserInput } from "../../models/user";

const router = Router();

router.post("/", checkUser, async (req: Request, res: Response) => {
  try {
    const payload = req.body.payload as UserInput;
    if (req.body.payload.phone !== req.phone) throw new Error("bad req");
    const user = await User.create(payload);
    return res.status(201).send(user);
  } catch (e) {
    return res.send(e);
  }
});

router.get("/", checkUser, async (req: Request, res: Response) => {
  try {
    const { phone } = req;
    const user = await User.findOne({ where: { phone } });
    console.log(phone, user);
    return res.status(200).send(user);
  } catch (e) {
    return res.send(e);
  }
});

export default router;
