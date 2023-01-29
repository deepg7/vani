import { Request, Response, Router } from "express";
import User, { UserInput } from "../../models/user";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const payload = req.body.payload as UserInput;
  const user = await User.create(payload);
  return res.status(201).send(user);
});

export default router;
