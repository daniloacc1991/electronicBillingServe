import * as config from 'config';
import * as moment from 'moment';

import ms = require('ms');

import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

import { IClaims } from '../../interfaces/jtw';
import { Commons, log } from '../../services';
import { UserModel } from './';

export class UserController {

  constructor () {
    // dotenv.config();
  }

  public static login (req: Request, res: Response) {
    const user = req.user;
    log.info(user);
    const data: IClaims = {
      exp: moment().valueOf() + ms('2 days'),
      iss: `http://localhost:${config.get('port')}`,
      sub: user.usuario,
      jti: user.id,
      scope: 'USER'
    };
    const token = sign(data, config.get('API_KEY'), { algorithm: 'HS512' });
    log.info(token);
    const _modelUsers = new UserModel();
    _modelUsers.pg_SaveToken(token, user.id)
      .then(resp => {
        log.info(req.user);
        log.info(token);
        res.json(Commons.sendResponse('Success', { username: user.username, token }));
      })
      .catch(err => {
        log.error(err);
        res.status(400).json(Commons.sendResponse('Error!! Iniciando sesion..', null, err.stack));
      });
  }

}