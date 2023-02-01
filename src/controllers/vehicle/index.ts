import { Request, Response } from "express";
import errorHandler, { ForbiddenError } from "../../config/utils/errorhandler";
import Booking from "../../models/booking";
import Vehicle, { VehicleInput } from "../../models/vehicle";
import User from "../../models/user";
import Station from "../../models/station";
import { ACTIVE, ADMIN } from "../../config/utils/constants";
import { Op } from "sequelize";

const assignVehicleToStation = async (req: Request, res: Response) => {
  try {
    const { id, sid } = req.params;
    const booking = await Booking.findOne({
      where: { status: ACTIVE, VehicleId: id },
    });
    if (booking) throw new ForbiddenError();
    const vehicle = await Vehicle.update(
      { StationId: Number(sid) == 0 ? null : Number(sid) },
      { where: { id } }
    );
    return res.status(200).send(vehicle);
  } catch (e) {
    return errorHandler(e, req, res);
  }
};

const getAllAvailableVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.findAll();
    const bookings = await Booking.findAll({ where: { status: ACTIVE } });
    const vids = vehicles.map((v) => v.id);
    const bookedVids = bookings.map((b) => b.VehicleId);
    const availableVehicles = vehicles.filter(
      (v) => !bookedVids.includes(v.id)
    );
    return res.status(200).send(availableVehicles);
  } catch (e) {
    return errorHandler(e, req, res);
  }
};

const getAvailableVehiclesForStation = async (req: Request, res: Response) => {
  try {
    let { sid } = req.params;
    const vehicles = await Vehicle.findAll({
      where: { StationId: sid == "0" ? null : sid },
      include: Station,
    });
    console.log(vehicles);
    let avlblV: Vehicle[] = [];
    if (sid == "0") {
      const { phone } = req;
      const user = await User.findOne({ where: { phone } });
      if (!user || user.role !== ADMIN) throw new ForbiddenError();
      avlblV = vehicles;
    } else {
      const vids = vehicles.map((v) => v.id);
      const bookings = await Booking.findAll({
        where: { VehicleId: { [Op.in]: vids }, status: "active" },
      });
      const bookedVIDs = bookings.map((b) => b.VehicleId);
      avlblV = vehicles.filter((v) => !bookedVIDs.includes(v.id));
    }

    return res.send(avlblV);
  } catch (e) {
    return errorHandler(e, req, res);
  }
};

const addVehicle = async (req: Request, res: Response) => {
  try {
    const payload = req.body.payload as VehicleInput;
    const vehicle = await Vehicle.create(payload);
    return res.status(201).send(vehicle);
  } catch (e) {
    return errorHandler(e, req, res);
  }
};

export {
  assignVehicleToStation,
  getAllAvailableVehicles,
  getAvailableVehiclesForStation,
  addVehicle,
};
