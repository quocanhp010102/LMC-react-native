import React from "react";
import {LogBox} from "react-native";
import {Provider} from "react-redux";
import {store} from "./src/app/store";
import {ThemeManagerProvider} from "./src/hooks/themes";
import Routes from "./src/navigation";
import "react-native-gesture-handler";
import {AuthServices, keycloak} from "./src/services/keycloak/authServic";
import {ReactNativeKeycloakProvider} from "@react-keycloak/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {KEYS} from "./src/constants/key";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs();

function App() {

    const {initKeycloak} = AuthServices()

    return (
        <Provider store={store}>
            <ReactNativeKeycloakProvider
                authClient={keycloak}
                initOptions={initKeycloak}
                onEvent={(event, error) => {
                    console.log('Keycloak event :', event, error);
                }}
                isLoadingCheck={keycloak => {
                    console.log('Authenticated', keycloak.authenticated);
                    console.log('token', keycloak.token);
                    return !keycloak.authenticated;
                }}
                autoRefreshToken={true}
                onTokens={tokens => {
                    if (tokens.token && tokens.refreshToken) {
                        AsyncStorage.setItem(KEYS.TOKEN, tokens.token);
                        AsyncStorage.setItem(
                            KEYS.REFRESH_TOKEN,
                            tokens.refreshToken
                        );
                    }
                }}

            >
                <ThemeManagerProvider>
                    <Routes/>
                </ThemeManagerProvider>
            </ReactNativeKeycloakProvider>
        </Provider>

    );
}

export default App;
