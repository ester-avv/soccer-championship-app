import { Request, Response } from 'express';
import sequelize from '../database/models';
import LeaderboardService from '../services/leaderboard.service';
import TeamsModel from '../database/models/teams.model';
import MatchesModel from '../database/models/matches.model';
/* import Team from '../interfaces/team'; */
/* import { ClassificationI, lI } from '../interfaces/classification'; */
import { lI } from '../interfaces/classification';

export default class LeaderboardController {
  private _leaderboardService: LeaderboardService;

  constructor() {
    this._leaderboardService = new LeaderboardService(sequelize, TeamsModel, MatchesModel);
  }
  /*  static async leaders(req: Request, res: Response) {
    const allLeaders = await LeaderBHomeService.allHomeLead();

    return res.status(200).json(allLeaders); */

  public async findData() {
    const [points, totalGames, totalVictories, totalDraws, totalLosses, goalsFavor,
      goalsOwn, goalsBalance, efficiency] = await Promise.all([
      this._leaderboardService.calculatePoints(), this._leaderboardService.findAllGames(),
      this._leaderboardService.allVictories(), this._leaderboardService.allDraws(),
      this._leaderboardService.allLosses(), this._leaderboardService.homeGoals(),
      this._leaderboardService.awayGoals(), this._leaderboardService.goalsBalance(),
      this._leaderboardService.balanced(),
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
  }

  public async getLeaderboard() {
    const { points, totalGames, totalVictories, totalDraws,
      totalLosses, goalsFavor, goalsOwn, goalsBalance, efficiency } = await this.findData();

    const orgLeaders = points.map((p: { name: string; totalPoints: number; }) => ({
      name: p.name,
      totalPoints: p.totalPoints,
      totalGames: totalGames.find((g: { name: string; }) => g.name === p.name)?.totalGames,
      totalVictories: Number(totalVictories
        .find((victory: { name: string; }) => victory.name === p.name)?.totalVictories),
      totalDraws: Number(totalDraws.find((d: { name: string; }) => d.name === p.name)?.totalDraws),
      totalLosses: Number(totalLosses.find((l: lI) => l.name === p.name)?.totalLosses),
      goalsFavor: Number(goalsFavor
        .find((gf: { name: string; }) => gf.name === p.name)?.goalsFavor),
      goalsOwn: Number(goalsOwn.find((go: { name: string; }) => go.name === p.name)?.goalsOwn),
      goalsBalance: Number(goalsBalance
        .find((gb: { name: string; }) => gb.name === p.name)?.goalsBalance),
      efficiency: Number(efficiency.find((e: { name: string; }) => e.name === p.name)?.efficiency),
    }));

    return orgLeaders;
  }

  public async leaderBoardInOrder(_req: Request, res: Response) {
    const leaderboard = await this.getLeaderboard();
    const ordered = leaderboard.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.totalVictories !== a.totalVictories) return b.totalVictories - a.totalVictories;
      if (b.goalsBalance !== a.goalsBalance) return b.goalsBalance - a.goalsBalance;
      return b.goalsFavor - a.goalsFavor;
    });
    return res.status(200).json(ordered);
  }
}
