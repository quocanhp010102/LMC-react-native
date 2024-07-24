import Keycloak from "keycloak-js";

const _kc = Keycloak('/keycloak.json');

/**
 * khởi tạo keycloak khi vừa vào ứng dụng

 */
const initKeycloak = (onAuthenticatedCallback:any) => {
  _kc.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
  })
    .then((authenticated: boolean) => {
      if (!authenticated) {
 
      }
      console.log(authenticated)
      onAuthenticatedCallback();
      return _kc;
    })
    .catch();
};

const doLogin = _kc.login;

const doLogout = _kc.logout;

const getToken = () => _kc.token;

const isLoggedIn = ():boolean => !!_kc.token;

const updateToken = (successCallback: any) =>
  _kc.updateToken(5)
    .then(successCallback)

    .catch(doLogin);

const getUsername = () => _kc.tokenParsed?.preferred_username;

const refreshToken = ()=> {
  _kc.onTokenExpired()
}
const isTokenExpired = ()=> _kc.isTokenExpired;

const refreshTokenSuccess = ()=>_kc.onAuthRefreshSuccess; 

const refreshTokenError = ()=> _kc.onAuthRefreshError;

const hasRole = (roles:any) => roles.some((role: any) => _kc.hasRealmRole(role));

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  refreshToken,
  isTokenExpired,
  refreshTokenSuccess,
  refreshTokenError,
  hasRole,
};

export default UserService;
