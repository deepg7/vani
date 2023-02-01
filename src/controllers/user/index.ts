import User, { UserInput } from "../../models/user";
import { Request, Response } from "express";
import errorHandler, {
  BadRequestError,
  NotFoundError,
} from "../../config/utils/errorhandler";
import { ADMIN } from "../../config/utils/constants";

const createProfile = async (req: Request, res: Response) => {
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
};

const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { phone } = req;
    const user = await User.findOne({ where: { phone } });
    if (!user) throw new NotFoundError();
    return res.status(200).send(user);
  } catch (e) {
    return errorHandler(e, req, res);
  }
};

const updateUserToAdmin = async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;
    const user = await User.update({ role: ADMIN }, { where: { phone } });
    return res.status(201).send(user);
  } catch (e) {
    errorHandler(e, req, res);
  }
};

const getUserExistence = async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;
    const user = await User.findOne({ where: { phone } });
    return res.status(200).send(!!user);
  } catch (e) {
    errorHandler(e, req, res);
  }
};
export { createProfile, getUserProfile, updateUserToAdmin, getUserExistence };
