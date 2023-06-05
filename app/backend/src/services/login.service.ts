import * as bcryptjs from 'bcryptjs';
/* import * as jwt from 'jsonwebtoken'; */
import UserModel from '../database/models/login.model';
import { generateToken } from '../utils/auth';

/* const secret = process.env.JWT_SECRET || 'mysecretkey';
const jwtConfig = {
  expiresIn: '7d',
}; */

class LoginService {
  private userModel: typeof UserModel;

  constructor(usersModel: typeof UserModel) {
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
        /*   const token = jwt.sign(
          { id: user.dataValues.id, role: user.dataValues.role },
          secret,
          jwtConfig,
        );
        return { token }; */

        return { token };
      }
    }

    return null;
  }
}

export default LoginService;
