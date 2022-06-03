import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface VaronisUserAndComputerKpiModel extends Model {
  id?: number;
  processingDate?: Date;
  noOfUsers?: number;
  noOfComputerAccounts?: number;
  noOfDisabledUsers?: string;
}

export interface VaronisUserAndComputerKpiCreation extends Optional<VaronisUserAndComputerKpiModel, 'id'> {}
export interface VaronisUserAndComputerKpiInstance extends Model<VaronisUserAndComputerKpiModel, VaronisUserAndComputerKpiCreation> {}

export const VaronisUserAndComputerKpi: ModelDefined<VaronisUserAndComputerKpiModel, VaronisUserAndComputerKpiCreation> = sequelize.define(
  'varonis_user_and_computer_kpi',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    noOfUsers: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    noOfComputerAccounts: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    noOfDisabledUsers: {
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
