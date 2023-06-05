import { Response, Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../utils/auth';
import LoginService from '../services/login.service';
import LoginModel from '../database/models/login.model';

const invalidMessage = { message: 'Invalid email or password' };

class LoginController {
  private loginService: LoginService;
  constructor() {
    this.loginService = new LoginService(LoginModel);
  }

  public async enterLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'All fields must be filled' });
      }
      const tryLogin = await this.loginService.enterLogin(email, password);
      if (!tryLogin) {
        return res.status(401).json(invalidMessage);
      }
      return res.status(200).json(tryLogin);
    } catch (err) {
      res.status(401).json(invalidMessage);
    }
  }

  public static async getLogin(req: Request, res: Response) {
    try {
      const { authorization } = req.headers;
      const verificationToken = verifyToken(authorization || '') as JwtPayload;
      res.status(200).json({ role: verificationToken.role });
    } catch (error) {
      res.status(401).json(invalidMessage);
    }
  }
}

export default LoginController;
