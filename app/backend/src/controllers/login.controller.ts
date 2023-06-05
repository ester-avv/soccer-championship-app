import { Response, Request } from 'express';
import LoginService from '../services/login.service';
import LoginModel from '../database/models/login.model';

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
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      return res.status(200).json(tryLogin);
    } catch (err) {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  }
}

export default LoginController;
