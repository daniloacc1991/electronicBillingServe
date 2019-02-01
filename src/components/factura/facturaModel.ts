import { ModelPg } from '../../services';
import { RtaComprobanteModel } from '../../interfaces/rtaComprobante';
import { XmlAdmin } from '../../interfaces/xml';

export class FacturaModel extends ModelPg {

  private _pg;

  constructor() {
    super();
    this._pg = this.pg();
  }

  public async invoicePending(userI: string, userF: string) {
    try {
      const { rows } = await this._pg.query(`SELECT * FROM fn_invoice_pending($1, $2)`, [userI, userF]);
      return rows;
    } catch (e) {
      throw e;
    }
  }

  public async cufePending(userI: string, userF: string) {
    try {
      const { rows } = await this._pg.query(`SELECT * FROM fn_invoice_cufe_pending($1, $2)`, [userI, userF]);
      return rows;
    } catch (e) {
      throw e;
    }
  }

  public async invoicesSent(userI: string, userF: string, fechaI: string, fechaF: string) {
    try {
      const { rows } = await this._pg.query(`SELECT * FROM fn_invoice_sent($1, $2, $3, $4)`, [userI, userF, fechaI, fechaF]);
      return rows;
    } catch (e) {
      throw e;
    }
  }

  public async forYearUser(date: string, user: string) {
    try {
      const { rows } = await this._pg.query(`SELECT * FROM fn_invoces_for_Year_User($1, $2)`, [date, user]);
      return rows.map(t => {
        return t;
      });
    } catch (e) {
      throw e;
    }
  }

  public async electronicforUser(user: string) {
    try {
      const { rows } = await this._pg.query(`SELECT * FROM fn_invoces_elec_for_user($1)`, [user]);
      return rows.map(t => {
        return t;
      });
    } catch (e) {
      throw e;
    }
  }

  public async saveTransaccion(invoice: string, id: number) {
    try {
      const { rows } = await this._pg.query(`UPDATE factura SET fe_id_transaccion = $2, fe_fecha_transaccion = now()::timestamp, ind_fe_enviada = 'S' WHERE factura = $1
        returning factura, fe_id_transaccion, fe_fecha_transaccion`, [invoice, id]);
      return rows;
    } catch (e) {
      throw e;
    }
  }

  public async deleteTransaccion(invoice: string) {
    try {
      const { rows } = await this._pg.query(`UPDATE factura SET fe_id_transaccion = null, fe_fecha_transaccion = null, ind_fe_enviada = 'N' WHERE factura = $1 returning factura, fe_id_transaccion, fe_fecha_transaccion`, [invoice]);
      return rows;
    } catch (e) {
      throw e;
    }
  }

  public async saveCufe(rtaCbt: RtaComprobanteModel) {
    try {
      const transaccion = rtaCbt.transaccion;
      const invoice = rtaCbt.invoice;
      const cufe = rtaCbt.cufe;
      const estado = rtaCbt.estado;
      const id = rtaCbt.id ? rtaCbt.id : null;
      const msj = rtaCbt.msj ? rtaCbt.msj : null;
      const receivedDateTime = rtaCbt.ReceivedDateTime ? rtaCbt.ReceivedDateTime : null;
      const responseDateTime = rtaCbt.ResponseDateTime ? rtaCbt.ResponseDateTime : null;
      const estadoDIAN = rtaCbt.estadoDIAN ? rtaCbt.estadoDIAN : null;
      const { rows } = await this._pg.query(`UPDATE	factura
      SET	cufe = $1,
        fe_fecha_cufe = now(),
        fe_estado = (SELECT fe_estado FROM fe_estado WHERE descripcion = $3),
        fe_fecha_recibe_dian = $4::timestamp,
        fe_fecha_respuesta_dian = $5::timestamp,
        msj_id = $6,
        msj = $7,
        estadoDIAN = $8,
        fe_id_transaccion = $9
      WHERE	factura = $2
      RETURNING factura, cufe, estado`,
        [cufe, invoice, estado, receivedDateTime, responseDateTime, id, msj, estadoDIAN, transaccion]);
      const rta = {
        cufe: rows[0].cufe,
        factura: rows[0].factura,
        estado: estado
      };
      return rta;
    } catch (e) {
      throw e;
    }
  }

  public async getPath(invoice: string) {
    try {
      const { rows } = await this._pg.query(`SELECT factura, empresa, TO_CHAR(fecha, 'YYYY') As year, TO_CHAR(fecha, 'MM') As month FROM factura WHERE factura = $1`, [invoice]);
      return ((!rows) ? {} : rows[0]);
    } catch (e) {
      throw e;
    }
  }

  public async savePath(invoice: string, path: string) {
    try {
      const { rows } = await this._pg.query(`UPDATE factura SET path_pdf = $2 WHERE factura = $1 RETURNING factura, path_pdf`, [invoice, path]);
      return ((!rows) ? {} : rows[0]);
    } catch (e) {
      throw e;
    }
  }

  public async getPDF(invoice: string) {
    try {
      const { rows } = await this._pg.query(`SELECT path_pdf FROM factura WHERE factura = $1`, [invoice]);
      return ((!rows) ? {} : rows[0]);
    } catch (e) {
      throw e;
    }
  }

  public async invoce(factura: string) {
    try {
      const body = await this.pg_invoice_body(factura);
      const header = await this.pg_invoice_header(factura);
      header['fe:InvoiceLine'] = body;
      return header;
    } catch (e) {
      throw e;
    }
  }

  public async pg_invoice_header(factura: string) {
    const _xmlAdmin = new XmlAdmin();
    try {
      let namefunction: string;
      const tipoEmpresa = await this.tipoEmpresaPersona(factura);
      if (tipoEmpresa == 'S') {
        namefunction = 'fn_invoice_person';
      } else {
        namefunction = 'fn_invoice_bussine';
      }

      const { rows } = await this._pg.query(`SELECT	* FROM ${namefunction}($1)`, [factura]);
      for (const key in rows[0]) {
        if (rows[0].hasOwnProperty(key)) {
          if (rows[0][key] === null) {
            return Promise.reject({
              stack: `El campo ${key} tiene un valor nulo, favor informar a sistemas..`
            });
          }
        }
      }

      let headerJson;
      if (tipoEmpresa == 'S') {
        rows.map(t => {
          const namesplit: string[] = t.clientname.split(' ');
          const position = namesplit.length;
          t.firstname = namesplit[0];
          if (namesplit.length === 2) {
            t.familyname = namesplit[1];
          } else {
            t.familyname = namesplit[position - 2] + ' ' + namesplit[position - 1];
          }
          headerJson = t;
        });
      } else {
        headerJson = rows[0];
      }

      const xmlHeader = await _xmlAdmin.headerInvoice(headerJson);
      return xmlHeader;
    } catch (e) {
      throw {
        stack: {
          delete: false,
          msj: e.stack
        }
      };
    }
  }

  public async pg_invoice_body(factura: string) {
    const _xmlAdmin = new XmlAdmin();
    let nameFuntion;
    try {
      const typeInvoce = await this._pg.query(`SELECT tf.tipo_factura FROM factura JOIN tipo_factura tf ON tf.tipo_factura = factura.fe_tipo_factura
      WHERE factura = $1`, [factura]);

      if (typeInvoce.rows[0].tipo_factura == 'R') {
        const validado = await this.validaValor(factura);
        nameFuntion = 'fn_invoice_body_resumida';
      } else if (typeInvoce.rows[0].tipo_factura == 'D') {
        const validado = await this.validaValor(factura);
        nameFuntion = 'fn_invoice_body_detallada';
      } else if (typeInvoce.rows[0].tipo_factura == 'P') {
        const validado = await this.validaValorPaquete(factura);
        nameFuntion = 'fn_invoice_body_paquete';
      } else if (typeInvoce.rows[0].tipo_factura == 'H') {
        const validado = await this.validaValorPaquete(factura);
        nameFuntion = 'fn_invoice_body_homologo';
      }

      const { rows } = await this._pg.query(`SELECT * FROM ${nameFuntion}($1)`, [factura]);
      if (rows <= 0) {
        return Promise.reject({
          stack: {
            delete: false,
            msj: 'No se encontró detalle de la factura'
          }
        });
      }
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].description === null || typeof (rows[i].description) === undefined) {
          return Promise.reject({
            stack: {
              delete: false,
              msj: 'HAY DESCRIPCIONES NULAS'
            }
          });
        }
      }
      const invoiceHeader = [];
      rows.map(r => {
        _xmlAdmin.bodyInvoice(r, typeInvoce.rows[0].tipo_factura, result => {
          invoiceHeader.push(result);
        });
      });
      return invoiceHeader;
    } catch (e) {
      throw e;
    }
  }

  private async tipoEmpresaPersona(factura: string): Promise<string> {
    try {
      const { rows } = await this._pg.query(`SELECT e.fe_persona_natural tipo FROM factura f
        JOIN empresa e ON e.empresa = f.empresa WHERE f.factura = $1`, [factura]);
      if (rows.length !== 1) {
        return Promise.reject({
          stack: 'No se encontró tipo empresa de la factura'
        });
      }
      return rows[0].tipo;
    } catch (e) {
      throw e;
    }
  }

  private async validaValor(factura: string): Promise<boolean> {
    try {
      const tipoEmpresaPersona = await this.tipoEmpresaPersona(factura);

      if (tipoEmpresaPersona === 'S') {
        const { rows } = await this._pg.query(`SELECT  t1.factura, SUM(t1.valor) FROM (	SELECT r.factura, c.nombre as concepto, sd.codigo_manual servicio, sd.nombre_manual as descripcion, SUM(sd.cantidad) as cantidad, SUM(sd.valor) as valor FROM servicio_encabezado se, servicio_detalle sd,	registro r, concepto c WHERE se.numero_servicio = sd.numero_servicio AND se.concepto = sd.concepto AND se.registro = sd.registro	AND se.registro = r.registro AND se.concepto = c.concepto AND r.factura = $1 GROUP BY 1,2,3,4 HAVING SUM(sd.cantidad) > 0 ORDER BY 1,2,3 ) AS t1 GROUP BY t1.factura HAVING SUM(t1.valor) <> ( SELECT f.valor FROM factura f WHERE	f.factura = $1)`, [factura]);
        if (rows.length > 0) {
          return Promise.reject({
            stack: {
              delete: false,
              msj: 'VERIFIQUE LOS SERVICIOS CARGADOS'
            }
          });
        } else {
          return true;
        }
      } else {
        const { rows } = await this._pg.query(`SELECT  t1.factura, SUM(t1.valor) FROM (	SELECT r.factura, c.nombre as concepto, sd.codigo_manual servicio, sd.nombre_manual as descripcion, SUM(sd.cantidad) as cantidad, SUM(sd.valor) as valor FROM servicio_encabezado se, servicio_detalle sd,	registro r, concepto c WHERE se.numero_servicio = sd.numero_servicio AND se.concepto = sd.concepto AND se.registro = sd.registro	AND se.registro = r.registro AND se.concepto = c.concepto AND r.factura = $1 GROUP BY 1,2,3,4 HAVING SUM(sd.cantidad) > 0 ORDER BY 1,2,3 ) AS t1 GROUP BY t1.factura HAVING SUM(t1.valor) <> ( SELECT f.valor + COALESCE(t1.recibos,0) FROM factura f LEFT JOIN ( SELECT	r.factura, COALESCE(SUM(rd.valor_pago),0)::numeric recibos FROM registro r JOIN recibo_caja_encabezado re ON re.registro = r.registro JOIN recibo_caja_detalle rd ON re.recibo_caja = rd.recibo_caja WHERE	r.factura = $1 GROUP BY r.factura ) t1 ON t1.factura = f.factura WHERE	f.factura = $1)`, [factura]);
        if (rows.length > 0) {
          return Promise.reject({
            stack: {
              delete: false,
              msj: 'VERIFIQUE LOS SERVICIOS CARGADOS'
            }
          });
        } else {
          return true;
        }
      }

    } catch (e) {
      throw e;
    }
  }

  private async validaValorPaquete(factura: string): Promise<boolean> {
    try {
      const tipoEmpresaPersona = await this.tipoEmpresaPersona(factura);

      if (tipoEmpresaPersona === 'S') {
        const { rows } = await this._pg.query(`SELECT t1.factura, SUM(t1.valor) FROM ( SELECT r.factura, c.nombre as concepto, sp.codigo_manual servicio,sp.nombre_manual as descripcion, SUM(sp.cantidad) as cantidad, SUM(sp.valor) as valor FROM servicio_detalle_paquete sp, registro r, concepto c WHERE sp.registro = r.registro AND sp.concepto = c.concepto AND r.factura = $1 GROUP BY 1,2,3,4 HAVING SUM(sp.cantidad) > 0 ORDER BY 1,2,3 ) AS t1 GROUP BY t1.factura HAVING SUM(t1.valor) <> ( SELECT f.valor FROM factura f WHERE	f.factura = $1)`, [factura]);
        if (rows.length > 0) {
          return Promise.reject({
            stack: {
              delete: false,
              msj: 'VERIFIQUE LOS SERVICIOS CARGADOS'
            }
          });
        } else {
          return true;
        }
      } else {
        const { rows } = await this._pg.query(`SELECT	t1.factura, SUM(t1.valor) FROM (SELECT r.factura, c.nombre as concepto, sp.codigo_manual servicio, sp.nombre_manual as descripcion, SUM(sp.cantidad) as cantidad, SUM(sp.valor) as valor FROM servicio_detalle_paquete sp, registro r, concepto c WHERE sp.registro = r.registro AND sp.concepto = c.concepto AND r.factura = $1 GROUP BY 1,2,3,4 HAVING SUM(sp.cantidad) > 0 ORDER BY 1,2,3 ) AS t1 GROUP BY t1.factura HAVING SUM(t1.valor) <> ( SELECT f.valor + COALESCE(t1.recibos,0) FROM factura f LEFT JOIN ( SELECT r.factura, COALESCE(SUM(rd.valor_pago),0)::numeric recibos FROM registro r JOIN recibo_caja_encabezado re ON re.registro = r.registro JOIN recibo_caja_detalle rd ON re.recibo_caja = rd.recibo_caja WHERE r.factura = $1 GROUP BY r.factura ) t1 ON t1.factura = f.factura WHERE f.factura = $1)`, [factura]);
        if (rows.length > 0) {
          return Promise.reject({
            stack: {
              delete: false,
              msj: 'VERIFIQUE LOS SERVICIOS CARGADOS'
            }
          });
        } else {
          return true;
        }
      }

    } catch (e) {
      throw e;
    }
  }
}