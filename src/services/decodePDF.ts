import * as path from 'path';
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from 'fs';

import { log } from './';
import { FacturaModel } from '../components/factura';
import { NotaModel } from '../components/nota/';

export class DecodePDF {
  public static async converToPdf(pdfBase64: any, comprobante: string, tipoComprobante: number) {
    try {
      const result = await this.pathPdf(comprobante, tipoComprobante);
      const folder = path.join(__dirname, '..', '..', 'public', result.empresa, result.year, result.month);
      if (!(existsSync(folder))) {
        mkdirSync(folder, { recursive: true });
      }
      const byteCharacters = Buffer.from(pdfBase64, 'base64').toString('binary');
      const file = path.join(folder, `${comprobante}.pdf`);
      this.fileExists(file);
      writeFileSync(file, byteCharacters, 'binary');
      const finish = await this.savePath(comprobante, result, tipoComprobante);
      log.info('%s %s %s', finish);
    } catch (e) {
      throw e;
    }
  }

  private static async pathPdf(comprobante: string, tipoComprobante: number) {
    if (tipoComprobante == 1) {
      const _facturaModel = new FacturaModel();
      const path = await _facturaModel.getPath(comprobante);
      return path;
    } else {
      const _notaModel = new NotaModel();
      const path = await _notaModel.getPath(comprobante);
      return path;
    }
  }

  private static async savePath(comprobante: any, result: any, tipoComprobante: number) {
    if (tipoComprobante == 1) {
      const _facturaModel = new FacturaModel();
      const finish = await _facturaModel.savePath(comprobante, `/${result.empresa}/${result.year}/${result.month}/${comprobante}.pdf`);
      return finish;
    } else {
      const _notaModel = new NotaModel();
      const finish = await _notaModel.savePath(comprobante, `/nota/${result.empresa}/${result.year}/${result.month}/${comprobante}.pdf`);
      return finish;
    }
  }

  private static fileExists(file: string) {
    try {
      unlinkSync(file);
    } catch (e) {
      console.log(e);
    }
  }
}