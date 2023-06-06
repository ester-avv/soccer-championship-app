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
  }
}

export default homeLeaderBCont;
