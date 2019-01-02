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

}
