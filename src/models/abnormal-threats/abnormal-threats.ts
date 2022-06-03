import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface AbnormalThreatsModel extends Model {
  id?: number;
  processingDate?: Date;
  threatId?: string;
  abxMessageId?: string;
  abxPortalUrl?: string;
  subject?: string;
  fromAddress?: string;
  fromName?: string;
  toAddresses?: string;
  recipientAddress?: string;
  receivedTime?: Date;
  sentTime?: Date;
  internetMessageId?: string;
  autoRemediated?: boolean;
  postRemediated?: boolean;
  attackType?: string;
  attackStrategy?: string;
  returnPath?: string;
  replyToEmails?: string;
  impersonatedParty?: string;
  attackVector?: string;
  summaryInsights?: string;
  remediationTimestamp?: Date;
  isRead?: boolean;
  attackedParty?: string;
  recipientName?: string;
  recipientTitle?: string;
}

export interface AbnormalThreatsCreation extends Optional<AbnormalThreatsModel, 'id'> {}
export interface AbnormalThreatsInstance extends Model<AbnormalThreatsModel, AbnormalThreatsCreation> {}

export const AbnormalThreats: ModelDefined<AbnormalThreatsModel, AbnormalThreatsCreation> = sequelize.define(
  'abnormal_threats',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    threatId: {
      allowNull: true,
      type: DataTypes.STRING(40),
    },
    abxMessageId: {
      allowNull: true,
      type: DataTypes.STRING(40),
    },
    abxPortalUrl: {
      allowNull: true,
      type: DataTypes.STRING(150),
    },
    subject: {
      allowNull: true,
      type: DataTypes.STRING(256),
    },
    fromAddress: {
      allowNull: true,
      type: DataTypes.STRING(256),
    },
    fromName: {
      allowNull: true,
      type: DataTypes.STRING(256),
    },
    toAddresses: {
      allowNull: true,
      type: DataTypes.STRING(256),
    },
    recipientAddress: {
      allowNull: true,
      type: DataTypes.STRING(256),
    },
    receivedTime: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    sentTime: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    internetMessageId: {
      allowNull: true,
      type: DataTypes.STRING(256),
    },
    autoRemediated: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },
    postRemediated: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },
    attackType: {
      allowNull: true,
      type: DataTypes.STRING(70),
    },
    attackStrategy: {
      allowNull: true,
      type: DataTypes.STRING(50),
    },
    returnPath: {
      allowNull: true,
      type: DataTypes.STRING(256),
    },
    replyToEmails: {
      allowNull: true,
      type: DataTypes.STRING(1000),
    },
    impersonatedParty: {
      allowNull: true,
      type: DataTypes.STRING(50),
    },
    attackVector: {
      allowNull: true,
      type: DataTypes.STRING(20),
    },
    summaryInsights: {
      allowNull: true,
      type: DataTypes.STRING(1000),
    },
    remediationTimestamp: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    isRead: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },
    attackedParty: {
      allowNull: true,
      type: DataTypes.STRING(50),
    },
    recipientName: {
      allowNull: true,
      type: DataTypes.STRING(255),
    },
    recipientTitle: {
      allowNull: true,
      type: DataTypes.STRING(255),
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
