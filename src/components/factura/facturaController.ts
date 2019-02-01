import * as config from 'config';
import { Request, Response } from 'express';
import { Commons, log } from '../../services';
import { FacturaModel } from './';
import { RtaComprobanteModel } from '../../interfaces/rtaComprobante';

export class FacturaController {

  public static invoicePending(req: Request, res: Response) {
    const _modelFactura = new FacturaModel();
    let userI: string, userF: string;
    req.user.scope === 'USER' ? userI = req.user.user : userI = '  ';
    req.user.scope === 'USER' ? userF = req.user.user : userF = 'ZZ';
    _modelFactura.invoicePending(userI, userF)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! consultando facturas pendientes por enviar..', null, err.stack));
      });
  }

  public static cufePending(req: Request, res: Response) {
    const _modelFactura = new FacturaModel();
    let userI: string, userF: string;
    req.user.scope === 'USER' ? userI = req.user.user : userI = '  ';
    req.user.scope === 'USER' ? userF = req.user.user : userF = 'ZZ';
    _modelFactura.cufePending(userI, userF)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! consultando facturas pendientes por cufe..', null, err.stack));
      });
  }

  public static invoicesSent(req: Request, res: Response) {
    const _modelFactura = new FacturaModel();
    let userI: string, userF: string;
    req.user.scope === 'USER' ? userI = req.user.user : userI = '  ';
    req.user.scope === 'USER' ? userF = req.user.user : userF = 'ZZ';
    _modelFactura.invoicesSent(userI, userF, req.params.fechaI, req.params.fechaF)
      .then(rows => {
        rows = rows.map(f => {
          f.path_pdf = `http://${config.get('host')}:${config.get('port')}${f.path_pdf}`;
          return f;
        });
        // log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! consultando facturas enviadas..', null, err.stack));
      });
  }

  public static forYearxUser(req: Request, res: Response) {
    const _modelFactura = new FacturaModel();
    _modelFactura.forYearUser(req.body.date, req.user.user)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! consultando facturas por año y usuario..', null, err.stack));
      });

  }

  public static electronicForUser(req: Request, res: Response) {
    const _modelFactura = new FacturaModel();
    _modelFactura.electronicforUser(req.user.user)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! consultando facturas electronicas por usuario..', null, err.stack));
      });
  }

  public static invoice(req: Request, res: Response) {
    const _modelFactura = new FacturaModel();
    _modelFactura.pg_invoice(req.params.invoice)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! consultando estructura JSON de la factura..', null, err.stack));
      });
  }

  public static invoiceHeader(req: Request, res: Response) {
    const _modelFactura = new FacturaModel();
    _modelFactura.pg_invoice_header(req.params.invoice)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', rows));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! consultando encabezado de la factura..', null, err.stack));
      });
  }

  public static invoiceBody(req: Request, res: Response) {
    const _modelFactura = new FacturaModel();
    _modelFactura.pg_invoice_body(req.params.invoice)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', rows));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! consultando detalle de la nota..', null, err.stack));
      });
  }

  public static saveTransaccion(req: Request, res: Response) {
    const _modelFactura = new FacturaModel();
    _modelFactura.saveTransaccion(req.body.invoice, req.body.transaccion)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! guardando el id de transacción..', null, err.stack));
      });
  }

  public static deleteTransaccion(req: Request, res: Response) {
    const _modelFactura = new FacturaModel();
    _modelFactura.deleteTransaccion(req.params.invoice)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! borrando el id de la transacción..', null, err.stack));
      });
  }

  public static saveCufe(req: Request, res: Response) {
    const _modelFactura = new FacturaModel();
    const rtaDIAN: RtaComprobanteModel = JSON.parse(req.body.rtaComprobante);
    _modelFactura.saveCufe(rtaDIAN)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! guardando CUFE..', null, err.stack));
      });
  }

  public static viewPDF(req: Request, res: Response) {
    const _modelFactura = new FacturaModel();
    _modelFactura.getPDF(req.params.invoice)
      .then(row => {
        const rows = {
          path: `http://${config.get('host')}:${config.get('port')}${row.path_pdf}`
        };
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! consultando estructura JSON de la factura..', null, err.stack));
      });
  }
}