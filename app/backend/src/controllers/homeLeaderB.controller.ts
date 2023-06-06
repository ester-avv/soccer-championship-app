import { Request, Response } from 'express';
import LeaderBHomeService from '../services/homeLeaderB.service';

// restaura dos home team

class homeLeaderBCont {
  private _homeLeadService: LeaderBHomeService;

  constructor() {
    this._homeLeadService = new LeaderBHomeService();
  }

  static async allHomeLeaders(req: Request, res: Response) {
    const homeLeaders = await LeaderBHomeService.allHomeLead();

    return res.status(200).json(homeLeaders);

    /* public async findData() {
      const [points, totalGames, totalVictories, totalDraws, totalLosses, goalsFavor,
        goalsOwn, goalsBalance, efficiency] = await Promise.all([
        this._homeLeadService.allVictories(), this._homeLeadService.allDraws(),
        this._homeLeadService.calculatePoints(), this._homeLeadService.findAllGames(),
        this._homeLeadService.allLosses(), this._homeLeadService.homeGoals(),
        this._homeLeadService.awayGoals(), this._homeLeadService.goalsBalance(),
        this._homeLeadService.balanced(),
      ]);
      return { points,
        totalGames,
        totalVictories,
        totalDraws,
        totalLosses,
        goalsFavor,
        goalsOwn,
        goalsBalance,
        efficiency,
      };
    } */
  }
}

export default homeLeaderBCont;
