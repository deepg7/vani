import { Sequelize } from "sequelize";

const db_url = process.env.db || "localhost://5432/postgres";
export const sequelize = new Sequelize(db_url);
import Station from "../../models/station";
import User from "../../models/user";
import Vehicle from "../../models/vehicle";
import Booking from "../../models/booking";
import { SEED_USER } from "../utils/constants";

const connectToDB = async () => {
  try {
    await sequelize.authenticate();

    //ASSOCIATIONS
    Station.hasMany(Vehicle, {
      foreignKey: "StationId",
    });
    Vehicle.belongsTo(Station);

    Booking.belongsTo(User, {
      foreignKey: "UserId",
      as: "user",
    });
    Booking.belongsTo(Vehicle, {
      foreignKey: "VehicleId",
      as: "vehicle",
    });
    await sequelize.sync({ alter: true });

    //SYNCING ALL THE MODELS
    await Station.sync({ alter: true });
    await Vehicle.sync({ alter: true });
    await User.sync({ alter: true });
    await Booking.sync({ alter: true });

    await seed();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

const seed = async () => {
  try {
    const searchedUser = await User.findOne({
      where: { phone: SEED_USER.phone },
    });
    if (!searchedUser) {
      const user = await User.create(SEED_USER);
      // console.log(user);
    }
  } catch (e) {
    console.log(e);
  }
};
export default connectToDB;
