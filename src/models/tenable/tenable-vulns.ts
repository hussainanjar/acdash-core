import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface TenableVulnsModel extends Model {
  id?: number;
  processingDate?: Date;
  systemKnownVulns?: number;
  publicServersVulns?: number;
}

export interface TenableVulnsCreation extends Optional<TenableVulnsModel, 'id'> {}
export interface TenableVulnsInstance extends Model<TenableVulnsModel, TenableVulnsCreation> {}

export const TenableVulns: ModelDefined<TenableVulnsModel, TenableVulnsCreation> = sequelize.define(
  'tenable_vulns',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    systemKnownVulns: {
      type: DataTypes.INTEGER,
    },
    publicServersVulns: {
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
