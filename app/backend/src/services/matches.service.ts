/* import { GoalI, MatchesAtI } from '../interfaces/match'; */
import MatchModel from '../database/models/matches.model';
import TeamsModel from '../database/models/teams.model';

class MatchesService {
  private matchModel: typeof MatchModel;

  constructor(matchesModel: typeof MatchModel) {
    this.matchModel = matchesModel;
  }

  public async getAllMatches(): Promise<MatchModel[]> {
    const allMatches = await this.matchModel.findAll({
      include: [
        {
          model: TeamsModel,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          model: TeamsModel,
          as: 'awayTeam',
          attributes: ['teamName'],
        },
      ],
    });

    return allMatches;
  }

  public async getById(id: number) {
    const match = await this.matchModel.findOne({
      where: { id },
    });
    return match;
  }

  /*  public async endMatch(id: number) {
    const endedMatch = await this.matchModel.update({ inProgress: false }, { where: { id } });

    return endedMatch;
  } */
}

export default MatchesService;
