import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
// import swaggerJsDoc from "swagger-jsdoc";
// import * as swaggerUi from "swagger-ui-express";

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

// const swaggerOptions = {
//   swaggerDefinition: {
//     info: {
//       version: "1.0.0",
//       title: "Vani API",
//       description: "Vani API Visual Information",
//     },
//   },
//   apis: ["./routers/**/*.ts"],
// };
// const swaggerDocs = swaggerJsDoc(swaggerOptions);
// app.use(
//   "/docs",
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerDocs, { explorer: true })
// );

export default app;
