    package com.garret.dreammoa.domain.dto.user.request;

    import jakarta.validation.constraints.Email;
    import jakarta.validation.constraints.NotEmpty;
    import jakarta.validation.constraints.Pattern;
    import lombok.Getter;
    import lombok.Setter;

    @Getter @Setter
    public class LoginRequest {
        @Email(message = "유효한 이메일 형식이어야 합니다.")
        @NotEmpty(message = "Email은 필수입니다.")
        private String email;

        @NotEmpty(message = "Password는 필수입니다.")
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&]).{8,16}$",
                message = "비밀번호는 영어, 숫자, 특수문자를 모두 포함하여 8~16자여야 합니다."
        )
        private String password;
    }
