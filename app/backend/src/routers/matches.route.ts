import * as express from 'express';
import MatchesController from '../controllers/matches.controller';
import validToken from '../middlewares/token.validation';
import validateTeams from '../middlewares/teams.validation';
/* import validateTeamsExist from '../middlewares/teams.validation'; */
/* import LoginModel from 'src/database/models/login.model'; */

const routerMatches = express.Router();
const matchesController = new MatchesController();

routerMatches.post(
  '/',
  validToken,
  validateTeams,
  matchesController.newMatch.bind(matchesController),
);
routerMatches.get('/', matchesController.getAllMatches.bind(matchesController));

routerMatches.patch(
  '/:id',
  validToken,
  matchesController.updateMatch.bind(matchesController),
);

routerMatches.patch(
  '/:id/finish',
  validToken,
  matchesController.endMatch.bind(matchesController),
);

export default routerMatches;
