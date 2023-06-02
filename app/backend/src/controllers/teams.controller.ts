import { Request, Response } from 'express';
import TeamsModel from '../database/models/teams.model';
import TeamsService from '../services/teams.service';

export default class TeamsController {
  private teamsService: TeamsService;

  constructor() {
    this.teamsService = new TeamsService(TeamsModel);
  }

  public async getAllTeams(_req: Request, res: Response): Promise<void> {
    try {
      const allTeams = await this.teamsService.getAllTeams();
      res.status(200).json(allTeams);
    } catch (error) {
      res.status(404).json({ error: 'Teams not found' });
    }
  }
}
