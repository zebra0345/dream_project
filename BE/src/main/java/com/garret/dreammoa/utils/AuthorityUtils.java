package com.garret.dreammoa.utils;

import com.garret.dreammoa.domain.model.UserEntity;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

// 역할만 추출합니다.(admin or user)
public class AuthorityUtils {
    public static UserEntity.Role extractRoleFromAuthorities(Collection<? extends GrantedAuthority> authorities) {
        return authorities.stream()
                .findFirst() // 첫 번째 권한을 가져옴
                .map(GrantedAuthority::getAuthority) // 권한 이름 추출 (예: "ROLE_USER")
                .map(role -> UserEntity.Role.valueOf(role.replace("ROLE_", ""))) // Enum으로 변환
                .orElseThrow(() -> new IllegalArgumentException("Invalid authorities"));
    }
}