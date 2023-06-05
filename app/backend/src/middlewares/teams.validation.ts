import { Request, Response, NextFunction } from 'express';
import TeamsModel from '../database/models/teams.model';

export default async function validateTeams(req: Request, res: Response, next: NextFunction) {
  const { homeTeamId, awayTeamId } = req.body;

  if (homeTeamId === awayTeamId) {
    return res
      .status(422)
      .json({ message: 'It is not possible to create a match with two equal teams' });
  }

  const checkHomeTeam = await TeamsModel.findOne({ where: { id: homeTeamId } });
  const checkAwayTeam = await TeamsModel.findOne({ where: { id: awayTeamId } });

  if (!checkHomeTeam || !checkAwayTeam) {
    return res.status(404).json({ message: 'There is no team with such id!' });
  }
  return next();
}
