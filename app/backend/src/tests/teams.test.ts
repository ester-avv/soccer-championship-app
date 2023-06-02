import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
/* import chaiHttp = require('chai-http'); */
import chaiHttp from 'chai-http';

import { app } from '../app';

// import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

import Teams from '../database/models/teams.model';
import TeamsService from '../services/teams.service';
import TeamsController from '../controllers/teams.controller';
import { teamsMock, palmeiras } from './mocks/teams.mock';
/* import Team from '../interfaces/team'; */

describe('Testes da rota /teams', () => {
    it('01- Verifica o endpoint get', async () => {
  
     sinon.stub(Teams, 'findAll')
       .resolves(teamsMock as Teams[]);
  
      const response = await chai.request(app).get('/teams');
  
      expect(response.body).to.be.equal(teamsMock)
      expect(response.status).to.be.equal(200);
    });
  
    it('02- Verifica se é possível buscar por id', async () => {
  
      sinon.stub(Teams, 'findByPk')
       .resolves(palmeiras as Teams);
  
      const response = await chai.request(app).get('/teams/12');
  
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.equal(palmeiras)
    });
  });
