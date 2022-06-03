import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface PercentageChangeModel extends Model {
  id?: number;
  processingDate?: Date;
  keyName?: string;
  keyValue?: string;
}

export interface PercentageChangeCreation extends Optional<PercentageChangeModel, 'id'> {}
export interface PercentageChangeInstance extends Model<PercentageChangeModel, PercentageChangeCreation> {}

export const PercentageChange: ModelDefined<PercentageChangeModel, PercentageChangeCreation> = sequelize.define(
  'percentage_change',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    keyName: {
      type: DataTypes.STRING,
    },
    keyValue: {
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
