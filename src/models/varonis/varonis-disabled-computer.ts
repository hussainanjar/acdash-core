import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface VaronisDisabledComputerKpiModel extends Model {
  id?: number;
  processingDate?: Date;
  disabledAccounts?: string;
  name?: string;
}

export interface VaronisDisabledComputerKpiCreation extends Optional<VaronisDisabledComputerKpiModel, 'id'> {}
export interface VaronisDisabledComputerKpiInstance extends Model<VaronisDisabledComputerKpiModel, VaronisDisabledComputerKpiCreation> {}

export const VaronisDisabledComputerKpi: ModelDefined<VaronisDisabledComputerKpiModel, VaronisDisabledComputerKpiCreation> = sequelize.define(
  'varonis_disabled_computer_kpi',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    disabledAccounts: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    name: {
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
