import { Router } from 'express';
import { UserController } from './';
import { isAuthenticatedLocalClient, isAuthenticated, isPermit } from '../../services';

export class Routes {

  private static path: string = '/users';

  public static create (router: Router) {
    router.post(`${this.path}/login`, isAuthenticatedLocalClient, UserController.login);
  }
}