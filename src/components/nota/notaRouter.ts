import { Router } from 'express';
import { NotaController } from './';
import { isAuthenticated, isPermit } from '../../services';

export class NotaRoutes {
  private static path: string = '/note';

  public static create (router: Router) {
    router.get(`${this.path}/complete/:note`, isAuthenticated, isPermit(['ADMIN']), NotaController.note);
    router.get(`${this.path}/header/:note`, isAuthenticated, isPermit(['ADMIN']), NotaController.noteHeader);
    router.get(`${this.path}/body/:note`, isAuthenticated, isPermit(['ADMIN']), NotaController.noteBody);

    router.get(`${this.path}/pending`, isAuthenticated, isPermit(['ADMIN']), NotaController.pending);
    router.get(`${this.path}/resend`, isAuthenticated, isPermit(['ADMIN']), NotaController.reSend);
    router.get(`${this.path}/sent/:fechaI/:fechaF`, isAuthenticated, isPermit(['ADMIN']), NotaController.sent);

    router.put(`${this.path}/savetransaccion`, isAuthenticated, isPermit(['ADMIN']),  NotaController.saveTransaccion);
    router.delete(`${this.path}/deletetransaccion/:note`, isAuthenticated, isPermit(['ADMIN']),  NotaController.deleteTransaccion);
    router.put(`${this.path}/saveCufe`, isAuthenticated, isPermit(['ADMIN']),  NotaController.saveCufe);
    router.get(`${this.path}/pdf/:note`, isAuthenticated, isPermit(['ADMIN']), NotaController.viewPDF);
  }
}