import * as sinon from 'sinon';
import * as chai from 'chai';
import { app } from '../app';
// @ts-ignore
import chaiHttp = require('chai-http');
import LoginService from '../services/login.service';
import { validLoginMock, invalidMock } from './mocks/login.mock';

chai.use(chaiHttp);

const { expect } = chai;

const allFielMustBeFilled = {
	message: 'All fields must be filled'
};
const invalidEmailPassw = {
	message: 'Invalid email or password'
};
const myRole = {
	role: 'user'
};
const invalidToken = {
	message: 'Token must be a valid token'
};

describe('Testes da rota /login', () => {
  afterEach(() => {
    sinon.restore();
  })
 
    it('Verifica se todos os campos estão preenchidos para caso positivo', async () => {
      const response = await chai.request(app).post('/login').send({ email: 'email@email.com'});
      expect(response.body).to.deep.equal(allFielMustBeFilled);
      expect(response).to.have.status(400);
    })
    it('Verifica se todos os campos estão preenchidos para caso negativo', async () => {
      const response = await chai.request(app).post('/login').send({ password: '123456'});
      expect(response.body).to.deep.equal(allFielMustBeFilled);
      expect(response).to.have.status(400);
    })
    it('Verifica se retorna erro caso o email esteja errado', async () => {
        const response = await chai.request(app).post('/login').send({ email: 'email_invalid', password: '123456'});
        expect(response.body).to.deep.equal(invalidEmailPassw);
        expect(response).to.have.status(401);
      })
    it('Verifica se retorna erro caso a senha esteja errada', async () => {
      const response = await chai.request(app).post('/login').send({ email: 'email@email.com', password: '1234'});
      expect(response.body).to.deep.equal(invalidEmailPassw);
      expect(response).to.have.status(401);
    })
    
    it('Verifica se retorna um token válido os dados estejam certos', async () => {
        const response = await chai.request(app).post('/login').send(validLoginMock);
        const token = response.body.token;
      expect(token).to.be.a('string');
      expect(response.body).to.have.property('token');
      expect(response).to.have.status(200);
      
     /*  expect(token.split('.').length).to.equal(3); */
    })

  /*   it('Verifica se retorna mensagem de erro se o token não for encontrado', async () => {
      const response = await chai.request(app).get('/login/role').set('Authorization', 'Bearer ' + invalidMock);
      expect(response.body).to.deep.equal(invalidToken);
      expect(response).to.have.status(401);
    })
    it('Verifica se retorna o "role" do usuário', async () => {
      const login = await chai.request(app).post('/login').send(validLoginMock);
      sinon.stub(LoginService.prototype, 'enterLogin').resolves(login.body);
      const getToken = login.body.token;
      const response = await chai.request(app).get('/login/role').set('Authorization', getToken);
      expect(response.body).to.deep.equal(myRole);
      expect(response).to.have.status(200);
    }) */

})