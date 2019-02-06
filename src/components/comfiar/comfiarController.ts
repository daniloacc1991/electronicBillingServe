import { Request, Response } from 'express';
import { Commons, log, DecodePDF } from '../../services/';

import { ComfiarModel } from './';


export class ComfiarController {

  public static login(req: Request, res: Response) {
    const _comfiar = new ComfiarModel();
    req.body.password = req.body.password.replace(new RegExp(' ', 'g'), '+');
    _comfiar.login(req.body.user, req.body.password)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! Iniciando sesion en comfiar..', null, err.stack));
      });
  }

  public static enviarFactura(req: Request, res: Response) {
    const _comfiar = new ComfiarModel();
    req.body.token = req.body.token.replace(new RegExp(' ', 'g'), '+');
    _comfiar.enviarFactura(req.body.token, req.body.date, req.body.invoice, req.body.puntoVenta, req.body.tipo_transaccion)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! enviando la factura a comfiar..', null, err.stack));
      });
  }

  public static salidaTransaccion(req: Request, res: Response) {
    const _comfiar = new ComfiarModel();
    req.body.token = req.body.token.replace(new RegExp(' ', 'g'), '+');
    _comfiar.salidaTransaccion(req.body.token, req.body.date, req.body.transaccion)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! al consultar la salida de la transacción en comfiar..', null, err.stack));
      });
  }

  public static respuestaComprobante(req: Request, res: Response) {
    const _comfiar = new ComfiarModel();
    req.body.token = req.body.token.replace(new RegExp(' ', 'g'), '+');
    _comfiar.respuestaComprobante(req.body.token, req.body.date, req.body.invoice, req.body.puntoVenta, req.body.tipo_transaccion)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! al consular la respuesta del comprobante en comfiar..', null, err.stack));
      });
  }

  public static consultarPDF(req: Request, res: Response) {
    const _comfiar = new ComfiarModel();
    req.body.token = req.body.token.replace(new RegExp(' ', 'g'), '+');
    _comfiar.consultarPDF(req.body.token, req.body.date, req.body.invoice, req.body.transaccion, req.body.puntoVenta, req.body.tipo_transaccion)
      .then(rows => {
        DecodePDF.converToPdf(rows, req.body.invoice, req.body.tipo_transaccion)
          .then(r => {
            log.info('%s %s %s', r);
            res.json(Commons.sendResponse('Success', { rows }));
          })
          .catch(err => {
            log.error('%s %s %s', err);
            res.status(400).json(Commons.sendResponse('Error!! al consular el pdf en comfiar..', null, err.stack));
          });
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! al consular el pdf en comfiar..', null, err.stack));
      });
  }
}