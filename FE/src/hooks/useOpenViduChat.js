import { useState, useEffect, useCallback } from 'react';

  // ☆★☆★☆★ 채팅 관련 함수 ☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★

const useOpenViduChat = (session) => {
  // 채팅 메시지 상태 관리
  const [messages, setMessages] = useState([]);
  
  // localStorage에서 사용자 정보 가져오기
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // 메시지 전송 함수
  const sendMessage = useCallback((text) => {
    // 세션없거나 메세지없으면 안보냄
    if (!session || !text.trim()) return;

    // 메시지 객체 생성
    // ★ 참여자입장시 유저정보(이미지포함)를 recoil, session storage에 저장해두고 
    // ★ 메세지에서는 이미지 보내지 않고,
    // ★ 채팅받는 클라이언트가 userId에 맞춰서 유저정보(이미지)를 렌더링 하도록하는게 효율적일듯?
    const messageData = {
      type: 'chat',
      userId: userInfo.email,
      email: userInfo.email,
      nickname: userInfo.nickname,
      profilePictureUrl: userInfo.profilePictureUrl,
      text: text.trim(),
      timestamp: new Date().getTime(),
    };

    // OpenVidu signal을 통해 메시지 전송
    session.signal({
      type: 'chat',  // signal type
      data: JSON.stringify(messageData)  // 실제 전송할 데이터
    }).catch(error => {
      console.error('Error sending message:', error);
    });

    // 로컬 메시지 목록에 추가
    setMessages(prev => [...prev, messageData]);
  }, [session, userInfo]);

  // 메시지 수신 리스너 설정
  useEffect(() => {
    if (!session) return;
    // 메시지 수신 이벤트 핸들러
    const handleSignal = (event) => {
      // signal type이 'chat'인 경우에만 처리
      if (event.type === 'signal:chat') {
        const messageData = JSON.parse(event.data);
        // 자신이 보낸 메시지는 이미 추가되어 있으므로 건너뛰기
        if (messageData.userId !== userInfo.email) {
          setMessages(prev => [...prev, messageData]);
        }
      }
    };

    // 이벤트 리스너 등록
    session.on('signal:chat', handleSignal);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      session.off('signal:chat', handleSignal);
    };
  }, [session, userInfo]);

  // 메시지 목록 초기화 함수
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,      // 채팅 메시지 목록
    sendMessage,   // 메시지 전송 함수
    clearMessages  // 메시지 목록 초기화 함수
  };
};

export default useOpenViduChat;