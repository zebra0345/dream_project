import { useRecoilState, useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { authState, userState } from '../recoil/atoms/authState';
import { authApi } from '../services/api/authApi';
import { authLoadingState } from '../recoil/atoms/authLoadingState';
import getUserApi from '../services/api/getUserApi';

const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const [isLoading, setIsLoading] = useRecoilState(authLoadingState);
  const navigate = useNavigate();
  const setUserInfo = useSetRecoilState(userState);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("initialize");
      try {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken && !auth.isAuthenticated) {
          
          setAuth({
            isAuthenticated: true,
            accessToken: storedToken
          });
          
        }
      } finally {
        setIsLoading(false);  // 인증 상태 확인 완료
      }
    };

    initializeAuth();
  }, [auth]);

  useEffect(() => {
    // console.log('Updated auth state:', auth);
  }, [auth]);


  // 로그인 함수
  const login = async (credentials) => {
    try {
      // 로그인 응답
      const loginResponse = await authApi.login(credentials);
      if (!loginResponse?.accessToken) {
        return { success: false, error: '로그인에 실패했습니다.' };
      }
  
      // 로그인 성공 시 토큰 저장
      setAuth({
        isAuthenticated: true,
        accessToken: loginResponse.accessToken
      });
  
      try {
        // 유저 정보 가져오기
        const userResponse = await getUserApi.getUserInfo();
        setUserInfo(userResponse.data);

        return { success: true };
      } catch (userError) {
        // 유저 정보 가져오기 실패 시 처리
        return {
          success: false,
          error: '사용자 정보를 가져오는데 실패했습니다.'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '로그인 중 오류가 발생했습니다.'
      };
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      console.log("hooks 로그아웃함수실행");
      await authApi.logout();
    } catch (error) {
      console.error('로그아웃 안됨' , error)
    } finally {
      setAuth({
        isAuthenticated: false,
        accessToken: null
      });
      setUserInfo(null)
      localStorage.setItem('socialLoginPending', 'false');
      localStorage.setItem('socialLoginDependency', 'false');
      navigate('/login');
    }
  };

  // 인증 상태 확인 함수
  const checkAuth = () => {
    console.log("인증상태체크");
    
    // 쿠키를 객체로 변환
    const cookies = Object.fromEntries(
      document.cookie.split(';')
        .map(cookie => {
          const [name, value] = cookie.trim().split('=');
          return [name, value];
        })
    );
    
    // console.log("Cookies:", cookies);
    return (auth.isAuthenticated && auth.accessToken) || cookies.access_token;
  }; 

  // 로그인 상태에서 접근 불가능한 페이지 처리 (예: 로그인 페이지)
  const redirectIfAuthenticated = (path = '/') => {
    if (checkAuth()) {
      navigate(path);
      return true;
    }
    return false;
  };

  // 비로그인 상태에서 접근 불가능한 페이지 처리
  const requireAuth = (path = '/login') => {
    if (!checkAuth()) {
      navigate(path);
      return false;
    }
    return true;
  };

  return {
    auth,
    login,
    logout,
    checkAuth,
    redirectIfAuthenticated,
    requireAuth
  };
};

export default useAuth;