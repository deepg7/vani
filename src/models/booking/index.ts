import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";
import User from "../user";
import Vehicle from "../vehicle";

interface BookingAttributes {
  id: number;
  UserId: number;
  VehicleId: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface BookingInput extends Optional<BookingAttributes, "id"> {}
export interface BookingOutput extends Required<BookingAttributes> {}

class Booking
  extends Model<BookingAttributes, BookingInput>
  implements BookingAttributes
{
  public id!: number;
  public UserId!: number;
  public VehicleId!: number;
  public status!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    VehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Vehicle,
        key: "id",
      },
    },
  },
  {
    indexes: [
      {
        name: "vehicle_status",
        fields: ["VehicleId", "status"],
        where: {
          status: "active",
        },
        unique: true,
      },
      {
        name: "user_status",
        fields: ["UserId", "status"],
        where: {
          status: "active",
        },
        unique: true,
      },
    ],
    timestamps: true,
    sequelize: sequelize,
    paranoid: true,
  }
);

export default Booking;
