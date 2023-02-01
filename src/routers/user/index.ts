import { Router } from "express";
import { checkRole, checkUser } from "../../config/firebase";
import {
  createProfile,
  getUserExistence,
  getUserProfile,
  updateUserToAdmin,
} from "../../controllers/user";

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
router.post("/", checkUser, createProfile);

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
router.get("/", checkUser, getUserProfile);

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
router.patch("/:phone", checkUser, checkRole, updateUserToAdmin);

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
router.get("/:phone", getUserExistence);

export default router;
