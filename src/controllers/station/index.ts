import { Request, Response } from "express";
import errorHandler from "../../config/utils/errorhandler";
import Station, { StationInput } from "../../models/station";

const getStationByPincode = async (req: Request, res: Response) => {
  try {
    const { pincode } = req.params;
    const stations = await Station.findAll({
      where: {
        pincode,
      },
    });
    return res.status(200).send(stations);
  } catch (e) {
    return errorHandler(e, req, res);
  }
};

const getAllStations = async (req: Request, res: Response) => {
  try {
    const stations = await Station.findAll();
    return res.status(200).send(stations);
  } catch (e) {
    return errorHandler(e, req, res);
  }
};

const addStation = async (req: Request, res: Response) => {
  try {
    const payload = req.body.payload as StationInput;
    const station = await Station.create(payload);
    return res.status(201).send(station);
  } catch (e) {
    return errorHandler(e, req, res);
  }
};

export { getStationByPincode, getAllStations, addStation };
