import { Optional, Model, ModelDefined, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db';

export interface AbnormalCasesModel extends Model {
  id?: number;
  processingDate?: Date;
  caseId?: string;
  description?: string;
}

export interface AbnormalCasesCreation extends Optional<AbnormalCasesModel, 'id'> {}
export interface AbnormalCasesInstance extends Model<AbnormalCasesModel, AbnormalCasesCreation> {}

export const AbnormalCases: ModelDefined<AbnormalCasesModel, AbnormalCasesCreation> = sequelize.define(
  'abnormal_cases',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    caseId: {
      type: DataTypes.INTEGER,
    },
    description: {
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
