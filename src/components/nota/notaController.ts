import { Request, Response } from 'express';
import * as config from 'config';
import { log, Commons } from '../../services';
import { NotaModel } from './';
import { RtaComprobanteModel } from '../../interfaces/rtaComprobante';

export class NotaController {

  public static note(req: Request, res: Response) {
    const _notaModel = new NotaModel();
    _notaModel.pg_note(req.params.note)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', rows));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! consultando nota..', null, err.stack));
      });
  }

  public static noteHeader(req: Request, res: Response) {
    const _notaModel = new NotaModel();
    _notaModel.pg_note_header(req.params.note)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', rows));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! consultando encabezado de la nota..', null, err.stack));
      });
  }

  public static noteBody(req: Request, res: Response) {
    const _notaModel = new NotaModel();
    _notaModel.pg_note_body(req.params.note)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', rows));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! consultando detalle de la nota..', null, err.stack));
      });
  }

  public static pending(req: Request, res: Response) {
    const _notaModel = new NotaModel();
    let userI: string, userF: string;
    req.user.scope === 'USER' ? userI = req.user.user : userI = '  ';
    req.user.scope === 'USER' ? userF = req.user.user : userF = 'ZZ';
    _notaModel.pg_pending(userI, userF)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! consultando notas pendientes por enviar..', null, err.stack));
      });
  }

  public static reSend(req: Request, res: Response) {
    const _notaModel = new NotaModel();
    let userI: string, userF: string;
    req.user.scope === 'USER' ? userI = req.user.user : userI = '  ';
    req.user.scope === 'USER' ? userF = req.user.user : userF = 'ZZ';
    _notaModel.pg_resend(userI, userF)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! consultando notas pendientes por reenviar por enviar..', null, err.stack));
      });
  }

  public static sent(req: Request, res: Response) {
    const _notaModel = new NotaModel();
    let userI: string, userF: string;
    req.user.scope === 'USER' ? userI = req.user.user : userI = '  ';
    req.user.scope === 'USER' ? userF = req.user.user : userF = 'ZZ';
    _notaModel.pg_sent(userI, userF, req.params.fechaI, req.params.fechaF)
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

  public static saveTransaccion(req: Request, res: Response) {
    const _notaModel = new NotaModel();
    console.log(req.body);
    _notaModel.saveTransaccion(req.body.note, req.body.transaccion)
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
    const _notaModel = new NotaModel();
    console.log(req.body);
    _notaModel.deleteTransaccion(req.params.note)
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
    const _notaModel = new NotaModel();
    const rtaDIAN: RtaComprobanteModel = JSON.parse(req.body.rtaComprobante);
    _notaModel.saveCufe(rtaDIAN)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', { rows }));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! guardando CUFE..', null, err.stack));
      });
  }

  public static viewPDF (req: Request, res: Response) {
    const _notaModel = new NotaModel();
    _notaModel.getPDF(req.params.note)
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