import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../@types/user.type';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authToken = req.headers.authorization;
  // VERIFICANDO SE O TOKEN FOI FORNECIDO \\
  if (!authToken) {
    return res.status(401).json({ message: 'Token not provided' });
  }
  // VERIFICANDO SE O TOKEN É VÁLIDO \\
  const [, token] = authToken.split(' ');
  try {
    jwt.verify(token, String(process.env.JWT_SECRET), (err, decoded) => {
      if (err) {
        throw new Error();
      }
      req.user = decoded as User;
    });
  } catch {
    return res.status(401).json({ message: 'Token invalid' });
  }
  next();
}
