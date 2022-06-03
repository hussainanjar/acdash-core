import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface VaronisUserExpiredPasswordKpiModel extends Model {
  id?: number;
  processingDate?: Date;
  type?: string;
  domainName?: string;
  ouName?: string;
  userGroup?: string;
  logonName?: string;
  pwdLastSet?: Date;
}

export interface VaronisUserExpiredPasswordKpiCreation extends Optional<VaronisUserExpiredPasswordKpiModel, 'id'> {}
export interface VaronisUserExpiredPasswordKpiInstance extends Model<VaronisUserExpiredPasswordKpiModel, VaronisUserExpiredPasswordKpiCreation> {}

export const VaronisUserExpiredPasswordKpi: ModelDefined<VaronisUserExpiredPasswordKpiModel, VaronisUserExpiredPasswordKpiCreation> = sequelize.define(
  'varonis_user_expired_password_kpi',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    type: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    domainName: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    ouName: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    userGroup: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    logonName: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    pwdLastSet: {
      allowNull: true,
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
