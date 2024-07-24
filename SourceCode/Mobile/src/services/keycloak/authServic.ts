import {RNKeycloak, useKeycloak} from '@react-keycloak/native';

export const keycloak = new RNKeycloak({
    url: 'https://hanquochoc.edu.vn/auth',
    realm: 'hcm',
    clientId: 'hcm',
});

export const AuthServices = () => {
    const {keycloak} = useKeycloak();

    const initKeycloak = {
        redirectUri: 'hcm://login',
        endpoints: 'realms/hcm/protocol/openid-connect',
        enableLogging: true,
        inAppBrowserOptions: {}
    };

    const doLogin = () => keycloak?.login();

    const doLogout = (redirectUri?: string) => {
        keycloak?.clearToken();
        keycloak?.logout()
    }
    const doLoginGoogle = (callback : () => void ) => {
        keycloak?.login({
            idpHint: 'google',
            prompt: 'login',
            locale: 'en',
            scope: 'profile',
            onLoad: 'check-sso',
            pkceMethod: 'S256',
        }).then(() => {
            callback()
        })
    };
    const doLoginFacebook = () => {
        keycloak?.login({idpHint: 'facebook', locale: 'en'});
    };

    const isLoggedIn = (): boolean => !!keycloak?.token;

    const updateToken = (successCallback: any) =>
        keycloak
            ?.updateToken(5)
            .then(successCallback)
            .catch(doLogin);

    const isTokenExpired = () => keycloak?.isTokenExpired;

    const refreshToken = () => {
        keycloak?.onTokenExpired?.();
    };
    const refreshTokenSuccess = () => keycloak?.onAuthRefreshSuccess;

    const refreshTokenError = () => keycloak?.onAuthRefreshError;

    const getTokenParsed = () => keycloak?.tokenParsed;

    const hasRole = (roles: any) =>
        roles.some((role: any) => keycloak?.hasRealmRole(role));

    const getUsername = () => keycloak?.tokenParsed?.session_state;

    const authenticated = keycloak?.authenticated;
    return {
        initKeycloak,
        doLogin,
        doLoginFacebook,
        doLoginGoogle,
        doLogout,
        getTokenParsed,
        getUsername,
        isLoggedIn,
        hasRole,
        refreshToken,
        refreshTokenError,
        refreshTokenSuccess,
        isTokenExpired,
        updateToken,
        authenticated,
        keycloak
    };
};
