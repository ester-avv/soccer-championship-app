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
});