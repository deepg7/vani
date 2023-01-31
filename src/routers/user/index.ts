import { Request, Response, Router } from "express";
import checkUser from "../../config/firebase";
import User, { UserInput } from "../../models/user";

const router = Router();

/**
 * @swagger
 * /booking:
 *     get:
 *         summary: Retrieve all the videos in a paginated response.[made for PART 2 of BASIC REQUIREMENTS]
 *         parameters:
 *             - in: query
 *               name: limit
 *               type: integer
 *               description: max number of tweets to return. Default is 5.
 *             - in: query
 *               name: offset
 *               type: integer
 *               description: number of tweets to offset the results by. Default is 0.
 *             - in: query
 *               name: pageNo
 *               type: integer
 *               description: can be used with limit to get a paginated response
 *         responses:
 *             200:
 *                 description: A paginated list of videos
 */
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

/**
 * @swagger
 * /booking:
 *     get:
 *         summary: Retrieve all the videos in a paginated response.[made for PART 2 of BASIC REQUIREMENTS]
 *         parameters:
 *             - in: query
 *               name: limit
 *               type: integer
 *               description: max number of tweets to return. Default is 5.
 *             - in: query
 *               name: offset
 *               type: integer
 *               description: number of tweets to offset the results by. Default is 0.
 *             - in: query
 *               name: pageNo
 *               type: integer
 *               description: can be used with limit to get a paginated response
 *         responses:
 *             200:
 *                 description: A paginated list of videos
 */
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
