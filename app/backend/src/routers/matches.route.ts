import * as express from 'express';
import MatchesController from '../controllers/matches.controller';
/* import validToken from '../middlewares/token.validation'; */
/* import LoginModel from 'src/database/models/login.model'; */

const routerMatches = express.Router();
const matchesController = new MatchesController();

routerMatches.get('/', matchesController.getAllMatches.bind(matchesController));

export default routerMatches;
