import * as bcryptjs from 'bcryptjs';
/* import * as jwt from 'jsonwebtoken'; */
import LoginModel from '../database/models/login.model';
import { generateToken } from '../utils/auth';

/* const secret = process.env.JWT_SECRET || 'secret';
const jwtConfig = {
  expiresIn: '12d',
}; */

class LoginService {
  private userModel: typeof LoginModel;

  constructor(usersModel: typeof LoginModel) {
    this.userModel = usersModel;
  }

  public async enterLogin(email: string, passw: string) {
    const user = await this.userModel.findOne({ where: { email } });

    if (user) {
      const { password } = user.dataValues;

      const checkPassw = await bcryptjs.compare(passw, password);

      if (checkPassw) {
        /* console.log('datavalues', user.dataValues); */
        const { id } = user.dataValues;
        const { role } = user.dataValues;
        const token = generateToken(id, role);
        return { token };
      }
    }

    return null;
  }
}

export default LoginService;
