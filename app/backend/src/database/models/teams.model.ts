import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

class TeamsModel extends Model {
  public id!: number;
  public teamName!: string;
}

TeamsModel.init({
  id: {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: INTEGER,
  },
  teamName: {
    allowNull: false,
    type: STRING,
    field: 'team_name',
  },
}, {
  underscored: true,
  modelName: 'teams',
  sequelize: db,
  timestamps: false,
});

export default TeamsModel;
