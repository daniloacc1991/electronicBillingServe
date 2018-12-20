import { Request, Response } from 'express';
import { log, Commons } from '../../services';
import { NotaModel } from './';

export class NotaController {

  public static note (req: Request, res: Response) {
    const _notaModel = new NotaModel();
    _notaModel.pg_note(req.params.invoice, req.params.note)
      .then(rows => {
        // log.info('%s %s %s', rows[0]);
        res.json(Commons.sendResponse('Success', rows[0] ));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! consultando nota..', null, err.stack));
      });
  }

  public static noteHeader (req: Request, res: Response) {
    const _notaModel = new NotaModel();
    _notaModel.pg_note_bussines(req.params.invoice, req.params.note)
      .then(rows => {
        log.info('%s %s %s', rows[0]);
        res.json(Commons.sendResponse('Success', rows[0] ));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! consultando encabezado de la nota..', null, err.stack));
      });
  }

  public static noteBody (req: Request, res: Response) {
    const _notaModel = new NotaModel();
    _notaModel.pg_note_body(req.params.invoice, req.params.note)
      .then(rows => {
        log.info('%s %s %s', rows);
        res.json(Commons.sendResponse('Success', rows ));
      })
      .catch(err => {
        log.error('%s %s %s', err);
        res.status(400).json(Commons.sendResponse('Error!! consultando detalle de la nota..', null, err.stack));
      });
  }
}