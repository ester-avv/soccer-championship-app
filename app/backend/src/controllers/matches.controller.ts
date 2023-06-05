import { Request, Response } from 'express';
import MatchModel from '../database/models/matches.model';
import MatchesService from '../services/matches.service';

export default class MatchesController {
  private matchesService: MatchesService;

  constructor() {
    this.matchesService = new MatchesService(MatchModel);
  }

  public async getAllMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    const allMatches = await this.matchesService.getAllMatches();

    if (inProgress !== undefined) {
      const matchesInProg = allMatches?.filter((e) =>
        e.inProgress === (inProgress === 'true'));
      return res.status(200).json(matchesInProg);
    }

    res.status(200).json(allMatches);
  }
}
