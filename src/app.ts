import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import * as expressStatusMonitor from 'express-status-monitor';
import * as helmet from 'helmet';
import * as methodOverride from 'method-override';
import * as morgan from 'morgan';
import * as path from 'path';
import * as passport from 'passport';
import * as configEnv from 'config';

// import session = require('cookie-session');

import { NextFunction, Request, Response } from 'express';
import { DateTime, Settings } from 'luxon';

import { log } from './services';
import { UserRoutes } from './components/users';
import { ComfiarRoutes } from './components/comfiar';
import { FacturaRoutes } from './components/factura';
import { NotaRoutes } from './components/nota';

Settings.defaultZoneName = 'America/Bogota';

export class Server {

  public static bootstrap (): Server {
    return new Server();
  }

  public app: express.Application;

  constructor () {
    dotenv.config();
    // Create express Application
    this.app = express();

    // Configure Application
    this.config();

    // Add Routes
    this.routes();
  }

  public config () {
    // Enable Cross-Origin Resource Sharing
    this.app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
    // Mount Logger
    this.app.use(morgan('dev'));
    // use json form parser Middleware
    this.app.use(bodyParser.json({ limit: '50mb'}));
    // use query string parser Middleware
    this.app.use(bodyParser.urlencoded({
      extended: true,
      limit: '50mb'
    }));

    // Folder Static
    this.app.use(express.static(path.join(__dirname, '..', 'public')));

    // use cookie parser Middleware
    this.app.use(cookieParser(configEnv.get('API_KEY')));

    // use override Middleware
    this.app.use(methodOverride());
    this.app.use(expressStatusMonitor());

    // catch 404 and forward to error handler
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      err.status = 404;
      next(err);
    });

    // error handling
    this.app.use(errorHandler());

    // helmet
    this.app.use(helmet());

    // session
    // this.app.use(session({
    //   domain: 'localhost',
    //   httpOnly: true,
    //   keys: [configEnv.get('API_KEY')],
    //   name: 'session',
    //   secure: true,
    // }));

    // passport
    this.app.use(passport.initialize());
    this.app.use(passport.session());

  }

  private routes () {
    const router = express.Router();
    // Middleware
    router.use((req: Request, res: Response, next: NextFunction) => {
      const now = DateTime.local();
      const date = now.toFormat('DD-MM-yyyy HH:mm:ss');
      log.info('%s %s %s', req.method, req.url, date);
      next();
    });
    UserRoutes.create(router);
    ComfiarRoutes.create(router);
    FacturaRoutes.create(router);
    NotaRoutes.create(router);
    this.app.use('/' + configEnv.get('version'), router);
  }

}
