import { ModelPg } from '../../services';
import { XmlAdmin } from '../../interfaces/xml';

export class NotaModel extends ModelPg {
  private _pg;

  constructor () {
    super();
    this._pg = this.pg();
  }

  public async pg_note (invoice: string, note: string) {
    const _xmlAdmin = new XmlAdmin();
    try {
      const body = await this._pg.query(`SELECT * FROM fn_note_body($1, $2)`, [invoice, note]);
      const xmlBody = body.rows.map(r => {
        return _xmlAdmin.bodyNote(r.fn_note_body, result => {
          return result;
        });
      });

      let textTypeNote: string;
      const typeNote = await this._pg.query(`SELECT tipo_nota FROM nota_cartera_enc WHERE nota = $1`, [note]);
      typeNote.rows[0].tipo_nota === 'C' ? textTypeNote = 'cac:CreditNoteLine' : textTypeNote = 'cac:DebitNoteLine';
      const header = await this._pg.query(`SELECT	* FROM fn_nota_bussines($1, $2)`, [invoice, note]);
      const xmlHeader = header.rows.map(r => {
        return _xmlAdmin.headerNote(r.fn_nota_bussines, result => {
          result[textTypeNote] = xmlBody;
          return result;
        });
      });

      return xmlHeader;
    } catch (e) {
      throw e;
    }
  }

  public async pg_note_bussines (invoice: string, note: string) {
    const _xmlAdmin = new XmlAdmin();
    try {
      let textTypeNote: string;
      const typeNote = await this._pg.query(`SELECT tipo_nota FROM nota_cartera_enc WHERE nota = $1`, [note]);
      typeNote.rows[0].tipo_nota === 'C' ? textTypeNote = 'cac:CreditNoteLine' : textTypeNote = 'cac:DebitNoteLine';
      const { rows } = await this._pg.query(`SELECT	* FROM fn_nota_bussines($1, $2)`, [invoice, note]);
      return rows.map(t => {
        return _xmlAdmin.headerNote(t.fn_nota_bussines, result => {
          result[textTypeNote] = [];
          return result;
        });
      });
    } catch (e) {
      throw e;
    }
  }

  public async pg_note_body (invoice: string, note: string) {
    const _xmlAdmin = new XmlAdmin();
    try {
      const { rows } = await this._pg.query(`SELECT * FROM fn_note_body($1, $2)`, [invoice, note]);
      return rows.map(r => {
        return _xmlAdmin.bodyNote(r.fn_note_body, result => {
          return result;
        });
      });
    } catch (e) {
      throw e;
    }
  }

}