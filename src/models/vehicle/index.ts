import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

interface VehicleAttributes {
  id: number;
  model: string;
  fuelType: string;
  type: string;
  color: string;
  number: string;
  stationID?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface VehicleInput
  extends Optional<VehicleAttributes, "id" | "stationID"> {}
export interface VehicleOutput extends Required<VehicleAttributes> {}

class Vehicle
  extends Model<VehicleAttributes, VehicleInput>
  implements VehicleAttributes
{
  public id!: number;
  public model!: string;
  public fuelType!: string;
  public type!: string;
  public color!: string;
  public number!: string;
  public stationID?: number | null;
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
      //add enum
    },
    fuelType: {
      type: DataTypes.STRING,
      allowNull: false,
      //add enum
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}/,
      },
    },
    stationID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true,
  }
);

export default Vehicle;
