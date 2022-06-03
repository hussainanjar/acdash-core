import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface ApplicationStorageModel extends Model {
  id?: number;
  keyName?: string;
  value?: string;
  isActive: string;
}

export interface ApplicationStorageCreation extends Optional<ApplicationStorageModel, 'id' | 'keyName' | 'value' | 'isActive'> {}
export interface ApplicationStorageInstance extends Model<ApplicationStorageModel, ApplicationStorageCreation> {}

export const ApplicationStorage: ModelDefined<ApplicationStorageModel, ApplicationStorageCreation> = sequelize.define(
  'application_storage',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    keyName: {
      type: DataTypes.STRING,
    },
    value: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
