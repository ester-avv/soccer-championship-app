import { MatchesAtI } from '../interfaces/match';
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

  public async endMatch(id: number) {
    const endedMatch = await this.matchModel.update({ inProgress: false }, { where: { id } });

    return endedMatch;
  }

  public async updateMatch(
    id: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<[number]> {
    const updatedMatch = await this.matchModel.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );
    return updatedMatch;
  }

  public async newMatch(
    match: MatchesAtI,
  ): Promise<MatchModel | { status: number; message: string }> {
    const matches = await this.matchModel.create({
      ...match,
      inProgress: true,
    });
    return matches;
  }
}

export default MatchesService;
