import { Request, Response } from 'express';
import LeaderBHomeService from '../services/homeLeaderB.service';

class homeLeaderBCont {
  private _service: LeaderBHomeService;

  constructor() {
    this._service = new LeaderBHomeService();
  }

  static async allHomeLeaders(req: Request, res: Response) {
    const homeLeaders = await LeaderBHomeService.getHome();
    return res.status(200)
      .json(homeLeaders);
  }
}

export default homeLeaderBCont;
