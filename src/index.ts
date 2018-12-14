import * as config from 'config';
import { Server } from './app';

// // create http server
// console.log(config.get('port'));

export const app = Server.bootstrap().app;
export const server = app.listen(config.get('port'), config.get('host'), () => {
  // tslint:disable-next-line:no-console
  console.log(`Listen for port: ${config.get('port')}`);
});
