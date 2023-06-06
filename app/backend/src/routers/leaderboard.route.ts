import * as express from 'express';
import { Request, Response } from 'express';
import LeaderboardController from '../controllers/leaderboard.controller';
/* import leadHomeController from '../controllers/lbhome.controllers'; */
import HomeLeaderBController from '../controllers/homeLeaderB.controller';

const routerLeaderboard = express.Router();

const leaderboardController = new LeaderboardController();
/* const homeLeaderBController = new HomeLeaderBController(); */

routerLeaderboard.get('/', leaderboardController.leaderBoardInOrder.bind(leaderboardController));
/* routerLeaderboard.get(
  '/home',
  homeLeaderBController.leaderBoardInOrder.bind(leaderboardController),
); */

routerLeaderboard.get(
  '/home',
  (req: Request, res:Response) => HomeLeaderBController.allHomeLeaders(req, res),
);

export default routerLeaderboard;
