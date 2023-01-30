import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

interface StationAttributes {
  id: number;
  name: string;
  pincode: number;
  state: string;
  city: string;
  streetAddress: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface StationInput extends Optional<StationAttributes, "id"> {}
export interface StationOutput extends Required<StationAttributes> {}

class Station
  extends Model<StationAttributes, StationInput>
  implements StationAttributes
{
  public id!: number;
  public name!: string;
  public pincode!: number;
  public state!: string;
  public city!: string;
  public streetAddress!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Station.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    streetAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pincode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        is: /[0-9]{6}/,
      },
    },
  },
  {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true,
  }
);

export default Station;
