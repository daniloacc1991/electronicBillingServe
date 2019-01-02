import { Router } from 'express';
import { FacturaController } from './';
import { isAuthenticated, isPermit } from '../../services';

export class FacturaRoutes {

  private static path: string = '/invoice';

  public static create (router: Router) {
    // DashBoard
    router.post(`${this.path}/foryearxuser`, isAuthenticated, isPermit(['USER', 'ADMIN']), FacturaController.forYearxUser);
    router.get(`${this.path}/electronicforuser`, isAuthenticated, isPermit(['USER', 'ADMIN']), FacturaController.electronicForUser);

    // Facturación
    router.get(`${this.path}/pending`, isAuthenticated, isPermit(['USER', 'ADMIN']), FacturaController.invoicePending);
    router.get(`${this.path}/cufePending`, isAuthenticated, isPermit(['USER', 'ADMIN']), FacturaController.cufePending);
    router.get(`${this.path}/invoicesSent`, isAuthenticated, isPermit(['USER', 'ADMIN']), FacturaController.invoicesSent);
    router.get(`${this.path}/:numInvoce`, isAuthenticated, isPermit(['USER', 'ADMIN']),  FacturaController.invoice);
    router.put(`${this.path}/savetransaccion`, isAuthenticated, isPermit(['USER', 'ADMIN']),  FacturaController.saveTransaccion);
    router.delete(`${this.path}/deletetransaccion/:invoice`, isAuthenticated, isPermit(['USER', 'ADMIN']),  FacturaController.deleteTransaccion);
    router.put(`${this.path}/saveCufe`, isAuthenticated, isPermit(['USER', 'ADMIN']),  FacturaController.saveCufe);
    router.get(`${this.path}/invoicesSent`, isAuthenticated, isPermit(['USER', 'ADMIN']),  FacturaController.invoicesSent);

    // Factura
    router.get(`${this.path}/encabezado/:numInvoce`, isAuthenticated, isPermit(['USER', 'ADMIN']),  FacturaController.viewHeader);
    router.get(`${this.path}/detalle/:numInvoce`, isAuthenticated, isPermit(['USER', 'ADMIN']),  FacturaController.viewDetails);
    router.get(`${this.path}/pdf/:invoice`, isAuthenticated, isPermit(['USER', 'ADMIN']), FacturaController.viewPDF);
  }
}