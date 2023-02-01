import { NextFunction, Request, Response } from "express";
import admin, { ServiceAccount } from "firebase-admin";
import User from "../../models/user";
import { ADMIN } from "../utils/constants";
import errorHandler, {
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "../utils/errorhandler";
const env = process.env;

var serviceAccount: ServiceAccount = {
  projectId: env.project_id,
  privateKey: env.private_key!.replace(/\\n/g, "\n"),
  clientEmail: env.client_email,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const checkUser = (req: Request, res: Response, next: NextFunction) => {
  if (
    !req.header("Authorization") ||
    req.header("Authorization") == undefined
  ) {
    throw new AuthenticationError();
  }
  const idToken = req.header("Authorization")!.replace("Bearer ", "");
  console.log(idToken);
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((user) => {
      if (!user.phone_number) throw new AuthenticationError();
      req.phone = user.phone_number;
      console.log(req.phone);
      next();
    })
    .catch((error) => {
      console.log(error);
      errorHandler(new AuthenticationError(), req, res);
    });
};

const checkRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req;
    const user = await User.findOne({ where: { phone } });
    if (!user) throw new NotFoundError();
    if (user.role !== ADMIN) throw new ForbiddenError();
    console.log(user.role);
    next();
  } catch (e) {
    errorHandler(e, req, res);
  }
};
export { checkUser, checkRole };
