import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

export default class UserModel extends Model {
  public id?: number;
  public username!: string;
  public role!: string;
  public email!: string;
  declare password: string;
}

UserModel.init(
  {
    id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: INTEGER,
    },
    username: {
      allowNull: false,
      type: STRING(100),
      field: 'username',
    },
    role: {
      allowNull: false,
      type: STRING(100),
      field: 'role',
    },
    email: {
      allowNull: false,
      type: STRING(100),
      field: 'email',
    },
    password: {
      allowNull: false,
      type: STRING(100),
      field: 'password',
    },
  },
  {
    timestamps: false,
    underscored: true,
    sequelize: db,
    modelName: 'users',
  },
);
