import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface VaronisFileServerTotalKpiModel extends Model {
  id?: number;
  processingDate?: Date;
  fileServer?: string;
  noOfFolders?: number;
  noOfFiles?: number;
  noOfPermissionEntries?: number;
  sizeOfAllFilesAndFoldersGb?: number;
}

export interface VaronisFileServerTotalKpiCreation extends Optional<VaronisFileServerTotalKpiModel, 'id'> {}
export interface VaronisFileServerTotalKpiInstance extends Model<VaronisFileServerTotalKpiModel, VaronisFileServerTotalKpiCreation> {}

export const VaronisFileServerTotalKpi: ModelDefined<VaronisFileServerTotalKpiModel, VaronisFileServerTotalKpiCreation> = sequelize.define(
  'varonis_file_server_total_kpi',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    fileServer: {
      allowNull: true,
      type: DataTypes.STRING(255),
    },
    noOfFolders: {
      allowNull: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    noOfFiles: {
      allowNull: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    noOfPermissionEntries: {
      allowNull: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    sizeOfAllFilesAndFoldersGb: {
      allowNull: true,
      type: DataTypes.FLOAT,
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
