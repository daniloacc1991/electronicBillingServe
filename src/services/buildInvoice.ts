import { FacturaModel } from '../components/factura/facturaModel';
import { XmlAdmin } from '../interfaces/xml';

export class Invoice {

  async generarFactura (numInvoice: string) {
    try {
      const details = await this.details(numInvoice);
      const invoice = await this.encabezado(numInvoice, details);
      return invoice;
    } catch (err) {
      return err;
    }

  }

  async encabezado (invoice: string, details: any) {
    const _modelFactura = new FacturaModel();
    const _xmlAdmin = new XmlAdmin();

    return new Promise<any>((resolve, reject) => {
      _modelFactura.invoce(invoice)
        .then(rows => {
          const data = rows;
          data[0].details = details;
          const header = _xmlAdmin.headerXML(data);
          resolve(header);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  async details (invoice: string) {
    const _modelFactura = new FacturaModel();
    const _xmlAdmin = new XmlAdmin();

    return new Promise<any>((resolve, reject) => {
      _modelFactura
        .details(invoice)
        .then(rows => {
          const arrayDetails = [];
          for (let i = 0; i < rows.details.length; i++) {
            const detalle = _xmlAdmin.detailsXML(rows.details[i], rows.typeInvoce);
            arrayDetails.push(detalle);
          }
          resolve(arrayDetails);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}