import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface TenableSlaWorkstationModel extends Model {
  id?: number;
  processingDate?: Date;
  totalVulnsCritical?: number;
  withinSlaVulnsCritical?: number;
  overdueVulnsCritical?: number;
  totalVulnsHigh?: number;
  withinSlaVulnsHigh?: number;
  overdueVulnsHigh?: number;
  totalVulnsMedium?: number;
  withinSlaVulnsMedium?: number;
  overdueVulnsMedium?: number;
}

export interface TenableSlaWorkstationCreation extends Optional<TenableSlaWorkstationModel, 'id'> {}
export interface TenableSlaWorkstationInstance extends Model<TenableSlaWorkstationModel, TenableSlaWorkstationCreation> {}

export const TenableSlaWorkstation: ModelDefined<TenableSlaWorkstationModel, TenableSlaWorkstationCreation> = sequelize.define(
  'tenable_sla_workstation',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    totalVulnsCritical: {
      type: DataTypes.INTEGER,
    },
    withinSlaVulnsCritical: {
      type: DataTypes.INTEGER,
    },
    overdueVulnsCritical: {
      type: DataTypes.INTEGER,
    },
    totalVulnsHigh: {
      type: DataTypes.INTEGER,
    },
    withinSlaVulnsHigh: {
      type: DataTypes.INTEGER,
    },
    overdueVulnsHigh: {
      type: DataTypes.INTEGER,
    },
    totalVulnsMedium: {
      type: DataTypes.INTEGER,
    },
    withinSlaVulnsMedium: {
      type: DataTypes.INTEGER,
    },
    overdueVulnsMedium: {
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
