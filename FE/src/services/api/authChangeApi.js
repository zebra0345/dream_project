import api from './axios';


const authChangeApi = {
  checkUserEmail: async (name , nickname) => {
    try {
      const response = await api.post('/email-find', { name , nickname });
      console.log('이메일 확인 응답:', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // 서버가 응답을 반환했지만 2xx 범위를 벗어난 상태 코드인 경우
        console.log(name,nickname);
        console.error('서버 에러:', error.response.data);
        throw new Error(error.response.data.message || '이메일 확인 중 오류가 발생했습니다.');
      } else if (error.request) {
        // 요청이 이루어졌으나 응답을 받지 못한 경우
        console.error('네트워크 에러:', error.request);
        throw new Error('네트워크 연결을 확인해주세요.');
      } else {
        // 요청 설정 중에 오류가 발생한 경우
        console.error('에러:', error.message);
        throw error;
      }
    }
  },
  checkUserPassword: async (email) => {
    try {
      const response = await api.post('/pw-find', { email });
      console.log('비밀번호 찾기위해 이메일로 인증번호 보냄 :', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // 서버가 응답을 반환했지만 2xx 범위를 벗어난 상태 코드인 경우
        console.log(email);
        console.error('서버 에러:', error.response.data);
        throw new Error(error.response.data.message || '이메일 확인 중 오류가 발생했습니다.');
      } else if (error.request) {
        // 요청이 이루어졌으나 응답을 받지 못한 경우
        console.error('네트워크 에러:', error.request);
        throw new Error('네트워크 연결을 확인해주세요.');
      } else {
        // 요청 설정 중에 오류가 발생한 경우
        console.error('에러:', error.message);
        throw error;
      }
    }
  },
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    try {
      const response = await api.put('/update-password', { currentPassword, newPassword , confirmPassword });
      console.log('비밀번호 변경 응답 :', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // 서버가 응답을 반환했지만 2xx 범위를 벗어난 상태 코드인 경우
        console.error('서버 에러:', error.response.data);
        throw new Error(error.response.data.message || '비밀번호 변경 중 오류가 발생했습니다.');
      } else if (error.request) {
        // 요청이 이루어졌으나 응답을 받지 못한 경우
        console.error('네트워크 에러:', error.request);
        throw new Error('네트워크 연결을 확인해주세요.');
      } else {
        // 요청 설정 중에 오류가 발생한 경우
        console.error('에러:', error.message);
        throw error;
      }
    }
  },
  realCheckPassword: async (password) => {
    try {
      const response = await api.post('/check-password', { password });
      console.log('이메일 확인 응답:', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // 서버가 응답을 반환했지만 2xx 범위를 벗어난 상태 코드인 경우
        console.log(password);
        console.error('서버 에러:', error.response.data);
        throw new Error(error.response.data.message || '이메일 확인 중 오류가 발생했습니다.');
      } else if (error.request) {
        // 요청이 이루어졌으나 응답을 받지 못한 경우
        console.error('네트워크 에러:', error.request);
        throw new Error('네트워크 연결을 확인해주세요.');
      } else {
        // 요청 설정 중에 오류가 발생한 경우
        console.error('에러:', error.message);
        throw error;
      }
    }
  },
};

export default authChangeApi;