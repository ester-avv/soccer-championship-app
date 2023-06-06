import { ModelStatic } from 'sequelize';
import MatchesModel from '../database/models/matches.model';
import sequelize from '../database/models';

class homeLeaderService {
  private _model: ModelStatic<MatchesModel> = MatchesModel;

  /*   public async findAllGames(): Promise<{ totalGames: number, name: string }[]> {
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
 */

  // monitoria turma 28

  static async allHomeLead() {
    const [result] = await sequelize.query(
      `SELECT teams.team_name as name,
hm.drawns + (hm.victories * 3) as totalPoints,
hm.totalg as totalGames, hm.victories as totalVictories,
hm.drawns as totalDraws, hm.losses as totalLosses,
hm.golsHome as goalsFavor, hm.own as goalsOwn, hm.golsBalance as goalsBalance,
ROUND((hm.drawns + (hm.victories * 3)) / (hm.totalg * 3) * 100, 2) as efficiency
FROM teams LEFT JOIN( SELECT mt.home_team_id, SUM(mt.home_team_goals) as golsHome,
SUM(mt.home_team_goals > mt.away_team_goals) as victories,
SUM(mt.home_team_goals = mt.away_team_goals) as drawns,
SUM(mt.home_team_goals < mt.away_team_goals) as losses,
COUNT(mt.home_team_id) as totalg, SUM(mt.away_team_goals) as own,
SUM(mt.home_team_goals - mt.away_team_goals) as golsBalance
FROM matches as mt WHERE mt.in_progress = 0 GROUP BY mt.home_team_id
) as hm ON teams.id = hm.home_team_id GROUP BY teams.id ORDER BY 
totalPoints DESC, totalVictories DESC, goalsBalance DESC, goalsFavor DESC, goalsOwn DESC`,
    );
    return result;
  }
}

export default homeLeaderService;
