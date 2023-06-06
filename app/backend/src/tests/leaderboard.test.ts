import * as chai from 'chai';
import { app } from '../app';
// @ts-ignore
import chaiHttp = require('chai-http');
import { homeLeaders, leaders } from './mocks/leaders.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes rota /leaderboard', () => {
  it('Verifica se a lista de classificação e retornada', async () => {
    const response = await chai.request(app).get('/leaderboard');
    expect(response.body).to.be.deep.equal(leaders)
    expect(response.status).to.be.equal(200);
  })
  it('Verifica a classificação geral dos times da casa', async () => {
    const response = await chai.request(app).get('/leaderboard/home');
    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal(homeLeaders)
  })
})