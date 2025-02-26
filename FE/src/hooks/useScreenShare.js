// hooks/useScreenShare.js
import { useState, useCallback } from "react";
import { videoApi } from "../services/api/videoApi"; // 추가

const useScreenShare = (session, publisher, OV) => {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenPublisher, setScreenPublisher] = useState(null);
  const [screenSession, setScreenSession] = useState(null); // 화면공유 세션 상태 추가

  const startScreenShare = useCallback(async () => {
    if (!session || isScreenSharing) return;

    try {
      // 1. 화면공유용 더미 세션 생성
      const screenSession = OV.current.initSession();

      // 2. 화면공유용 토큰 발급 (더미 유저용)
      const screenToken = await videoApi.getToken(session.sessionId);

      // 세션 종료 이벤트 핸들러 추가
      screenSession.on("sessionDisconnected", () => {
        setIsScreenSharing(false);
        setScreenPublisher(null);
        setScreenSession(null);
      });

      // 3. 화면공유용 Publisher 초기화
      const screenPublisher = await OV.current.initPublisherAsync(undefined, {
        videoSource: "screen",
        audioSource: false,
        publishVideo: true,
        publishAudio: false,
        resolution: "1920x1080",
        frameRate: 30,
        insertMode: "APPEND",
        mirror: false,
      });

      // 4. 화면 공유 권한 허용 시 처리
      screenPublisher.once("accessAllowed", async () => {
        try {
          // 화면 공유 중단 감지
          screenPublisher.stream
            .getMediaStream()
            .getVideoTracks()[0]
            .addEventListener("ended", () => {
              console.log("사용자가 화면 공유를 중지했습니다");
              stopScreenShare();
            });
          // streamDestroyed 이벤트 핸들러 추가
          screenPublisher.on('streamDestroyed', () => {
            stopScreenShare();
          });

          // 5. 더미 유저로 세션 연결
          await screenSession.connect(screenToken, {
            clientData: JSON.stringify({
              isScreenShare: true,
              originalUserName: JSON.parse(session.connection.data).clientData,
            }),
          });

          // 6. 화면 공유 스트림 게시
          await screenSession.publish(screenPublisher);

          setIsScreenSharing(true);
          setScreenPublisher(screenPublisher);
          setScreenSession(screenSession);
        } catch (error) {
          console.error("화면 공유 게시 중 오류:", error);
          await stopScreenShare();
        }
      });

      screenPublisher.once("accessDenied", async (error) => {
        console.warn("화면 공유가 거부됨:", error);
        await stopScreenShare();
      });
    } catch (error) {
      console.error("화면 공유 시작 중 오류:", error);
      await stopScreenShare();
    }
  }, [session, isScreenSharing, OV]);

  const stopScreenShare = useCallback(async () => {
    try {
      if (screenPublisher && screenSession) {
        // 화면 공유 트랙 중지
        screenPublisher.stream
          .getMediaStream()
          .getTracks()
          .forEach((track) => track.stop());
        // 스트림 제거 전에 발행 중단
        await screenSession.unpublish(screenPublisher);
        
        // 세션 연결 해제 전에 모든 이벤트 리스너 제거
        screenPublisher.off('streamDestroyed');
        screenSession.off('sessionDisconnected');
        
        // 세션 연결 해제
        screenSession.disconnect();
      }
    } catch (error) {
      console.error("화면 공유 중지 중 오류:", error);
    } finally {
      setIsScreenSharing(false);
      setScreenPublisher(null);
      setScreenSession(null);
    }
  }, [screenSession, screenPublisher]);

  return {
    isScreenSharing,
    startScreenShare,
    stopScreenShare,
    screenPublisher,
  };
};

export default useScreenShare;
