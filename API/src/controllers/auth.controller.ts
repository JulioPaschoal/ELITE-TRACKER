import axios, { isAxiosError } from 'axios';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const {
  GITHUB_CLIENT_ID: clientId,
  GITHUB_CLIENT_SECRET: clientSecret,
  JWT_SECRET: jwtSecret,
  JWT_EXPIRES_IN: expiresIn,
} = process.env;

//Redirecionando para o GitHub \\
export class AuthController {
  auth = async (req: Request, res: Response) => {
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}`;
    return res.redirect(redirectUrl);
  };

  // Autenticação com o GitHub \\
  authCallback = async (req: Request, res: Response) => {
    try {
      const { code } = req.query;
      const accessTokenResult = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: clientId,
          client_secret: clientSecret,
          code,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );
      const userDataResult = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessTokenResult.data.access_token}`,
        },
      });
      const {
        node_id: id,
        avatar_url: avatarUrl,
        login: username,
      } = userDataResult.data;
      // CRIANDO O TOKEN \\
      const token = jwt.sign({ id }, jwtSecret, {
        expiresIn,
      });
      return res.status(200).json({ id, avatarUrl, username, token });
    } catch (err) {
      if (isAxiosError(err)) {
        return res.status(400).json(err.response?.data);
      }
      return res.status(500).json({ message: 'Something went wrong' });
    }
  };
}
