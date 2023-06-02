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
}
