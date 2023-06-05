import { Request, Response } from 'express';
import MatchModel from '../database/models/matches.model';
import MatchesService from '../services/matches.service';

const tokenNotFound = { message: 'Token not found' };

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

  public async endMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { authorization } = req.headers;
    if (authorization === undefined) {
      return res.status(401).json({ message: 'Token not found' });
    }
    const matchId = Number(id);
    await this.matchesService.endMatch(matchId);
    return res.status(200).json({ message: 'Finished' });
  }

  public async updateMatch(req: Request, res: Response) {
    const { awayTeamGoals, homeTeamGoals } = req.body;
    const { id } = req.params;
    const matcId = Number(id);
    const { authorization } = req.headers;

    if (authorization === undefined) {
      return res.status(401).json(tokenNotFound);
    }
    await this.matchesService.updateMatch(matcId, homeTeamGoals, awayTeamGoals);
    return res.status(200).json({ message: 'Game score updated!' });
  }

  public async newMatch(req: Request, res: Response) {
    try {
      const { homeTeamId, awayTeamId } = req.body;
      if (homeTeamId === awayTeamId) {
        return res
          .status(422)
          .json({ message: 'It is not possible to create a match with two equal teams' });
      }
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json(tokenNotFound);
      }

      const matches = await this.matchesService.newMatch(req.body);
      res.status(201).json(matches);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  }
}
