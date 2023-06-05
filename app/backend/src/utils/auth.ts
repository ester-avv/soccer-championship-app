import jwt = require('jsonwebtoken');

const jwtSecret = String(process.env.JWT_SECRET);

export const secret = jwtSecret || 'secret';

const JWT_CONFIG: jwt.SignOptions = {
  algorithm: 'HS256',
  expiresIn: '10d',
};

export const generateToken = (id: string, role: string) =>
  jwt.sign({ id, role }, secret, JWT_CONFIG);

export const getUserToken = (token: string) => jwt.decode(token);

export const verifyToken = (token: string) => jwt.verify(token, secret);
