import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface JobSchedulerModel extends Model {
  id?: number;
  name?: string;
  runPattern?: string;
  isProcessing?: boolean;
  isActive?: boolean;
}

export interface JobSchedulerCreation extends Optional<JobSchedulerModel, 'id'> {}
export interface JobSchedulerInstance extends Model<JobSchedulerModel, JobSchedulerCreation> {}

export const JobScheduler: ModelDefined<JobSchedulerModel, JobSchedulerCreation> = sequelize.define(
  'job_scheduler',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
    },
    runPattern: {
      type: DataTypes.STRING(20),
    },
    isProcessing: {
      type: DataTypes.BOOLEAN,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    underscored: true,
    timestamps: false,
  },
);
