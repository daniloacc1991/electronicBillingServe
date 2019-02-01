import * as config from 'config';
// import * as https from 'https';
// import * as path from 'path';
// import { readFileSync } from 'fs';
import { Server } from './app';

// Certificate
// const privateKey = readFileSync(path.join(__dirname, '..', 'server-key.pem'), 'utf8');
// const certificate = readFileSync(path.join(__dirname, '..', 'server-cert.pem'), 'utf8');
// const ca = readFileSync(path.join(__dirname, '..', 'server-csr.pem'), 'utf8');

// const credentials = {
//   key: privateKey,
//   cert: certificate,
// };

// export const httpsServer = https.createServer(credentials, Server.bootstrap().app);
// export const server = httpsServer.listen(443, config.get('host'), () => {
//   console.log(`Listen for host: ${config.get('host')} - port: ${config.get('port')}`);
//   console.log('HTTPS Server running on port 443');
// });

export const app = Server.bootstrap().app;
export const server = app.listen(config.get('port'), config.get('host'), () => {
  // tslint:disable-next-line:no-console
  console.log(`Listen for host: ${config.get('host')} - port: ${config.get('port')}`);
});
