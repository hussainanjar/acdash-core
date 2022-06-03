import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface TenableVprMitigateModel extends Model {
  id?: number;
  processingDate?: Date;
  currentMonthVprLow?: number;
  currentMonthVprMedium?: number;
  currentMonthVprHigh?: number;
  currentMonthVprCritical?: number;
  lastMonthVprLow?: number;
  lastMonthVprMedium?: number;
  lastMonthVprHigh?: number;
  lastMonthVprCritical?: number;
  currentQuarterVprLow?: number;
  currentQuarterVprMedium?: number;
  currentQuarterVprHigh?: number;
  currentQuarterVprCritical?: number;
  lastQuarterVprLow?: number;
  lastQuarterVprMedium?: number;
  lastQuarterVprHigh?: number;
  lastQuarterVprCritical?: number;
  overDaysVprLow?: number;
  overDaysVprMedium?: number;
  overDaysVprHigh?: number;
  overDaysVprCritical?: number;
}

export interface TenableVprMitigateCreation extends Optional<TenableVprMitigateModel, 'id'> {}
export interface TenableVprMitigateInstance extends Model<TenableVprMitigateModel, TenableVprMitigateCreation> {}

export const TenableVprMitigate: ModelDefined<TenableVprMitigateModel, TenableVprMitigateCreation> = sequelize.define(
  'tenable_vpr_mitigate_vulns',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    currentMonthVprLow: {
      type: DataTypes.INTEGER,
    },
    currentMonthVprMedium: {
      type: DataTypes.INTEGER,
    },
    currentMonthVprHigh: {
      type: DataTypes.INTEGER,
    },
    currentMonthVprCritical: {
      type: DataTypes.INTEGER,
    },
    lastMonthVprLow: {
      type: DataTypes.INTEGER,
    },
    lastMonthVprMedium: {
      type: DataTypes.INTEGER,
    },
    lastMonthVprHigh: {
      type: DataTypes.INTEGER,
    },
    lastMonthVprCritical: {
      type: DataTypes.INTEGER,
    },
    currentQuarterVprLow: {
      type: DataTypes.INTEGER,
    },
    currentQuarterVprMedium: {
      type: DataTypes.INTEGER,
    },
    currentQuarterVprHigh: {
      type: DataTypes.INTEGER,
    },
    currentQuarterVprCritical: {
      type: DataTypes.INTEGER,
    },
    lastQuarterVprLow: {
      type: DataTypes.INTEGER,
    },
    lastQuarterVprMedium: {
      type: DataTypes.INTEGER,
    },
    lastQuarterVprHigh: {
      type: DataTypes.INTEGER,
    },
    lastQuarterVprCritical: {
      type: DataTypes.INTEGER,
    },
    overDaysVprLow: {
      type: DataTypes.INTEGER,
    },
    overDaysVprMedium: {
      type: DataTypes.INTEGER,
    },
    overDaysVprHigh: {
      type: DataTypes.INTEGER,
    },
    overDaysVprCritical: {
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
