import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface CrowdStrikeModel extends Model {
  id?: number;
  processingDate?: Date;
  protectedSystems?: number;
  incidents?: number;
  detects?: number;
}

export interface CrowdStrikeCreation extends Optional<CrowdStrikeModel, 'id'> {}
export interface CrowdStrikeInstance extends Model<CrowdStrikeModel, CrowdStrikeCreation> {}

export const CrowdStrike: ModelDefined<CrowdStrikeModel, CrowdStrikeCreation> = sequelize.define(
  'crowd_strike',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    protectedSystems: {
      type: DataTypes.INTEGER,
    },
    incidents: {
      type: DataTypes.INTEGER,
    },
    detects: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
    },
  },
  {
    underscored: true,
    timestamps: true,
  },
);
