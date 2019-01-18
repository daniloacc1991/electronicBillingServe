import { ModelPg } from '../../services';

export class FacturaModel extends ModelPg {

  private _pg;

  constructor () {
    super();
    this._pg = this.pg();
  }

  public async invoicePending (user: string) {
    try {
      const { rows } = await this._pg.query(`SELECT * FROM fn_invoces_pending($1)`, [user]);
      return rows.map( t => {
        return t;
      });
    } catch (e) {
      throw e;
    }
  }

  public async forYearUser (date: string, user: string) {
    try {
      const { rows } = await this._pg.query(`SELECT * FROM fn_invoces_for_Year_User($1, $2)`, [date, user]);
      return rows.map( t => {
        return t;
      });
    } catch (e) {
      throw e;
    }
  }

  public async electronicforUser (user: string) {
    try {
      const { rows } = await this._pg.query(`SELECT * FROM fn_invoces_elec_for_user($1)`, [user]);
      return rows.map( t => {
        return t;
      });
    } catch (e) {
      throw e;
    }
  }

  public async cufePending (user: string) {
    try {
      const { rows } = await this._pg.query(`SELECT * FROM fn_invoces_cufe_pending($1)`, [user]);
      return rows.map( t => {
        return t;
      });
    } catch (e) {
      throw e;
    }
  }

  public async invoicesSent (userI: string, userF: string) {
    try {
      const { rows } = await this._pg.query(`SELECT * FROM fn_invoces_sent($1, $2)`, [userI, userF]);
      return rows;
    } catch (e) {
      throw e;
    }
  }

  public async saveTransaccion (invoice: string, id: number) {
    try {
      const { rows } = await this._pg.query(`UPDATE factura SET fe_id_transaccion = $2, fe_fecha_transaccion = now()::timestamp, ind_fe_enviada = 'S' WHERE factura = $1
        returning factura, fe_id_transaccion, fe_fecha_transaccion`, [invoice, id]);
      return rows;
    } catch (e) {
      throw e;
    }
  }

  public async deleteTransaccion (invoice: string) {
    try {
      const { rows } = await this._pg.query(`UPDATE factura SET fe_id_transaccion = null, fe_fecha_transaccion = null, ind_fe_enviada = 'N' WHERE factura = $1 returning factura, fe_id_transaccion, fe_fecha_transaccion`, [invoice]);
      return rows;
    } catch (e) {
      throw e;
    }
  }

  public async saveCufe (cufe: string, invoice: string) {
    try {
      const { rows } = await this._pg.query(`UPDATE factura SET cufe = $1, fe_fecha_cufe = now() WHERE factura = $2 returning factura, cufe`, [cufe, invoice]);
      return rows;
    } catch (e) {
      throw e;
    }
  }

  public async getPath (invoice: string) {
    try {
      const { rows } = await this._pg.query(`SELECT factura, empresa, TO_CHAR(fecha, 'YYYY') As year, TO_CHAR(fecha, 'MM') As month FROM factura WHERE factura = $1`, [invoice]);
      return ((!rows) ? {} : rows[0]);
    } catch (e) {
      throw e;
    }
  }

  public async savePath (invoice: string, path: string) {
    try {
      const { rows } = await this._pg.query(`UPDATE factura SET path_pdf = $2 WHERE factura = $1 RETURNING factura, path_pdf`, [invoice, path]);
      return ((!rows) ? {} : rows[0]);
    } catch (e) {
      throw e;
    }
  }

  public async getPDF (invoice: string) {
    try {
      const { rows } = await this._pg.query(`SELECT path_pdf FROM factura WHERE factura = $1`, [invoice]);
      return ((!rows) ? {} : rows[0]);
    } catch (e) {
      throw e;
    }
  }

  public async invoce (factura: string) {
    try {
      const tipoEmpresa = await this._pg.query(`SELECT e.fe_persona_natural tipo FROM factura f
        JOIN empresa e ON e.empresa = f.empresa WHERE f.factura = $1`, [factura]);
      if (tipoEmpresa.rows[0].tipo == 'S') {
        const { rows } = await this._pg.query(`SELECT * FROM fn_invoces_persons($1)`, [factura]);
        return rows.map( t => {
          const namesplit: string[] = t.clientname.split(' ');
          const position = namesplit.length;
          t.firstname = namesplit[0];
          t.familyname = namesplit[position - 2] + ' ' + namesplit[position - 1];
          return t;
        });
      } else {
        const { rows } = await this._pg.query(`SELECT * FROM fn_invoces_bussines($1)`, [factura]);
        return rows.map( t => {
          return t;
        });
      }
    } catch (e) {
      throw e;
    }
  }

  public async details (factura: string) {
    let query;
    try {
      const typeInvoce = await this._pg.query(`SELECT fe_tipo_factura.fe_tipo_factura FROM factura JOIN fe_tipo_factura ON fe_tipo_factura.fe_tipo_factura = factura.fe_tipo_factura
      WHERE factura = $1`, [factura]);
      if (typeInvoce.rows[0].fe_tipo_factura == 'R') {
        query = `SELECT	row_number() OVER () as id, concepto.nombre As Description, 1 As InvoicedQuantity, SUM(servicio_detalle.valor) PriceAmount,SUM(servicio_detalle.valor) LineExtensionAmount FROM servicio_encabezado JOIN servicio_detalle ON servicio_encabezado.numero_servicio = servicio_detalle.numero_servicio AND servicio_encabezado.concepto = servicio_detalle.concepto AND servicio_encabezado.registro = servicio_detalle.registro JOIN registro ON servicio_encabezado.registro = registro.registro JOIN concepto ON servicio_encabezado.concepto = concepto.concepto WHERE registro.factura = $1 GROUP BY 2,3 HAVING SUM (servicio_detalle.cantidad) > 0 ORDER BY 2,3`;
      } else if (typeInvoce.rows[0].fe_tipo_factura == 'D') {
        query = `SELECT  row_number() over () as id, t1.*, t1.LineExtensionAmount/t1.InvoicedQuantity as PriceAmount, SUM(t1.LineExtensionAmount) over (partition by t1.concepto) as totalconcepto FROM  ( SELECT concepto.nombre as concepto, servicio_detalle.servicio, servicio_detalle.nombre_manual as Description, SUM(servicio_detalle.cantidad) as InvoicedQuantity, SUM(servicio_detalle.valor) as LineExtensionAmount FROM	servicio_encabezado, servicio_detalle, registro, concepto WHERE servicio_encabezado.numero_servicio = servicio_detalle.numero_servicio AND servicio_encabezado.concepto = servicio_detalle.concepto AND servicio_encabezado.registro = servicio_detalle.registro AND servicio_encabezado.registro = registro.registro AND servicio_encabezado.concepto = concepto.concepto AND registro.factura = $1 GROUP BY 1,2,3 HAVING SUM(servicio_detalle.cantidad) > 0 ORDER BY 1,2) as t1`;
      } else if (typeInvoce.rows[0].fe_tipo_factura == 'P') {
        query = `SELECT	row_number() over () id, t1.*, t1.LineExtensionAmount/t1.InvoicedQuantity as PriceAmount, SUM(t1.LineExtensionAmount) over (partition by t1.concepto) as totalconcepto FROM (
        SELECT	concepto.nombre AS concepto, servicio_detalle_paquete.servicio, servicio.descripcion description, SUM(servicio_detalle_paquete.cantidad) InvoicedQuantity, SUM(servicio_detalle_paquete.valor) LineExtensionAmount FROM servicio_detalle_paquete JOIN registro ON registro.registro = servicio_detalle_paquete.registro JOIN concepto ON concepto.concepto = servicio_detalle_paquete.concepto JOIN servicio ON servicio.concepto = servicio_detalle_paquete.concepto AND servicio.servicio = servicio_detalle_paquete.servicio WHERE	registro.factura = $1 GROUP BY 1,2,3 ORDER BY 1,2 ) t1`;
      }
      const details = await this._pg.query(query, [factura]);
      return {
        typeInvoce: typeInvoce.rows[0].fe_tipo_factura,
        details: details.rows
      };
    } catch (e) {
      throw e;
    }
  }

}