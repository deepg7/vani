import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

import stationRouter from "./routers/station";
import vehicleRouter from "./routers/vehicle";

app.use("/station", stationRouter);
app.use("/vehicle", vehicleRouter);

export default app;
