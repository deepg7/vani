import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

import stationRouter from "./routers/station";
import vehicleRouter from "./routers/vehicle";
import userRouter from "./routers/user";
import bookingRouter from "./routers/booking";

app.use("/booking", bookingRouter);
app.use("/station", stationRouter);
app.use("/vehicle", vehicleRouter);
app.use("/user", userRouter);

export default app;
