import { ModelPg } from '../../services';

export class UserModel extends ModelPg {
  // tslint:disable-next-line:variable-name
  private _pg;

  constructor () {
    super();
    this._pg = this.pg();
  }

  public async pg_login (user: string, password: string) {
    try {
      const { rows } = await this._pg.query(`SELECT * FROM fn_verify_login($1, $2)`, [user, password]);
      return ((!rows) ? {} : rows[0]);
    } catch (e) {
      throw e;
    }
  }

  public async pg_perfil (sistema: string, user: string) {
    try {
      const { rows } = await this._pg.query(`SELECT mu.modulo_sistema, ug.grupo_usuario FROM	usuarios_x_grupo ug JOIN modulo_x_usuario mu ON ug.sistema = mu.modulo_sistema WHERE mu.modulo_sistema = $1 AND mu.usuario = $2`, [sistema, user]);
      if ( rows.length !== 1 ) {
        throw {
          stack: 'Usted no tiene permisos para ingresar a este modulo..'
        };
      } else {
        return rows[0];
      }
    } catch (e) {
      throw e;
    }
  }

  public async pg_SaveToken (token: string, id: number) {
    try {
      const { rows } = await this._pg.query(`INSERT INTO user_token (token, id) VALUES($1, $2) RETURNING *`, [token, id]);
      return ((!rows) ? {} : rows[0]);
    } catch (e) {
      throw e;
    }
  }

  public async pg_verifyToken (token: string) {
    try {
      const { rows } = await this._pg.query(`SELECT * FROM user_token WHERE token = $1 AND delete = false`, [token]);
      return ((!rows) ? {} : rows[0]);
    } catch (e) {
      throw e;
    }
  }

  public async pg_logOff (token: string) {
    try {
      const { rows } = await this._pg.query(`UPDATE user_token SET delete = true WHERE token = $1 RETURNING *`, [token]);
      return ((!rows) ? {} : rows[0]);
    } catch (e) {
      throw e;
    }
  }

  public async pg_menu (sistema: string, usuario: string) {
    console.log(`Sistema: ${sistema} - Usuario: ${usuario}`);
    try {
      const grupo = await this._pg.query(`SELECT * FROM usuarios_x_grupo WHERE sistema = $1 AND usuario = $2`, [sistema, usuario]);
      if (grupo.rows.length !== 1 ) {
        throw {
          stack: 'Está agregado en mas de un grupo, favor informe a sistemas..'
        };
      } else {
        const { rows } = await this._pg.query(`SELECT	o.opcion, o.descripcion, o.ventana FROM opcion o JOIN opcion_x_grupo og ON o.sistema = og.sistema AND o.opcion = og.opcion WHERE o.sistema = $1 AND og.grupo_usuario = $2 ORDER BY o.secuencia`, [sistema, grupo.rows[0].grupo_usuario ]);
        return rows;
      }
    } catch (e) {
      throw e;
    }
  }

}
