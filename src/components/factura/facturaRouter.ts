import { Router } from 'express';
import { FacturaController } from './';
import { isAuthenticated, isPermit } from '../../services';

export class FacturaRoutes {

  private static path: string = '/invoice';

  public static create (router: Router) {
    // DashBoard
    router.post(`${this.path}/foryearxuser`, isAuthenticated, FacturaController.forYearxUser);
    router.get(`${this.path}/electronicforuser`, isAuthenticated, FacturaController.electronicForUser);

    // Facturación
    router.get(`${this.path}/pending`, isAuthenticated, FacturaController.invoicePending);
    router.get(`${this.path}/cufePending`, isAuthenticated, FacturaController.cufePending);
    router.get(`${this.path}/invoicesSent`, isAuthenticated, FacturaController.invoicesSent);
    router.get(`${this.path}/:numInvoce`, isAuthenticated,  FacturaController.invoice);
    router.put(`${this.path}/savetransaccion`, isAuthenticated,  FacturaController.saveTransaccion);
    router.delete(`${this.path}/deletetransaccion/:invoice`, isAuthenticated,  FacturaController.deleteTransaccion);
    router.put(`${this.path}/saveCufe`, isAuthenticated,  FacturaController.saveCufe);
    router.get(`${this.path}/invoicesSent`, isAuthenticated,  FacturaController.invoicesSent);

    // Factura
    router.get(`${this.path}/encabezado/:numInvoce`, isAuthenticated,  FacturaController.viewHeader);
    router.get(`${this.path}/detalle/:numInvoce`, isAuthenticated,  FacturaController.viewDetails);
    router.get(`${this.path}/pdf/:invoice`, isAuthenticated, FacturaController.viewPDF);
  }
}