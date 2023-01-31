import { Request, Response, Router } from "express";
import Station, { StationInput } from "../../models/station";

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
router.post("/", async (req: Request, res: Response) => {
  try {
    //check user and role
    const payload = req.body.payload as StationInput;
    const station = await Station.create(payload);
    return res.status(201).send(station);
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
router.get("/", async (req: Request, res: Response) => {
  try {
    const stations = await Station.findAll();
    return res.status(200).send(stations);
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
router.get("/:pincode", async (req: Request, res: Response) => {
  try {
    const { pincode } = req.params;
    const stations = await Station.findAll({
      where: {
        pincode,
      },
    });
    return res.status(200).send(stations);
  } catch (e) {
    return res.send(e);
  }
});

export default router;
