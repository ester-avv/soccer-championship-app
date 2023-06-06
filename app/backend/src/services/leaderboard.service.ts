import { Sequelize } from 'sequelize';
import TeamsModel from '../database/models/teams.model';
import MatchesModel from '../database/models/matches.model';

export default class HomeLeaderBServ {
  private sequelize: Sequelize;
  private teamsModel: typeof TeamsModel;
  private matchesModel: typeof MatchesModel;

  constructor(
    sequelize: Sequelize,
    teamsModel: typeof TeamsModel,
    matchesModel: typeof MatchesModel,
  ) {
    this.matchesModel = matchesModel;
    this.teamsModel = teamsModel;
    this.sequelize = sequelize;
  }

  public async findAllGames(): Promise<{ totalGames: number, name: string }[]> {
    const games = await this.sequelize.query(
      `
      SELECT teams.team_name AS name,
      COUNT(*) AS totalGames
      FROM teams
      JOIN matches
      ON teams.id = matches.home_team_id AND matches.in_progress = false
      OR teams.id = matches.away_team_id AND matches.in_progress = false
      GROUP BY teams.id;
      `,
      { type: 'SELECT' },
    );
    return games as { totalGames: number, name: string }[];
  }

  public async allVictories(): Promise<{ totalVictories: number, name: string }[]> {
    const resolves = await this.sequelize.query(
      `SELECT teams.team_name AS name,
      SUM(CASE
      WHEN matches.away_team_id = teams.id
      AND matches.away_team_goals > matches.home_team_goals THEN 1

      WHEN matches.home_team_id = teams.id
      AND matches.home_team_goals > matches.away_team_goals THEN 1
      
      ELSE 0
      END) AS totalVictories
      FROM teams
      JOIN matches
      ON teams.id = matches.home_team_id AND matches.in_progress = false
      OR teams.id = matches.away_team_id AND matches.in_progress = false
      GROUP BY teams.id;
      `,
      { type: 'SELECT' },
    );
    return resolves as { totalVictories: number, name: string }[];
  }

  public async allDraws(): Promise<{ name: string, totalDraws: number }[]> {
    const resolve = await this.sequelize.query(
      `
      SELECT  teams.team_name AS name, SUM(CASE
      WHEN matches.home_team_goals = matches.away_team_goals THEN 1
      ELSE 0

      END) AS totalDraws
      FROM teams
      JOIN matches
      ON teams.id = matches.home_team_id AND matches.in_progress = false
      OR teams.id = matches.away_team_id AND matches.in_progress = false
      GROUP BY teams.id;
      `,
      { type: 'SELECT' },
    );

    return resolve as { name: string, totalDraws: number }[];
  }

  public async allLosses(): Promise<{ name: string, totalLosses: number }[]> {
    const resolve = await this.sequelize.query(
      `
      SELECT  teams.team_name AS name, SUM(CASE
      WHEN matches.home_team_id = teams.id
      AND matches.home_team_goals < matches.away_team_goals THEN 1
      WHEN matches.away_team_id = teams.id
      AND matches.away_team_goals < matches.home_team_goals THEN 1
      ELSE 0
      END) AS totalLosses
      FROM teams
      JOIN matches ON teams.id = matches.home_team_id AND matches.in_progress = false
      OR teams.id = matches.away_team_id AND matches.in_progress = false
      GROUP BY teams.id;
      `,
      { type: 'SELECT' },
    );
    return resolve as { name: string, totalLosses: number }[];
  }

  public async homeGoals(): Promise<{ name: string, goalsFavor: number }[]> {
    const total = await this.sequelize.query(
      `
      SELECT  teams.team_name AS name, SUM(CASE
      WHEN matches.home_team_id = teams.id THEN matches.home_team_goals
      ELSE matches.away_team_goals
      END) AS goalsFavor
      FROM teams
      JOIN matches ON teams.id = matches.home_team_id 
      AND matches.in_progress = false
      OR teams.id = matches.away_team_id 
      AND matches.in_progress = false
      GROUP BY teams.id;
      `,
      { type: 'SELECT' },
    );
    return total as { name: string, goalsFavor: number }[];
  }

  public async awayGoals(): Promise<{ name: string, goalsOwn: number }[]> {
    const total = await this.sequelize.query(
      `
      SELECT  teams.team_name AS name, SUM(CASE
        WHEN matches.home_team_id = teams.id THEN matches.away_team_goals

      ELSE matches.home_team_goals
      END) AS goalsOwn
      FROM teams
      JOIN matches ON teams.id = matches.home_team_id AND matches.in_progress = false
      OR teams.id = matches.away_team_id AND matches.in_progress = false
      GROUP BY teams.id;
      `,
      { type: 'SELECT' },
    );
    return total as { name: string, goalsOwn: number }[];
  }

  public async goalsBalance(): Promise<{ name: string, goalsBalance: number }[]> {
    const resolve = await this.sequelize.query(
      `
      SELECT  teams.team_name AS name, SUM(CASE
      WHEN matches.home_team_id = teams.id THEN matches.home_team_goals
      ELSE matches.away_team_goals
      END) - SUM(CASE
      WHEN matches.home_team_id = teams.id THEN matches.away_team_goals
      ELSE matches.home_team_goals
      END) AS goalsBalance
      FROM teams
      JOIN matches
      ON teams.id = matches.home_team_id AND matches.in_progress = false
      OR teams.id = matches.away_team_id AND matches.in_progress = false
      GROUP BY teams.id;
      `,
      { type: 'SELECT' },
    );
    return resolve as { name: string, goalsBalance: number }[];
  }

  public async calculatePoints(): Promise<{ name: string, totalPoints: number }[]> {
    const [victories, draws] = await Promise.all([
      this.allVictories(),
      this.allDraws(),
    ]);
    const allPoints = victories.map((v, i) => ({
      name: v.name,
      totalPoints: v.totalVictories * 3 + draws[i].totalDraws * 1,
    }));

    return allPoints as { name: string, totalPoints: number }[];
  }

  public async balanced(): Promise<{ name: string, efficiency: number }[]> {
    const [points, games] = await Promise.all([
      this.calculatePoints(),
      this.findAllGames(),
    ]);
    const theEffResult = points.map((row) => {
      const { name, totalPoints } = row;
      const teamGames = games.find((game) => game.name === name)?.totalGames || 0;
      const efficiency = (totalPoints / (teamGames * 3)) * 100;
      return { name, efficiency: Number(efficiency.toFixed(2)) };
    });
    return theEffResult;
  }
}
