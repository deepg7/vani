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
 * /user:
 *     post:
 *         summary: Complete profile of signed in user
 *         parameters:
 *             - in: header
 *               name: Authorization
 *               type: string
 *               description: Bearer + firebase Access token
 *         responses:
 *             201:
 *                 description: Created User is returned
 */
router.post("/", checkUser, async (req: Request, res: Response) => {
  try {
    const payload = req.body.payload as UserInput;
    console.log(req.body.payload.phone !== req.phone);
    if (req.body.payload.phone !== req.phone) throw new BadRequestError();
    const user = await User.create(payload);
    return res.status(201).send(user);
  } catch (e) {
    console.log(e);
    return errorHandler(e, req, res);
  }
});

/**
 * @swagger
 * /user:
 *     get:
 *         summary: Retrieve user data
 *         parameters:
 *             - in: header
 *               name: Authorization
 *               type: string
 *               description: Bearer + firebase Access token
 *         responses:
 *             200:
 *                 description: user profile data
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

/**
 * @swagger
 * /user/{phone}:
 *     patch:
 *         summary: Update user to admin. Only for admins.
 *         parameters:
 *             - in: header
 *               name: Authorization
 *               type: string
 *               description: Bearer + firebase Access token
 *             - in: path
 *               name: phone
 *               type: string
 *               description: phone number with country code.
 *         responses:
 *             201:
 *                 description: data=[0] means not found and data=[1] means updated.
 */
router.patch(
  "/:phone",
  checkUser,
  checkRole,
  async (req: Request, res: Response) => {
    try {
      const { phone } = req.params;
      const user = await User.update({ role: ADMIN }, { where: { phone } });
      return res.status(201).send(user);
    } catch (e) {
      errorHandler(e, req, res);
    }
  }
);

/**
 * @swagger
 * /user/{phone}:
 *     get:
 *         summary: Check if users profile exists. Works without any kind of auth. Used for checking whether user with entered phone number has a profile saved in postgres or not.
 *         parameters:
 *             - in: path
 *               name: phone
 *               type: string
 *               description: phone number with country code.
 *         responses:
 *             200:
 *                 description: boolean value indicating whether profile exists for entered phone number or not.
 */
router.get("/:phone", async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;
    const user = await User.findOne({ where: { phone } });
    return res.status(200).send(!!user);
  } catch (e) {
    errorHandler(e, req, res);
  }
});

export default router;
