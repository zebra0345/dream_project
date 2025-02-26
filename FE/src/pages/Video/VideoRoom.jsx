import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import VideoControls from "/src/components/video/VideoControls";
import VideoGrid from "/src/components/video/VideoGrid";
import TestErrorAlert from "/src/components/video/TestErrorAlert";
import TestLoadingSpinner from "/src/components/video/TestLoadingSpinner";
import useOpenVidu from "../../hooks/useOpenVidu";
import ChatPanel from "../../components/video/chat/ChatPanel";
import VideoSettingForm from "../../components/video/VideoSettingForm";
import FocusAnalysis from "../../components/video/analysis/FocusAnalyzer"; // ✅ 웹소켓 테스트용
import TimerModal from "../../components/challenge/challengeModal/TimerModal";
import { WS_FASTAPI_BASE_URL } from "../../services/api/axios";
// import EndButton from "/src/components/challenge/finish/EndButton";


// const SERVER_URL = "ws://localhost:8000/focus"; // ✅ WebSocket 서버 주소
const SERVER_URL = WS_FASTAPI_BASE_URL; // ✅ WebSocket 서버 주소

const VideoRoom = () => {
  // 사용자 입력 상태
  const { roomId } = useParams();
  // const [myUserName, setMyUserName] = useState('');// 유저이름  VideoJoinForm 버전 // 테스트코드
  // const [mySessionRoomName, setMySessionRoomName] = useState('');// 방이름 VideoJoinForm 버전 // 테스트코드
  const [isChatOpen, setIsChatOpen] = useState(false); // 채팅창 on off
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const dummySessionRoomName = roomId || "106"; // 이거 챌린지 선택했을때 가져와야됨.
  const dummyUserName = userInfo?.nickname || "Guest";
  // const dummyUserName = "namhui" // 테스트코드

  // 전체화면 관련 상태와 ref 추가
  const [currentLayout, setCurrentLayout] = useState("grid"); // 레이아웃 상태
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRoomRef = useRef(null);
  // 전체화면 토글 함수
  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await videoRoomRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };
  // 전체화면 변경 이벤트 감지
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // OpenVidu hook에서 정의한 함수 전부 가져와서 사용
  const {
    session,
    mainStreamManager,
    publisher,
    subscribers,
    connectSession,
    disconnectSession,
    updateMainStreamManager,
    isLoading,
    error,
    clearError,
    // 화면 공유
    isScreenSharing,
    startScreenShare,
    stopScreenShare,
    screenPublisher,
    screenTime,
    pureStudyTime,
  } = useOpenVidu();

  // ✅ 웹소켓에서 받은 데이터 처리
  const handleWebSocketData = (data) => {
    console.log("📡 WebSocket에서 받은 데이터:", data);
  };

  // ✅ 세션 참가 핸들러
  const handleJoinSession = async () => {
    try {
      await connectSession(dummySessionRoomName, dummyUserName);
    } catch (error) {
      console.error("세션 참가 실패:", error);
    }
  };

  // 화면 공유 토글 핸들러
  const handleToggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await stopScreenShare();
      } else {
        await startScreenShare();
      }
    } catch (error) {
      console.error("화면 공유 토글 실패:", error);
    }
  };

  // ✅ 언마운트 시 WebRTC 세션 종료
  useEffect(() => {
    return () => {
      disconnectSession();
    };
  }, [disconnectSession]);

  return (
    // <div className="w-full h-full bg-gray-900 text-white p-4"> // 테스트코드
    // <div className="w-full h-screen bg-gray-900 text-white p-4"> // 테스트코드
    <div className="w-full h-screen bg-gray-900 text-white">
      {" "}
      {/* h-full -> h-screen으로 변경 */}
      {/* 로딩페이지 */}
      {isLoading && <TestLoadingSpinner />}
      {/* 에러페이지 */}
      {error && <TestErrorAlert message={error} onClose={clearError} />}
      {!session ? (
        // 세션 연결 전: 설정 화면 표시
        <VideoSettingForm
          onJoin={handleJoinSession} // 참가하기위해 세션요청하고 토큰요청하는 함수
          isLoading={isLoading} // 로딩화면
        />
      ) : (
        // {/* <VideoJoinForm  // 입장화면
        //   myUserName={myUserName} // 내가 입력한 이름
        //   mySessionRoomName={mySessionRoomName} // 세션(방)이름
        //   onUserNameChange={setMyUserName} // 이름 변경시켜주는 함수
        //   onSessionNameChange={setMySessionRoomName} // 방이름 변경시켜주는 함수
        //   onJoin={handleJoinSession} // 참가하기위해 세션요청하고 토큰요청하는 함수
        //   isLoading={isLoading} // 로딩화면
        // /> */}
        // 세션 연결 후: 비디오 폼 표시
        // ☆★☆★☆★ 전체영역 ☆★☆★☆★
        <div
          className="w-full h-screen bg-gray-900 text-white"
          ref={videoRoomRef}
        >
          <div className="h-screen w-full flex flex-col overflow-auto">
            {/* ☆★ 상단10% 영역 ☆★ */}
            <div className="w-full h-[10%] bg-gray-900">
              <TimerModal
                screenTime={screenTime}
                pureStudyTime={pureStudyTime}
              />
            </div>
            {/* ☆★ 중앙 화면 영역 ☆★ */}
            <div className="w-full h-[80%] flex-grow  overflow-auto">
              <VideoGrid // 너와나의 비디오 위치 크기 등등
                mainStreamManager={mainStreamManager}
                publisher={publisher} // 내 화면
                subscribers={subscribers} // 친구들 화면
                screenPublisher={screenPublisher}
                onStreamClick={updateMainStreamManager} // 친구화면 클릭시 크게만드는 그런함수
                currentLayout={currentLayout}
              />
            </div>
            {/* ☆★ 하단10% 영역 ☆★ */}
            <div className="w-full h-[10%]  overflow-auto ">
              <VideoControls // 컨트롤러 (지금은 카메라전환 + 나가기버튼밖에 없음)
                publisher={publisher} // 내 화면
                subscribers={subscribers} // 친구들 화면
                onLeaveSession={disconnectSession} // 나가기 함수 매개변수로 넘겨줌
                currentLayout={currentLayout}
                session={session}
                sessionId={dummySessionRoomName}
                onLayoutChange={setCurrentLayout}
                // 화면공유 관련 props
                isScreenSharing={isScreenSharing}
                onToggleScreenShare={handleToggleScreenShare}
                isFullscreen={isFullscreen}
                onToggleFullscreen={handleToggleFullscreen}
                setIsChatOpen={setIsChatOpen} // 채팅창 on off
              />
            </div>
            {/* ☆★ z-index걸린 모달 영역 ☆★ */}
            <ChatPanel // 채팅창모달 (테스트하려고 입장화면에 넣어둠)
              session={session} // 세션상태
              sessionTitle={dummySessionRoomName} //방이름
              isChatOpen={isChatOpen} // 채팅창 on off
              setIsChatOpen={setIsChatOpen} // 채팅창 on off
            />
            {/* ✅ UI에 영향 없이 WebSocket 테스트 실행 */}
            <FocusAnalysis
              serverUrl={SERVER_URL}
              onDataReceived={handleWebSocketData}
            />
          </div>

        </div>
      )}
    </div>
  );
};

export default VideoRoom;
