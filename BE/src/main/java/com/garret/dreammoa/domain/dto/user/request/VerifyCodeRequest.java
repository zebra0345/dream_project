package com.garret.dreammoa.domain.dto.user.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyCodeRequest {

    @Email(message = "유효한 이메일 형식이어야 합니다.")
    @NotEmpty(message = "Email은 필수입니다.")
    private String email;

    @NotEmpty(message = "인증 코드는 필수입니다.")
    private String code;
}