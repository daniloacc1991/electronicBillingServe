import { Handler, Request, Response } from 'express';
import { log } from './';

export interface IWrapperResponse {
  success: boolean;
  error?: any;
  data?: any;
  message: string;
}

export class Commons {

  public static sendResponse (msj: string, data?: object, err = null) {
    let res: IWrapperResponse;
    if (err) {
      const development = process.env.NODE_ENV.trim() !== 'prodution';
      if (development) {
        res = { success: false, error: err, message: msj };
      } else {
        res = { success: false, message: msj };
      }
    } else {
      if (data) {
        res = { success: true, data, message: msj };
      } else {
        res = { success: true, message: msj };
      }
    }
    return res;
  }
}

export interface IDone {
  // tslint:disable-next-line:callable-types
  (err, data?): void;
}

const verifyRoles = (roles: string[], scope: string) => {
  let res = false;
  for (const role of roles) {
    if (role.toUpperCase() === scope.toUpperCase()) {
      res = true;
    }
  }
  return res;
};

export function isPermit (roles: string[]): Handler {
  return (req, res, next) => {
    log.info(req.authInfo);
    if (req.isAuthenticated() && verifyRoles(roles, req.authInfo.scope)) {
      next();
    } else {
      res.status(401).json(req.authInfo.message);
    }
  };
}
