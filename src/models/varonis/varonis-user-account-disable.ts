import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface VaronisUserAccountDisableKpiModel extends Model {
  id?: number;
  processingDate?: Date;
  operationSource?: string;
  eventTime?: Date;
  fileServerDomain?: string;
  objectType?: string;
  path?: string;
  object?: string;
  eventOperation?: string;
  eventType?: string;
  eventStatus?: string;
  operationBy?: string;
  eventDescription?: string;
  fileType?: string;
  eventCount?: number;
  deviceIpAddress?: string;
  deviceName?: string;
  mailSource?: string;
  mailRecipients?: string;
  mailDate?: Date;
  attachmentName?: string;
}

export interface VaronisUserAccountDisableKpiCreation extends Optional<VaronisUserAccountDisableKpiModel, 'id'> {}
export interface VaronisUserAccountDisableKpiInstance extends Model<VaronisUserAccountDisableKpiModel, VaronisUserAccountDisableKpiCreation> {}

export const VaronisUserAccountDisableKpi: ModelDefined<VaronisUserAccountDisableKpiModel, VaronisUserAccountDisableKpiCreation> = sequelize.define(
  'varonis_user_account_disable_kpi',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    operationSource: {
      allowNull: true,
      type: DataTypes.STRING(100),
    },
    eventTime: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    fileServerDomain: {
      allowNull: true,
      type: DataTypes.STRING(150),
    },
    objectType: {
      allowNull: true,
      type: DataTypes.STRING(100),
    },
    path: {
      allowNull: true,
      type: DataTypes.STRING(255),
    },
    object: {
      allowNull: true,
      type: DataTypes.STRING(100),
    },
    eventOperation: {
      allowNull: true,
      type: DataTypes.STRING(50),
    },
    eventType: {
      allowNull: true,
      type: DataTypes.STRING(50),
    },
    eventStatus: {
      allowNull: true,
      type: DataTypes.STRING(50),
    },
    operationBy: {
      allowNull: true,
      type: DataTypes.STRING(100),
    },
    eventDescription: {
      allowNull: true,
      type: DataTypes.STRING(100),
    },
    fileType: {
      allowNull: true,
      type: DataTypes.STRING(20),
    },
    eventCount: {
      allowNull: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    deviceIpAddress: {
      allowNull: true,
      type: DataTypes.STRING(50),
    },
    deviceName: {
      allowNull: true,
      type: DataTypes.STRING(100),
    },
    mailSource: {
      allowNull: true,
      type: DataTypes.STRING(50),
    },
    mailRecipients: {
      allowNull: true,
      type: DataTypes.STRING(50),
    },
    mailDate: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    attachmentName: {
      allowNull: true,
      type: DataTypes.STRING(100),
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
