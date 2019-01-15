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
      scope: 'USER',
      user: user.usuario
    };
    console.log('Despues del IClaims');
    const token = sign(data, config.get('API_KEY'), { algorithm: 'HS512' });
    const _modelUsers = new UserModel();
    console.log('guardadno Token');
    _modelUsers.pg_SaveToken(token, user.id)
      .then(resp => {
        log.info(req.user);
        res.json(Commons.sendResponse('Success', { username: user.username, token }));
      })
      .catch(err => {
        log.error(err);
        res.status(400).json(Commons.sendResponse('Error!! Iniciando sesion..', null, err.stack));
      });
  }

  public static loginError (req: Request, res: Response) {
    console.log(req);
    res.status(400)
      .json(
        Commons.sendResponse('Error!! Cerrar sesion..', null, 'Usuario y contraseña incorrectos')
        );
  }

  public static logOff (req: Request, res: Response) {
    console.log(req.body);
    const _modelUsers = new UserModel();
    _modelUsers.pg_logOff(req.body.token)
      .then(rows => {
        log.info(rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error(err);
        res.status(400).json(Commons.sendResponse('Error!! Cerrar sesion..', null, err.stack));
      });
  }

}