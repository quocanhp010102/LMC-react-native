package com.aladin.service.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public class AuthenticateUltil {
    public static String getLoginByCurrentLogin(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String login= (String) ((JwtAuthenticationToken) authentication)
                                                                    .getToken()
                                                                    .getClaims()
                                                                    .get("preferred_username");
        return login;
    }
}
