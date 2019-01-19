import * as configEnv from 'config';
import * as passport from 'passport';

import { verify } from 'jsonwebtoken';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { Strategy as localStrategy } from 'passport-local';

import { UserModel } from '../components/users';
import { log } from './';

passport.use('local-user', new localStrategy({ passwordField: 'pass', usernameField: 'user' }, (user, pass, done) => {
  const _userModel = new UserModel();
  const password = pass.replace(new RegExp(' ', 'g'), '+');
  _userModel.pg_login(user, password)
    .then(u => {
      console.log(u);
      if (!u) {
        return done(null, false);
      }
      console.log(configEnv.get('sistema'));
      console.log(u.usuario);
      _userModel.pg_perfil(configEnv.get('sistema'), u.usuario)
        .then(perfil => {
          u.scope = perfil.grupo_usuario;
          console.log(u);
          return done(null, u);
        })
        .catch((e) => {
          done(e.stack);
        });
    })
    .catch((err) => {
      done(err.stack);
    });
}));

passport.use('bearer', new BearerStrategy((token, done) => {
  const _userModel = new UserModel();
  _userModel.pg_verifyToken(token)
    .then((id) => {
      verify(token, process.env.API_KEY, (err, decoded: any) => {
        if (err) {
          log.error(err);
          return done(err);
        }
        if (decoded) {
          log.info(decoded);
          log.info(decoded.scope);
          done(null, decoded, { message: 'Valid Access', scope: decoded.scope });
        }
      });
    })
    .catch((err) => {
      done(err.stack);
    });
}));

export let isAuthenticated = passport.authenticate(['bearer'], { session: false });
export let isAuthenticatedLocalClient = passport.authenticate('local-user', { session: false });
