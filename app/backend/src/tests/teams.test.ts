import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http'); 
/* import chaiHttp from 'chai-http'; */

import { app } from '../app';

// import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

import TeamsModel from '../database/models/teams.model';

import { teamsMock, palmeiras } from './mocks/teams.mock';
import TeamsService from '../services/teams.service';

describe('Testes da rota /teams', () => {
    it('Verifica o endpoint get para pegar todos os times', async () => {
  
     sinon.stub(TeamsModel, 'findAll')
       .resolves(teamsMock as TeamsModel[]);
  
      const response = await chai.request(app).get('/teams');
  
      expect(response.body).to.deep.equal(teamsMock)
      expect(response).to.have.status(200);
    });
  
    it('Verifica se é possível buscar por id', async () => {
  
      sinon.stub(TeamsModel, 'findByPk')
       .resolves(palmeiras as TeamsModel);
  
      const response = await chai.request(app).get('/teams/12');
  
      expect(response).to.have.status(200);
      expect(response.body).to.be.deep.equal(palmeiras)
    });
  });
