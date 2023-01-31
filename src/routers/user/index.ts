import { Request, Response, Router } from "express";
import { checkUser, checkRole } from "../../config/firebase";
import { ADMIN } from "../../config/utils/constants";
import errorHandler, {
  BadRequestError,
  NotFoundError,
} from "../../config/utils/errorhandler";
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
    if (req.body.payload.phone !== req.phone) throw new BadRequestError();
    const user = await User.create(payload);
    return res.status(201).send(user);
  } catch (e) {
    return errorHandler(e, req, res);
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
    if (!user) throw new NotFoundError();
    return res.status(200).send(user);
  } catch (e) {
    return errorHandler(e, req, res);
  }
});

router.patch(
  "/:id",
  checkUser,
  checkRole,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await User.update({ role: ADMIN }, { where: { id } });
      return res.status(201).send(user);
    } catch (e) {
      errorHandler(e, req, res);
    }
  }
);

export default router;
