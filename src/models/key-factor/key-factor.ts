import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface KeyFactorModel extends Model {
  id?: number;
  processingDate?: Date;
  keyFactorId?: number;
  thumbPrint?: string;
  serialNumber?: string;
  issuedDn?: string;
  issuedCn?: string;
  notBefore?: Date;
  notAfter?: Date;
  issuerDn?: string;
  principalId?: number;
  templateId?: number;
  certState?: number;
  keySizeInBits?: number;
  keyType?: number;
  requesterId?: string;
  issuedOu?: string;
  issuedEmail?: string;
  keyUsage?: number;
  signingAlgorithm?: string;
  certStateString?: string;
  keyTypeString?: string;
  revocationEffDate?: Date;
  revocationReason?: string;
  revocationComment?: string;
  certificateAuthorityId?: number;
  certificateAuthorityName?: string;
  templateName?: string;
  archivedKey?: boolean;
  hasPrivateKey?: boolean;
  principalName?: string;
  certRequestId?: number;
  requesterName?: string;
}

export interface KeyFactorCreation extends Optional<KeyFactorModel, 'id'> {}
export interface KeyFactorInstance extends Model<KeyFactorModel, KeyFactorCreation> {}

export const KeyFactor: ModelDefined<KeyFactorModel, KeyFactorCreation> = sequelize.define(
  'key_factor',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    keyFactorId: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    thumbPrint: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    serialNumber: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    issuedDn: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    issuedCn: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    notBefore: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    notAfter: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    issuerDn: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    principalId: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    templateId: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    certState: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    keySizeInBits: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    keyType: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    requesterId: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    issuedOu: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    issuedEmail: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    keyUsage: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    signingAlgorithm: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    certStateString: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    keyTypeString: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    revocationEffDate: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    revocationReason: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    revocationComment: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    certificateAuthorityId: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    certificateAuthorityName: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    templateName: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    archivedKey: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },
    hasPrivateKey: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },
    principalName: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    certRequestId: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    requesterName: {
      allowNull: true,
      type: DataTypes.STRING,
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
