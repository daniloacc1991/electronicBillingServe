import { ModelPg } from '../../services';
import { RtaComprobanteModel } from '../../interfaces/rtaComprobante';
import { NoteHeader, XmlAdmin } from '../../interfaces';

export class NotaModel extends ModelPg {
  private _pg;

  constructor() {
    super();
    this._pg = this.pg();
  }

  public async pg_note(note: string) {
    try {
      const body = await this.pg_note_body(note);
      const textTypeNote = await this.pg_typeNote(note);
      const header = await this.pg_note_header(note);
      header[textTypeNote] = body;
      return header;
    } catch (e) {
      throw e;
    }
  }

  public async pg_typeNote(note: string) {
    try {
      let textTypeNote: string;
      const typeNote = await this._pg.query(`SELECT naturaleza FROM nota_electronica_encabezado WHERE nota = $1`, [note]);
      typeNote.rows[0].naturaleza === 'C' ? textTypeNote = 'cac:CreditNoteLine' : textTypeNote = 'cac:DebitNoteLine';
      return textTypeNote;
    } catch (e) {
      throw e;
    }
  }

  public async pg_note_header(note: string) {
    const _xmlAdmin = new XmlAdmin();
    try {
      let namefunction: string;
      const tipoEmpresa = await this.tipoEmpresaPersona(note);
      if (tipoEmpresa == 'S') {
        namefunction = 'fn_note_person';
      } else {
        namefunction = 'fn_note_bussines';
      }
      const textTypeNote = await this.pg_typeNote(note);
      const { rows } = await this._pg.query(`SELECT	* FROM ${namefunction}($1)`, [note]);
      const row = rows[0][namefunction][0];
      let headerJson: NoteHeader;
      if (tipoEmpresa == 'S') {
        const namesplit: string[] = row.clientname.split(' ');
        const position = namesplit.length;
        row.firstname = namesplit[0];
        if (namesplit.length === 2) {
          row.familyname = namesplit[1];
        } else {
          row.familyname = namesplit[position - 2] + ' ' + namesplit[position - 1];
        }
        headerJson = row;
      } else {
        headerJson = row;
      }

      const xmlHeader = await _xmlAdmin.headerNote(headerJson);
      if (textTypeNote === 'cac:CreditNoteLine') {
        delete xmlHeader['cbc:CustomizationID'];
      }
      xmlHeader[textTypeNote] = [];
      return xmlHeader;
    } catch (e) {
      throw e;
    }
  }

  public async pg_note_body(note: string) {
    const _xmlAdmin = new XmlAdmin();
    let nameFuntion;
    try {
      const typeRGNote = await this._pg.query(`SELECT fe_tipo_factura tipo_factura FROM nota_electronica_encabezado WHERE nota = $1`, [note]);

      if (typeRGNote.rows[0].tipo_factura == 'R') {
        nameFuntion = 'fn_note_body_resumida';
      } else if (typeRGNote.rows[0].tipo_factura == 'D') {
        nameFuntion = 'fn_note_body_detallada';
      } else if (typeRGNote.rows[0].tipo_factura == 'P') {
        nameFuntion = 'fn_note_body_paquete';
      } else if (typeRGNote.rows[0].tipo_factura == 'H') {
        nameFuntion = 'fn_note_body_homologo';
      }
      const textTypeNote = await this.pg_typeNote(note);
      const { rows } = await this._pg.query(`SELECT * FROM ${nameFuntion}($1)`, [note]);
      return rows.map(r => {
        return _xmlAdmin.bodyNote(r, textTypeNote, result => {
          return result;
        });
      });
    } catch (e) {
      throw e;
    }
  }

  public async pg_pending(userI: string, userF: string) {
    try {
      const { rows } = await this._pg.query('SELECT * FROM fn_note_pending($1, $2)', [userI, userF]);
      rows.map(r => {
        r.empresa = r.empresa.replace(new RegExp('Ń', 'g'), 'Ñ');
        r.usuario = r.usuario.replace(new RegExp('Ń', 'g'), 'Ñ');
      });
      return rows;
    } catch (e) {
      throw e;
    }
  }

  public async pg_resend(userI: string, userF: string) {
    try {
      const { rows } = await this._pg.query('SELECT * FROM fn_note_resend($1, $2)', [userI, userF]);
      rows.map(r => {
        r.empresa = r.empresa.replace(new RegExp('Ń', 'g'), 'Ñ');
        r.usuario = r.usuario.replace(new RegExp('Ń', 'g'), 'Ñ');
      });
      return rows;
    } catch (e) {
      throw e;
    }
  }

  public async pg_sent(userI: string, userF: string, fechaI: string, fechaF: string) {
    try {
      const { rows } = await this._pg.query(`SELECT * FROM fn_note_sent($1, $2, $3, $4)`, [userI, userF, fechaI, fechaF]);
      rows.map(r => {
        r.empresa = r.empresa.replace(new RegExp('Ń', 'g'), 'Ñ');
      });
      return rows;
    } catch (e) {
      throw e;
    }
  }

  public async saveTransaccion(note: string, id: number) {
    try {
      const { rows } = await this._pg.query(`UPDATE nota_electronica_encabezado SET fe_id_transaccion = $2, fe_fecha_transaccion = now()::timestamp, fe_ind_enviada = 'S' WHERE nota = $1
        returning nota, fe_id_transaccion, fe_fecha_transaccion`, [note, id]);
      return rows;
    } catch (e) {
      throw e;
    }
  }

  public async deleteTransaccion(note: string) {
    try {
      const { rows } = await this._pg.query(`UPDATE nota_electronica_encabezado SET fe_id_transaccion = null, fe_fecha_transaccion = null, fe_ind_enviada = 'N' WHERE nota = $1 returning nota, fe_id_transaccion, fe_fecha_transaccion`, [note]);
      return rows;
    } catch (e) {
      throw e;
    }
  }

  public async saveCufe(rtaCbt: RtaComprobanteModel, usuario: string) {
    try {
      const transaccion = rtaCbt.transaccion;
      const note = rtaCbt.invoice;
      const cufe = rtaCbt.cufe;
      const estado = rtaCbt.estado;
      const id = rtaCbt.id ? rtaCbt.id : null;
      const msj = rtaCbt.msj ? rtaCbt.msj : null;
      const receivedDateTime = rtaCbt.ReceivedDateTime ? rtaCbt.ReceivedDateTime : null;
      const responseDateTime = rtaCbt.ResponseDateTime ? rtaCbt.ResponseDateTime : null;
      const estadoDIAN = rtaCbt.estadoDIAN ? rtaCbt.estadoDIAN : null;
      const { rows } = await this._pg.query(`UPDATE	nota_electronica_encabezado
      SET	cufe = $1,
        fe_fecha_cufe = now(),
        fe_estado = (SELECT fe_estado FROM fe_estado WHERE descripcion = $3),
        fe_fecha_recibe_dian = $4::timestamp,
        fe_fecha_respuesta_dian = $5::timestamp,
        msj_id = $6,
        msj = $7,
        estadoDIAN = $8,
        fe_id_transaccion = $9
      WHERE	nota = $2
      RETURNING nota, cufe, estado, factura, ind_anula_factura`,
        [cufe, note, estado, receivedDateTime, responseDateTime, id, msj, estadoDIAN, transaccion]);
      const rta = {
        cufe: rows[0].cufe,
        factura: rows[0].factura,
        estado: estado
      };

      if (rows[0].ind_anula_factura === 'S') {
        await this._pg.query(`
        INSERT INTO seguimiento_registro (registro, fecha_asignacion, funcionario_recibe, funcionario_entrega, estado, tipo, radicador, observacion)
        SELECT registro, Date_Trunc('second', now()), $2, 'EMP','I','R','9999','ASIGNADO AUTOMATICAMENTE ANULAR LA FACTURA.'
        FROM  registro
        WHERE factura = $1`, [rows[0].factura, usuario]);

        await this._pg.query(`
        UPDATE registro
        SET estado = 'A',
        factura = NULL,
        ind_registro_auditado = 'N',
        usuario_registro_auditado = null,
        fecha_registro_auditado = null,
        ind_cuenta_cerrada = 'N',
        fecha_cierre_cuenta = null,
        usuario_cierre_cuenta = null
        WHERE factura = $1
        RETURNING registro`, [rows[0].factura]);
      }
      return rta;
    } catch (e) {
      throw e;
    }
  }

  public async getPath(nota: string) {
    try {
      const { rows } = await this._pg.query(`SELECT nota, empresa, TO_CHAR(fecha, 'YYYY') As year, TO_CHAR(fecha, 'MM') As month FROM nota_electronica_encabezado WHERE nota = $1`, [nota]);
      return ((!rows) ? {} : rows[0]);
    } catch (e) {
      throw e;
    }
  }

  public async savePath(note: string, path: string) {
    try {
      const { rows } = await this._pg.query(`UPDATE nota_electronica_encabezado SET path_pdf = $2 WHERE nota = $1 RETURNING nota, path_pdf`, [note, path]);
      return ((!rows) ? {} : rows[0]);
    } catch (e) {
      throw e;
    }
  }

  public async getPDF(note: string) {
    try {
      const { rows } = await this._pg.query(`SELECT path_pdf FROM nota_electronica_encabezado WHERE note = $1`, [note]);
      return ((!rows) ? {} : rows[0]);
    } catch (e) {
      throw e;
    }
  }

  private async tipoEmpresaPersona(nota: string): Promise<string> {
    try {
      const { rows } = await this._pg.query(`SELECT e.fe_persona_natural tipo FROM factura f JOIN empresa e ON e.empresa = f.empresa JOIN nota_electronica_encabezado ne ON ne.factura = f.factura WHERE ne.nota = $1`, [nota]);
      if (rows.length !== 1) {
        return Promise.reject({
          stack: {
            delete: false,
            msj: 'No se encontró tipo empresa de la factura'
          }
        });
      }
      return rows[0].tipo;
    } catch (e) {
      throw e;
    }
  }

}