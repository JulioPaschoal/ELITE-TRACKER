import { Request, Response } from 'express';

const clientId = 'Ov23liBC3WtQuPqkolrC';
const clientSecret = '142209e2aaf07a43066b3edcbb97fc658592fd3b';

export class AuthController {
  auth = async (req: Request, res: Response) => {
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${clientId}`;
    return res.redirect(redirectUri);
  };

  authCallback = async (req: Request, res: Response) => {
    console.log(req.query);
    return res.send();
  };
}
