import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface OktaAuthDetailModel extends Model {
  id?: number;
  processingDate?: Date;
  authActivityTotal?: number;
}

export interface OktaAuthDetailCreation extends Optional<OktaAuthDetailModel, 'id'> {}
export interface OktaAuthDetailInstance extends Model<OktaAuthDetailModel, OktaAuthDetailCreation> {}

export const OktaAuthDetail: ModelDefined<OktaAuthDetailModel, OktaAuthDetailCreation> = sequelize.define(
  'okta_auth_detail',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    authActivityTotal: {
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
