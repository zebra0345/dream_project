package com.garret.dreammoa.domain.dto.user.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenResponse {
    private String accessToken; // accessToken
    private String refreshToken; // refreshToken

    public TokenResponse(String accessToken, String refreshToken ) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
