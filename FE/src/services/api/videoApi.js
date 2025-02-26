import api from "./axios";

export const videoApi = {
  // OpenVidu 연결에 필요한 토큰을 발급받는 메서드 (아래 2개 함수 사용함)
  async getToken(sessionId) {
    // 1. 먼저 세션을 생성하고
    const createdSessionId = await this.createSession(sessionId);
    // 2. 생성된 세션을 기반으로 토큰을 발급받아 반환
    return await this.createToken(createdSessionId);
  },

  //  OpenVidu 세션을 생성하는 메서드
  //  sessionId - 생성할 세션의 ID
  //  response.data - 생성된 세션 ID
  async createSession(sessionId) {
    try {
      const response = await api.post(
        "/openvidu/sessions",
        { customSessionId: sessionId }  // 커스텀 세션 ID를 서버에 전달
      );
      return response.data;  // 서버로부터 받은 세션 ID 반환
    } catch (error) {
    // 이미 존재하는 세션인 경우 해당 세션 ID를 반환
    if (error.response?.status === 409) {
      return sessionId;
    }
    throw error;
    }
  },

  // 특정 세션에 대한 연결 토큰을 생성하는 메서드
  // sessionId - 토큰을 발급받을 세션 ID
  // response.data - 발급된 연결 토큰
  async createToken(sessionId) {
    const response = await api.post(`/openvidu/sessions/${sessionId}/connections`,{});// {} : 현재는 추가 옵션 없음
    return response.data; // 서버로부터 받은 연결 토큰 반환
  },
};
