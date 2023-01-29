import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

interface VehicleAttributes {
  id: number;
  pincode: number;
  model: string;
  fuelType: string;
  type: string;
  color: string;
  number: string;
  stationID: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface VehicleInput extends Optional<VehicleAttributes, "id"> {}
export interface VehicleOutput extends Required<VehicleAttributes> {}

class Vehicle
  extends Model<VehicleAttributes, VehicleInput>
  implements VehicleAttributes
{
  public id!: number;
  public pincode!: number;
  public model!: string;
  public fuelType!: string;
  public type!: string;
  public color!: string;
  public number!: string;
  public stationID!: number;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Vehicle.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fuelType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pincode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stationID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true,
  }
);

export default Vehicle;
