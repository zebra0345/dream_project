package com.garret.dreammoa.domain.dto.user.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckNicknameRequest {
    @NotEmpty(message = "Nickname은 필수입니다.")
    @Size(min = 2, max = 12, message = "Nickname은 2~12글자여야 합니다.")
    @Pattern(
            regexp = "^[가-힣A-Za-z]{2,12}$",
            message = "Nickname은 영어와 한글만 허용되며 2~12글자여야 합니다."
    )
    private String nickname;
}