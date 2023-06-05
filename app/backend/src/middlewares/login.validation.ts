import { NextFunction, Request, Response } from 'express';

const validLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const six = 6;

  if (!password || !email) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }
  if (!emailRegex.test(email) || password.length < six) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  next();
};

export default validLogin;
