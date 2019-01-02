import { Router } from 'express';
import { ComfiarController } from './';
import { isAuthenticated, isPermit } from '../../services';

export class ComfiarRoutes {

  private static path: string = '/comfiar';

  public static create (router: Router) {
    router.post(`${this.path}/login`, isAuthenticated, isPermit(['USER', 'ADMIN']), ComfiarController.login);
    router.post(`${this.path}/invoice`, isAuthenticated, isPermit(['USER', 'ADMIN']), ComfiarController.enviarFactura);
    router.post(`${this.path}/salidaTransaccion`, isAuthenticated, isPermit(['USER', 'ADMIN']), ComfiarController.salidaTransaccion);
    router.post(`${this.path}/respuestaComprobante`, isAuthenticated, isPermit(['USER', 'ADMIN']), ComfiarController.respuestaComprobante);
    router.post(`${this.path}/consultarpdf`, isAuthenticated, isPermit(['USER', 'ADMIN']), ComfiarController.consultarPDF);
  }
}