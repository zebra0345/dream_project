import axios from "axios";

// axios 인스턴스 생성
export const API_BASE_URL = 'http://localhost:8080';
export const FASTAPI_BASE_URL = 'http://localhost:8000';
export const WS_FASTAPI_BASE_URL = 'ws://localhost:8000';
// export const API_BASE_URL = 'https://dreammoa.duckdns.org/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  // baseURL: "http://dreammoa.duckdns.org:8080", 배포 url
  withCredentials: false, 
  headers: {
    Accept: "application/json",
  },
});

// ✅ 🔥 추가한 코드: Authorization 헤더 추가 (기존 코드 영향 없음)
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



// Response Interceptor - token refresh 처리

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // access token 만료로 인한 401 에러이고, 아직 재시도하지 않은 요청일 경우
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;  // 재시도 표시
      
      try {
        const refreshToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('refresh_token='))
          ?.split('=')[1];

        // refresh 토큰으로 새로운 access 토큰 발급 요청  
        const response = await axios.post(
          `${API_BASE_URL}/refresh`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${refreshToken}`
            }
          }
        );

        // 새로운 access 토큰 저장
        const newAccessToken = response.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        console.log("access재발급 성공");
        
        
        // 실패했던 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log("실패했던 요청 재시도");
        
        return api(originalRequest);
      } catch (refreshError) {
        // refresh 토큰도 만료되었거나 유효하지 않은 경우
        localStorage.removeItem("accessToken");
        // 사용자에게 알림
        // alert("로그인이 만료되었습니다. 다시 로그인해 주세요.");
        // 현재 URL을 state로 전달하여 로그인 후 원래 페이지로 돌아올 수 있게 함
        window.location.href = `/login?redirect=${window.location.pathname}`;
        // 로그인 페이지로 리다이렉트 등 추가 처리
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
