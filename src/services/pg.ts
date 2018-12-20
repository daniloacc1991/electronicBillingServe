import * as configEnv from 'config';
import { Pool, PoolConfig } from 'pg';

export class ModelPg {

  // constructor () {}

  public pg () {
    const config: PoolConfig = {
      application_name: configEnv.get('db.application_name'),
      database: configEnv.get('db.database'),
      host:  configEnv.get('db.host'),
      max: 5,
      min: 1,
      password: configEnv.get('db.password'),
      port: configEnv.get('db.port'),
      user: configEnv.get('db.user'),
    };
    return new Pool(config);
  }

  // public json_to_text (obj) {
  //   let text = '';
  //   if (obj.length > 1) {
  //     obj.forEach(function (elm, i, array) {
  //       if (elm != null && elm != false) {
  //         text += `'${JSON.stringify(elm)}'`;
  //       }
  //     });
  //     text = text.slice(0, -1);
  //   } else {
  //     text = `'${JSON.stringify(obj)}'`;
  //   }
  //   return text;
  // }

}
