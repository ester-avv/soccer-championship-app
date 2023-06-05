import MatchModel from '../database/models/matches.model';

export interface MatchI extends MatchModel {
  homeTeam: {
    teamName: string;
  };
  awayTeam: {
    teamName: string;
  };
}

export interface GoalI {
  homeTeamGoals: number,
  awayTeamGoals: number,
}

export interface MatchesAtI {
  id: number;
  homeTeamId: number;
  homeTeamGoals: number;
  awayTeamId: number;
  awayTeamGoals: number;
  inProgress: boolean;
}
