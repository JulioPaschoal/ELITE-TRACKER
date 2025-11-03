import axios from 'axios';
import { Request, Response } from 'express';

const clientId = 'Ov23liBC3WtQuPqkolrC';
const clientSecret = '142209e2aaf07a43066b3edcbb97fc658592fd3b';

//Redirecionando para o GitHub \\
export class AuthController {
  auth = async (req: Request, res: Response) => {
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}`;
    return res.redirect(redirectUrl);
  };

  // Autenticação com o GitHub \\
  authCallback = async (req: Request, res: Response) => {
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
    return res.status(200).json({ id, avatarUrl, username });
  };
}
