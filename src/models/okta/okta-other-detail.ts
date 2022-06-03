import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface OktaOtherDetailModel extends Model {
  id?: number;
  processingDate?: Date;
  outsideUsaTotal?: number;
  suspiciousRecordTotal?: number;
  lockedRecordTotal?: number;
}

export interface OktaOtherDetailCreation extends Optional<OktaOtherDetailModel, 'id'> {}
export interface OktaOtherDetailInstance extends Model<OktaOtherDetailModel, OktaOtherDetailCreation> {}

export const OktaOtherDetail: ModelDefined<OktaOtherDetailModel, OktaOtherDetailCreation> = sequelize.define(
  'okta_other_detail',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    outsideUsaTotal: {
      type: DataTypes.INTEGER,
    },
    suspiciousRecordTotal: {
      type: DataTypes.INTEGER,
    },
    lockedRecordTotal: {
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
