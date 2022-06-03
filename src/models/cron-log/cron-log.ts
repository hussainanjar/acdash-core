import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface CronLogModel extends Model {
  id?: number;
  processingDate?: Date;
  serviceType?: string;
  response?: string;
  isSuccess?: boolean;
}

export interface CronLogCreation extends Optional<CronLogModel, 'id'> {}
export interface CronLogInstance extends Model<CronLogModel, CronLogCreation> {}

export const CronLog: ModelDefined<CronLogModel, CronLogCreation> = sequelize.define(
  'cron-log',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    serviceType: {
      type: DataTypes.STRING,
    },
    response: {
      type: DataTypes.STRING,
    },
    isSuccess: {
      type: DataTypes.BOOLEAN,
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
