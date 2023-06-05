import express = require('express');
import LoginController from '../controllers/login.controller';
import validLogin from '../middlewares/login.validation';
import validToken from '../middlewares/token.validation';

const routerLogin = express.Router();
const loginController = new LoginController();

/* routerLogin.post('/', validLogin, (req, res) => loginController.enterLogin(req, res)); */
routerLogin.post('/', validLogin, loginController.enterLogin.bind(loginController));

routerLogin.get('/role', validToken, (req, res) => LoginController.getLogin(req, res));

export default routerLogin;
