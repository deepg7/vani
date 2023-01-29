import { Sequelize } from "sequelize";

const db_url = process.env.db || "localhost://5432/postgres";
export const sequelize = new Sequelize(db_url);
import Station from "../../models/station";
import User from "../../models/user";
import Vehicle from "../../models/vehicle";
import Booking from "../../models/booking";
const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    Station.hasMany(Vehicle, {
      foreignKey: "stationID",
    });
    Vehicle.belongsTo(Station);

    User.belongsToMany(Vehicle, { through: Booking });
    Vehicle.belongsToMany(User, { through: Booking });
    Station.sync({ alter: true });
    Vehicle.sync({ alter: true });
    User.sync({ alter: true });
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default connectToDB;
