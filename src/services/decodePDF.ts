import * as path from 'path';
import { writeFileSync, mkdirSync, existsSync, unlinkSync  } from 'fs';

import { log } from './';
import { FacturaModel } from '../components/factura';

export class DecodePDF {
  public static async converToPdf (pdfBase64: any, invoice: string) {
    const _facturaModel = new FacturaModel();
    try {
      const result = await _facturaModel.getPath(invoice);
      const folder = path.join(__dirname, '..', '..', 'public', result.empresa, result.year, result.month);
      if (!(existsSync(folder))) {
        mkdirSync(folder, {recursive: true});
      }
      const byteCharacters = Buffer.from(pdfBase64, 'base64').toString('binary');
      const file = path.join(folder, `${invoice}.pdf`);
      this.invoiceExists(file);
      writeFileSync(file, byteCharacters, 'binary');
      const finish = await _facturaModel.savePath(invoice, `/${result.empresa}/${result.year}/${result.month}/${invoice}.pdf`);
      log.info('%s %s %s', finish);
    } catch (e) {
      throw e;
    }
  }

  private static invoiceExists (file: string) {
    try {
      unlinkSync(file);
    } catch (e) {
      console.log(e);
    }
  }
}