import TeamsModel from '../database/models/teams.model';
import Team from '../interfaces/team';

export default class TeamsService {
  private teamsModel: typeof TeamsModel;

  constructor(teamsModel: typeof TeamsModel) {
    this.teamsModel = teamsModel;
  }

  public async getAllTeams(): Promise<Team[]> {
    const allTeams = await this.teamsModel.findAll();
    return allTeams;
  }

  public async getTeamById(id: number): Promise<Team | null> {
    const teamById = await this.teamsModel.findByPk(id);
    if (teamById === null) {
      throw new Error('O time não existe\'');
    }
    return teamById;
  }
}
