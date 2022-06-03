import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface TenableVprCvssModel extends Model {
  id?: number;
  processingDate?: Date;
  cvssLowVprLow?: number;
  cvssLowVprMedium?: number;
  cvssLowVprHigh?: number;
  cvssLowVprCritical?: number;
  cvssMediumVprLow?: number;
  cvssMediumVprMedium?: number;
  cvssMediumVprHigh?: number;
  cvssMediumVprCritical?: number;
  cvssHighVprLow?: number;
  cvssHighVprMedium?: number;
  cvssHighVprHigh?: number;
  cvssHighVprCritical?: number;
  cvssCriticalVprLow?: number;
  cvssCriticalVprMedium?: number;
  cvssCriticalVprHigh?: number;
  cvssCriticalVprCritical?: number;
}

export interface TenableVprCvssCreation extends Optional<TenableVprCvssModel, 'id'> {}
export interface TenableVprCvssInstance extends Model<TenableVprCvssModel, TenableVprCvssCreation> {}

export const TenableVprCvss: ModelDefined<TenableVprCvssModel, TenableVprCvssCreation> = sequelize.define(
  'tenable_vpr_cvss',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    cvssLowVprLow: {
      type: DataTypes.INTEGER,
    },
    cvssLowVprMedium: {
      type: DataTypes.INTEGER,
    },
    cvssLowVprHigh: {
      type: DataTypes.INTEGER,
    },
    cvssLowVprCritical: {
      type: DataTypes.INTEGER,
    },
    cvssMediumVprLow: {
      type: DataTypes.INTEGER,
    },
    cvssMediumVprMedium: {
      type: DataTypes.INTEGER,
    },
    cvssMediumVprHigh: {
      type: DataTypes.INTEGER,
    },
    cvssMediumVprCritical: {
      type: DataTypes.INTEGER,
    },
    cvssHighVprLow: {
      type: DataTypes.INTEGER,
    },
    cvssHighVprMedium: {
      type: DataTypes.INTEGER,
    },
    cvssHighVprHigh: {
      type: DataTypes.INTEGER,
    },
    cvssHighVprCritical: {
      type: DataTypes.INTEGER,
    },
    cvssCriticalVprLow: {
      type: DataTypes.INTEGER,
    },
    cvssCriticalVprMedium: {
      type: DataTypes.INTEGER,
    },
    cvssCriticalVprHigh: {
      type: DataTypes.INTEGER,
    },
    cvssCriticalVprCritical: {
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
