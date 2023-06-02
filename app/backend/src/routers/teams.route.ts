import * as express from 'express';
import TeamsController from '../controllers/teams.controller';

const routerTeams = express.Router();
const teamsController = new TeamsController();

routerTeams.get('/', teamsController.getAllTeams.bind(teamsController));

routerTeams.get('/:id', teamsController.getTeamById.bind(teamsController));

export default routerTeams;
