package com.garret.dreammoa.domain.dto.user.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class NicknameCheckResponse {
    private boolean available; // 닉네임 사용 가능 여부
}
