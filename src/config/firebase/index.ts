import admin, { ServiceAccount } from "firebase-admin";
import { Request, Response, NextFunction } from "express";
import errorHandler, { AuthenticationError } from "../utils/errorhandler";
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
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((user) => {
      const uid = user.uid;
      if (!user.phone_number) throw new AuthenticationError();
      req.phone = user.phone_number;
      next();
    })
    .catch((error) => {
      console.log(error);
      errorHandler(new AuthenticationError(), req, res);
    });
};
export default checkUser;
