import { Request, Response, Router } from "express";
import User, { UserInput } from "../../models/user";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const payload = req.body.payload as UserInput;
    const user = await User.create(payload);
    return res.status(201).send(user);
  } catch (e) {
    return res.send(e);
  }
});

export default router;
