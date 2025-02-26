package com.garret.dreammoa.domain.dto.user.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;
@Getter
@Setter
public class JoinRequest {

    @Email(message = "유효한 이메일 형식이어야 합니다.")
    @NotEmpty(message = "Email은 필수입니다.")
    private String email;

    @NotEmpty(message = "Password는 필수입니다.")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&]).{8,16}$",
            message = "비밀번호는 영어, 숫자, 특수문자를 모두 포함하여 8~16자여야 합니다."
    )
    private String password;

    @NotEmpty(message = "Name은 필수입니다.")
    @Size(min = 2, message = "Name은 최소 2글자 이상이어야 합니다.")
    @Pattern(
            regexp = "^[가-힣]{2,}$|^[A-Za-z]{2,}$",
            message = "Name은 한글로 2글자 이상 또는 영어로 2글자 이상이어야 합니다."
    )
    private String name;

    @NotEmpty(message = "Nickname은 필수입니다.")
    @Size(min = 2, max = 12, message = "Nickname은 2~12글자여야 합니다.")
    @Pattern(
            regexp = "^[가-힣A-Za-z]{2,12}$",
            message = "Nickname은 영어와 한글만 허용되며 2~12글자여야 합니다."
    )
    private String nickname;

    @AssertTrue(message = "이메일 인증이 필요합니다.")
    private boolean verifyEmail;
}