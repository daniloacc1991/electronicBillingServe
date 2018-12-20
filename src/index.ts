import * as config from 'config';
import { Server } from './app';

export const app = Server.bootstrap().app;
export const server = app.listen(config.get('port'), config.get('host') , () => {
  // tslint:disable-next-line:no-console
  console.log(`Listen for host: ${config.get('host')} - port: ${config.get('port')}`);
});
