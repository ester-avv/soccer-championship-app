import { Request, Response, NextFunction } from 'express';
import jwt = require('jsonwebtoken');
import { secret } from '../utils/auth';

const validToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ message: 'Token not found' });
    }
    jwt.verify(token, secret);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
};
export default validToken;
