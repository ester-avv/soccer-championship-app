import * as chai from 'chai';
/* import { Response } from 'superagent'; */
// @ts-ignore
import { endedMatches, matchesInProg, myMatches } from './mocks/matches.mock'
import { app } from '../app';
import * as sinon from 'sinon'; 
// @ts-ignore
import Http = require('chai-http');
import MatchModel from '../database/models/matches.model';
import { MatchI } from '../interfaces/match'
import MatchesService from '../services/matches.service';
chai.use(Http);

const { expect } = chai;

const newMatch = {
  id: 49,
  homeTeamId: 12,
  awayTeamId: 9,
  homeTeamGoals: 3,
  awayTeamGoals: 1,
  inProgress: true,
};

describe('Testes rota /matches', () => {

    it('Verifica se é retornada todas as partidas do banco', async () => {
      const response = await chai.request(app).get('/matches')
  
      const { status, body } = response;
  
      expect(body).to.be.deep.equal(myMatches);   
      expect(status).to.be.equal(200);
    });
    it('Verifica quais partidas não estão acontecendo" ', async () => {

        const response = await chai.request(app).get('/matches?inProgress=false')
  
      const { status, body } = response;
  
      expect(body).to.deep.equal(endedMatches);     
      expect(status).to.be.equal(200);
    });
    it('Verifica se encontra todas as partidas em progresso', async () => {
        const response = await chai.request(app).get('/matches?inProgress=true');
        expect(response.body).to.deep.equal(matchesInProg);
        expect(response).to.have.status(200);
      })
    it('Verifica se dá para salvar partida sem token', async () => {

        const response = await chai
      .request(app)
      .post('/matches')
      .send({
        homeTeamId: 16,
        awayTeamId: 3,
        homeTeamGoals: 2,
        awayTeamGoals: 2
      })
      const { status, body } = response;
      
      expect(body.message).to.be.deep.equal( 'Token not found');
      expect(status).to.be.equal(401);   
    });
    it('Verifica se não é possível inserir uma partida sem token', async () => {
      const response = await chai.request(app).post('/matches').send({
        homeTeamId: 1,
        awayTeamId: 1,
        homeTeamGoals: 2,
        awayTeamGoals: 2
      })
    
      expect(response.body).to.deep.equal({ message: 'Token not found'});
      expect(response).to.have.status(401);
      })
    it('Verifica se é possivel colocar uma partida em progresso sem token valido', async () => {

        const response = await chai
      .request(app)
      .post('/matches')
      .set({ authorization: 'aaaaaaa' })
      .send({
        homeTeamId: 16,
        awayTeamId: 2,
      })
      const { status, body } = response;    
      expect(body.message).to.be.deep.equal('Token must be a valid token');     
      expect(status).to.be.equal(401);
    });
    it('Verifica se é possível fazer uma partida com dois times iguais ', async () => {
      const response1 = await chai
      .request(app)
      .post('/login')
      .send({ email: 'admin@admin.com', password: 'secret_admin' });

      const { token } = response1.body;

      const response2 = await chai
      .request(app)
      .post('/matches')
      .set({ authorization: token })
      .send({
        homeTeamId: 16,
        awayTeamId: 16,
      })
      const { status, body } = response2;
  
      expect(status).to.be.equal(422);
      expect(body).to.deep.equal({ message: 'It is not possible to create a match with two equal teams' });     
    });
    it('Verifica se é possível criar partida', async () => {
      const matchStub = sinon.stub(MatchModel, 'create').resolves(newMatch as MatchModel);

      const login = await chai.request(app).post('/login').send({
        email: "user@user.com",
	      password: "secret_user"
      });

      const mytoken = login.body.token;
      const response = await chai.request(app).post('/matches').send({
      homeTeamId: 12,
      awayTeamId: 9,
      homeTeamGoals: 3,
      awayTeamGoals: 1
      }).set('Authorization', mytoken);
      expect(response.body).to.be.deep.equal(newMatch);
      expect(response).to.have.status(201);
      matchStub.restore();
    });
});