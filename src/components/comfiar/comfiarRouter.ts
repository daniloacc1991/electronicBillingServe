import { Router } from 'express';
import { ComfiarController } from './';
import { isAuthenticated, isPermit } from '../../services';

export class Routes {

  private static path: string = '/comfiar';

  public static create (router: Router) {
    router.post(`${this.path}/login`, isAuthenticated, ComfiarController.login);
    router.post(`${this.path}/invoice`, isAuthenticated, ComfiarController.enviarFactura);
    router.post(`${this.path}/salidaTransaccion`, isAuthenticated, ComfiarController.salidaTransaccion);
    router.post(`${this.path}/respuestaComprobante`, isAuthenticated, ComfiarController.respuestaComprobante);
    router.post(`${this.path}/consultarpdf`, isAuthenticated, ComfiarController.consultarPDF);
  }
}