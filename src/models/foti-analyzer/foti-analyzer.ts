import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface FotiAnalyzerModel extends Model {
  id?: number;
  processingDate?: Date;
  threatId?: number;
  threat?: string;
  category?: string;
  threatLevel?: string;
  threatScore?: number;
  incidents?: number;
}

export interface FotiAnalyzerCreation extends Optional<FotiAnalyzerModel, 'id'> {}
export interface FotiAnalyzerInstance extends Model<FotiAnalyzerModel, FotiAnalyzerCreation> {}

export const FotiAnalyzer: ModelDefined<FotiAnalyzerModel, FotiAnalyzerCreation> = sequelize.define(
  'foti_analyzer',
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
      type: DataTypes.INTEGER,
    },
    threat: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    category: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    threatLevel: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    threatScore: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    incidents: {
      allowNull: true,
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
