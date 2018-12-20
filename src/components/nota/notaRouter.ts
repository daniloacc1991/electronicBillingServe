import { Router } from 'express';
import { NotaController } from './';
import { isAuthenticated, isPermit } from '../../services';

export class NotaRoutes {
  private static path: string = '/note';

  public static create (router: Router) {
    router.get(`${this.path}/:invoice/:note`, isAuthenticated, NotaController.note);
    router.get(`${this.path}/header/:invoice/:note`, isAuthenticated, NotaController.noteHeader);
    router.get(`${this.path}/body/:invoice/:note`, isAuthenticated, NotaController.noteBody);
  }
}