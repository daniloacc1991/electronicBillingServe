import { Router } from 'express';
import { UserController } from './';
import { isAuthenticatedLocalClient, isAuthenticated, isPermit } from '../../services';

export class UserRoutes {

  private static path: string = '/user';

  public static create (router: Router) {
    router.post(`${this.path}/login`, isAuthenticatedLocalClient, UserController.login);
    router.put(`${this.path}/logoff`, isAuthenticated, isPermit(['USER', 'ADMIN']), UserController.logOff);
    router.get(`${this.path}/menu`, isAuthenticated, isPermit(['USER', 'ADMIN']), UserController.menu);
  }
}