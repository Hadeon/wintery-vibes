import {
  EventEmitter
} from 'events';
import auth0 from 'auth0-js';
import {
  AUTH_CONFIG
} from './auth0-variables';
import history from '../history';

export default class Auth extends EventEmitter {
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: 'https://${AUTH_CONFIG.domain}/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile'
  })
}