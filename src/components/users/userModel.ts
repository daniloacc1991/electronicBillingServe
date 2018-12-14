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
      const { rows } = await this._pg.query(`SELECT fn_verify_login($1, $2) AS user`, [user, password]);
      return ((!rows) ? {} : rows[0]);
    } catch (e) {
      throw e;
    }
  }

  public async pg_SaveToken (token: string, id: number) {
    try {
      const { rows } = await this._pg.query(`INSERT INTO user_token (token, id) VALUES($1, $2)`, [token, id]);
      return ((!rows) ? {} : rows[0]);
    } catch (e) {
      throw e;
    }
  }

  public async pg_verifyToken (token: string) {
    try {
      const { rows } = await this._pg.query(`SELECT * FROM user_token WHERE token = $1`, [token]);
      return ((!rows) ? {} : rows[0]);
    } catch (e) {
      throw e;
    }
  }

}
