import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface FotiAnalyzerMaliciousDetailsModel extends Model {
  id?: number;
  processingDate?: Date;
  device?: string;
  user?: string;
  destination?: string;
}

export interface FotiAnalyzerMaliciousDetailsCreation extends Optional<FotiAnalyzerMaliciousDetailsModel, 'id'> {}
export interface FotiAnalyzerMaliciousDetailsInstance extends Model<FotiAnalyzerMaliciousDetailsModel, FotiAnalyzerMaliciousDetailsCreation> {}

export const FotiAnalyzerMaliciousDetails: ModelDefined<FotiAnalyzerMaliciousDetailsModel, FotiAnalyzerMaliciousDetailsCreation> = sequelize.define(
  'foti_analyzer_malicious_detail',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    device: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    user: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    destination: {
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
