import { Request, Response } from "express";
import { ACTIVE, INACTIVE } from "../../config/utils/constants";
import errorHandler, {
  ForbiddenError,
  NotFoundError,
} from "../../config/utils/errorhandler";
import Booking from "../../models/booking";
import User from "../../models/user";
import Vehicle from "../../models/vehicle";

const getActiveBookingsOfUser = async (req: Request, res: Response) => {
  try {
    const { phone } = req;
    const user = await User.findOne({ where: { phone } });
    if (!user) throw new NotFoundError();
    //joins
    const bookings = await Booking.findAll({
      where: { UserId: user.id, status: ACTIVE },
      include: ["user", "vehicle"],
    });
    if (!bookings) throw new NotFoundError();
    return res.status(200).send(bookings);
  } catch (e) {
    console.log(e);
    return errorHandler(e, req, res);
  }
};

const getAllActiveBookings = async (req: Request, res: Response) => {
  try {
    return res.status(200).send(
      await Booking.findAll({
        include: ["user", "vehicle"],
        where: { status: ACTIVE },
      })
    );
  } catch (e) {
    return errorHandler(e, req, res);
  }
};

const terminateBooking = async (req: Request, res: Response) => {
  try {
    //add transaction
    const { id, sid } = req.params;
    if (!id || !sid) throw new NotFoundError();
    const checkBooking = await Booking.findOne({
      where: { id },
      include: ["user"],
    });
    const { phone } = req;
    const user = await User.findOne({ where: { phone } });
    //@ts-ignore
    console.log(checkBooking.user);
    //@ts-ignore
    if (checkBooking?.user.id != user?.id) throw new ForbiddenError();
    const booking = await Booking.update(
      { status: INACTIVE },
      { where: { id } }
    );
    if (!booking) throw new NotFoundError();
    const vehicleID = (await Booking.findByPk(id))?.VehicleId;
    if (!vehicleID) throw new NotFoundError();
    const vehicle = await Vehicle.update(
      { StationId: Number(sid) },
      { where: { id: vehicleID } }
    );
    return res.status(200).send(booking);
  } catch (e) {
    return errorHandler(e, req, res);
  }
};

const createBooking = async (req: Request, res: Response) => {
  try {
    const { phone } = req;
    const user = await User.findOne({ where: { phone } });
    const { vid } = req.params;
    if (vid == null) throw new ForbiddenError();
    const vehicle = await Vehicle.findByPk(vid);
    if (!vehicle || !user) throw new NotFoundError();
    const booking = await Booking.create({
      VehicleId: Number(vid),
      UserId: Number(user.id),
      status: ACTIVE,
    });
    return res.status(201).send(booking);
  } catch (e) {
    return errorHandler(e, req, res);
  }
};
export {
  getActiveBookingsOfUser,
  getAllActiveBookings,
  terminateBooking,
  createBooking,
};
