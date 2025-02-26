package com.garret.dreammoa.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.util.SerializationUtils;

import java.util.Base64;

public class CookieUtil {

    public static void addCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/"); // 모든 경로에서 쿠키 사용 가능
        cookie.setMaxAge(maxAge); // 쿠키 만료 시간 설정
        cookie.setHttpOnly(false); // 일반 쿠키이므로 HttpOnly 속성 사용하지 않음
        response.addCookie(cookie);
    }


    public static void addHttpOnlyCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/"); // 모든 경로에서 쿠키 사용 가능
        cookie.setHttpOnly(true); // HttpOnly 속성 활성화
        cookie.setSecure(true); // HTTPS 환경에서만 사용
        cookie.setMaxAge(maxAge); // 쿠키 만료 시간 설정
        response.addCookie(cookie);
    }

    public static void deleteCookie(HttpServletRequest request, HttpServletResponse response, String name) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return; // 쿠키가 없으면 작업 중단
        }

        for (Cookie cookie : cookies) {
            if (name.equals(cookie.getName())) {
                cookie.setValue(""); // 쿠키 값을 비움
                cookie.setPath("/"); // 경로 설정
                cookie.setMaxAge(0); // 즉시 만료
                response.addCookie(cookie);
            }
        }
    }


    public static String serialize(Object obj) {
        return Base64.getUrlEncoder()
                .encodeToString(SerializationUtils.serialize(obj));
    }


    public static <T> T deserialize(Cookie cookie, Class<T> cls) {
        try {
            return cls.cast(
                    SerializationUtils.deserialize(
                            Base64.getUrlDecoder().decode(cookie.getValue())
                    )
            );
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Failed to deserialize cookie value", e);
        }
    }
}
