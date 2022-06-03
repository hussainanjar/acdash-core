import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface AlertLogicModel extends Model {
  id?: number;
  processingDate?: Date;
  accountId?: number;
  assetDeploymentType?: string;
  assetHostName?: string;
  associatedEventCount?: number;
  associatedLogCount?: number;
  autoClosed?: boolean;
  autoClosedBy?: number;
  autoClosedUserName?: string;
  createTime?: number;
  createTimeStr?: Date;
  customerFeedbackNoteCount?: number;
  customerStatusReasonCode?: string;
  customerStatus?: string;
  customerStatusChangeTime?: Date;
  customerStatusUserId?: string;
  customerStatusUserName?: string;
  hasAssets?: boolean;
  humanFriendlyId?: string;
  incidentId?: string;
  incidentThreatRating?: string;
  incidentAtttackClassId?: number;
  incidentAtttackClassIdStr?: string;
  incidentEscalated?: boolean;
  incidentEscalationTime?: Date;
  noteCount?: number;
  snoozeStatusSnoozed?: boolean;
  updateTime?: number;
  updateTimeStr?: Date;
}

export interface AlertLogicCreation extends Optional<AlertLogicModel, 'id'> {}
export interface AlertLogicInstance extends Model<AlertLogicModel, AlertLogicCreation> {}

export const AlertLogic: ModelDefined<AlertLogicModel, AlertLogicCreation> = sequelize.define(
  'alert_logic',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    accountId: {
      type: DataTypes.INTEGER,
    },
    assetDeploymentType: {
      type: DataTypes.STRING(200),
    },
    assetHostName: {
      type: DataTypes.STRING(200),
    },
    associatedEventCount: {
      type: DataTypes.INTEGER,
    },
    associatedLogCount: {
      type: DataTypes.INTEGER,
    },
    autoClosed: {
      type: DataTypes.BOOLEAN,
    },
    autoClosedBy: {
      type: DataTypes.INTEGER,
    },
    autoClosedUserName: {
      type: DataTypes.STRING(200),
    },
    createTime: {
      type: DataTypes.FLOAT(50),
    },
    createTimeStr: {
      type: DataTypes.DATE,
    },
    customerFeedbackNoteCount: {
      type: DataTypes.INTEGER,
    },
    customerStatusReasonCode: {
      type: DataTypes.STRING(100),
    },
    customerStatus: {
      type: DataTypes.STRING(100),
    },
    customerStatusChangeTime: {
      type: DataTypes.DATE,
    },
    customerStatusUserId: {
      type: DataTypes.STRING(200),
    },
    customerStatusUserName: {
      type: DataTypes.STRING(200),
    },
    hasAssets: {
      type: DataTypes.BOOLEAN,
    },
    humanFriendlyId: {
      type: DataTypes.STRING(200),
    },
    incidentId: {
      type: DataTypes.STRING(200),
    },
    incidentThreatRating: {
      type: DataTypes.STRING(200),
    },
    incidentAtttackClassId: {
      type: DataTypes.INTEGER,
    },
    incidentAtttackClassIdStr: {
      type: DataTypes.STRING(200),
    },
    incidentEscalated: {
      type: DataTypes.BOOLEAN,
    },
    incidentEscalationTime: {
      type: DataTypes.DATE,
    },
    noteCount: {
      type: DataTypes.INTEGER,
    },
    snoozeStatusSnoozed: {
      type: DataTypes.BOOLEAN,
    },
    updateTime: {
      type: DataTypes.INTEGER,
    },
    updateTimeStr: {
      type: DataTypes.DATE,
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
