import { Router } from 'express';
import { FacturaController } from './';
import { isAuthenticated, isPermit } from '../../services';

export class Routes {

  private static path: string = '/invoice';

  public static create (router: Router) {
    // DashBoard
    router.post(`${this.path}/foryearxuser`, isAuthenticated, FacturaController.forYearxUser);
    router.get(`${this.path}/electronicforuser`, isAuthenticated, FacturaController.electronicForUser);

    // Facturación
    router.get(`${this.path}/pending`, isAuthenticated, FacturaController.invoicePending);
    router.get(`${this.path}/cufePending`, isAuthenticated, FacturaController.cufePending);
    router.get(`${this.path}/invoicesSent`, isAuthenticated, FacturaController.invoicesSent);
    router.get(`/invoice/:numInvoce`, isAuthenticated,  FacturaController.invoice);
    router.put(`/invoice/savetransaccion`, isAuthenticated,  FacturaController.saveTransaccion);
    router.delete(`/invoice/deletetransaccion/:invoice`, isAuthenticated,  FacturaController.deleteTransaccion);
    router.put(`/invoice/saveCufe`, isAuthenticated,  FacturaController.saveCufe);
    router.get(`/invoice/invoicesSent`, isAuthenticated,  FacturaController.invoicesSent);

    // Factura
    router.get(`/invoice/encabezado/:numInvoce`, isAuthenticated,  FacturaController.viewHeader);
    router.get(`/invoice/detalle/:numInvoce`, isAuthenticated,  FacturaController.viewDetails);
  }
}