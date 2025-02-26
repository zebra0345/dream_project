// hooks/useOpenVidu.js
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import { videoApi } from "../services/api/videoApi";
import useScreenShare from "./useScreenShare";
import { useNavigate } from "react-router-dom";
import challengeApi from "../services/api/challengeApi";
import api from "../services/api/axios";
import { useRecoilValue } from "recoil";
import { currentPureTimeState, currentScreenTimeState, isMyChallengeSuccessedState } from "../recoil/atoms/ai/aiState";
// import {
//   enterChallenge,
//   exitChallenge,
//   formatDate,
// } from "../services/api/studyTimeApi"; 

export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const useOpenVidu = () => {
  // 상태 관리
  const { challengeId } = useParams();
  const [session, setSession] = useState(undefined); // OpenVidu 세션 객체
  const [mainStreamManager, setMainStreamManager] = useState(undefined); // 메인 화면에 표시될 스트림
  const [publisher, setPublisher] = useState(undefined); // 자신의 비디오 스트림
  const [subscribers, setSubscribers] = useState([]); // 다른 참가자들의 스트림 배열
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null); // 현재 사용 중인 카메라 장치
  const [isLoading, setIsLoading] = useState(false); // 로딩상태관리
  const [error, setError] = useState(null); // 에러상태관리
  const [sessionName, setSessionName] = useState(null); // 방번호
  const navigate = useNavigate();
  // 타이머 관련 상태
  const [screenTime, setScreenTime] = useState(0);
  const [pureStudyTime, setPureStudyTime] = useState(0);
  const screenTimeForEnding = useRecoilValue(currentScreenTimeState);
  const pureTimeForEnding = useRecoilValue(currentPureTimeState);
  const isMyChallengeSuccessed = useRecoilValue(isMyChallengeSuccessedState);
  // const [challengeLogId, setChallengeLogId] = useState(null);

  // ▽▼▽▼▽ 기본 함수(환경설정 및 세션연결 등) (57 Line부터 실사용기능 함수나옴) ▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼

  // 에러 초기화 함수
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // OpenVidu 객체는 useRef로 관리
  const OV = useRef(new OpenVidu());
  // 개발환경인 경우
  OV.current.setAdvancedConfiguration({
    websocket: `wss://dreammoa.duckdns.org/openvidu`, // /443 제거
    mediaServer: "https://dreammoa.duckdns.org/openvidu", // 포트 수정
    iceServers: [
      { urls: ["stun:stun.l.google.com:19302"] },
      // TURN 서버 추가가 필요할 수 있습니다
    ],
    forceTurn: false,
    timeout: 60000, // 타임아웃 시간 증가
  });
  // 배포 환경
  // OV.current.setAdvancedConfiguration({
  //   websocket: `wss://dreammoa.duckdns.org:443/openvidu`,
  //   mediaServer: 'http://dreammoa.duckdns.org:8080'
  // });

  // 과거 은창이가 만든 세션토큰함수라서 이제 안씀
  // const getToken = async (sessionId) => {
  //   return await videoApi.getToken(sessionId);
  // };

  // ▽▼▽▼▽▼▽▼▽▼▽▼▽▼ 아래 부터가 진짜 기능들 ▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼

  // ☆★☆★☆★ 세션 연결 함수 (방생성 방참가) ☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
  const connectSession = useCallback(async (sessionName, userName) => {
    setIsLoading(true);
    setError(null);
    setSessionName(sessionName);

    try {
      // 챌린지 입장하면서 API 호출
      // const challengeResponse = await enterChallenge(
      //   sessionName,
      //   formatDate(new Date())
      // );
      // if (challengeResponse.challengeLogId) {
      //   setChallengeLogId(challengeResponse.challengeLogId);
      //   setPureStudyTime(challengeResponse.pureStudyTime || 0);
      //   setScreenTime(challengeResponse.screenTime || 0);
      // }

      const mySession = OV.current.initSession();
      // Base64로 userName 인코딩
      const encodedUserName = btoa(unescape(encodeURIComponent(userName)));

      // 다른 참가자의 스트림이 생성될 때 : 스트림 생성 이벤트 핸들러
      mySession.on("streamCreated", (event) => {
        const subscriber = mySession.subscribe(event.stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);
      });

      // 참가자가 나갈 때 : 스트림 제거 이벤트 핸들러
      mySession.on("streamDestroyed", (event) => {
        setSubscribers((prev) =>
          prev.filter((sub) => sub !== event.stream.streamManager)
        );
      });

      // 예외 처리 핸들러
      mySession.on("exception", (exception) => {
        console.warn("OpenVidu 예외:", exception);
      });

      // 토큰 발급 및 연결 (세션+토큰발급 하기)
      // const fullUrl = await getToken(sessionName);
      console.log("토큰테스트");
      // console.log("기본토큰",fullUrl);

      const response = await challengeApi.enterChallenge(sessionName);
      console.log("connection응답",response.data);
      
      const fullUrl = response.data.token;
      setPureStudyTime(response.data.pureStudyTime || 0);
      setScreenTime(response.data.screenTime || 0);

      // const sessionIdInResponse = fullUrl.split('sessionId=')[1].split('&')[0]; // 테스트코드
      // const tokenInResponse = fullUrl.split('token=')[1]; // 테스트코드

      console.log("토큰테스트 응답", fullUrl);
      console.log("마이세션", mySession);
      // console.log("토큰줘", tokenInResponse, userName, encodedUserName); // 토큰 도착 성공
      // console.log("마이세션 in response", sessionIdInResponse); // 테스트코드

      // clientData에 원본 userName과 인코딩된 userName 모두 포함
      await mySession.connect(fullUrl, {
        clientData: JSON.stringify({
          originalName: userName,
          encodedName: encodedUserName,
        }),
      });
      console.log("컴백");

      // 게시자 초기화 (자신의 비디오 스트림 설정)
      const publisher = await OV.current.initPublisherAsync(undefined, {
        audioSource: undefined, // 기본 마이크
        videoSource: undefined, // 기본 카메라
        publishAudio: true, // 오디오 활성화
        publishVideo: true, // 비디오 활성화
        resolution: "640x480", // 해상도
        frameRate: 30, // FPS
        insertMode: "APPEND",
        mirror: true, // 미러링 비활성화
        audioConstraints: {
          // 오디오 제약조건 추가
          echoCancellation: true, // 에코 제거
          noiseSuppression: true, // 노이즈 제거
          autoGainControl: true, // 자동 게인 제어
          sampleRate: 44100, // 샘플레이트
          volume: 1.0, // 초기 볼륨
        },
        videoConstraints: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 },
        },
      });
      // 스트림 발행( 나의 비디오 스트림 설정으로 )
      await mySession.publish(publisher);

      // 비디오 장치 정보 설정
      const devices = await OV.current.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      const currentVideoDeviceId = publisher.stream
        .getMediaStream()
        .getVideoTracks()[0]
        .getSettings().deviceId;
      const currentVideoDevice = videoDevices.find(
        (device) => device.deviceId === currentVideoDeviceId
      );

      // 상태 업데이트
      setCurrentVideoDevice(currentVideoDevice);
      setMainStreamManager(publisher);
      setPublisher(publisher);
      setSession(mySession);
    } catch (error) {
      console.error("세션 연결 오류:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 카메라 전환 함수 : 사용 가능한 다른 카메라로 전환
  const switchCamera = useCallback(async () => {
    try {
      const devices = await OV.current.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices && videoDevices.length > 1) {
        const newVideoDevice = videoDevices.find(
          (device) => device.deviceId !== currentVideoDevice.deviceId
        );

        if (newVideoDevice) {
          // 새로운 비디오 스트림 생성
          const newPublisher = OV.current.initPublisher(undefined, {
            videoSource: newVideoDevice.deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });
          // 스트림 교체
          await session.unpublish(mainStreamManager); // 기존 세션 헤제
          await session.publish(newPublisher); // 새로운 세션 연결
          // 상태 업데이트
          setCurrentVideoDevice(newVideoDevice);
          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
        }
      }
    } catch (error) {
      console.error("카메라 전환 오류:", error);
      throw error;
    }
  }, [session, currentVideoDevice, mainStreamManager]);

  // 메인 비디오 스트림 변경 함수
  const updateMainStreamManager = useCallback(
    (stream) => {
      if (mainStreamManager !== stream) {
        setMainStreamManager(stream);
      }
    },
    [mainStreamManager]
  );

  // 화면공유 커스텀 훅 사용
  const {
    isScreenSharing,
    startScreenShare,
    stopScreenShare,
    screenPublisher,
  } = useScreenShare(session, publisher, OV);

  // 세션 나가기 : 모든 상태를 초기화하고 연결 종료
  const disconnectSession = useCallback(async () => {
    if (session) {
      try {
        // 챌린지 퇴장 API 호출
        // await exitChallenge(session.sessionId, {
        //   recordAt: formatDate(new Date()),
        //   pureStudyTime,
        //   screenTime,
        //   isSuccess: true, // 이거 버튼 구현한 다음에 연동!!!!!!!!!
        // });
        const localSavedScreenTime = localStorage.getItem('screenTime');
        const localSavedPureTime = localStorage.getItem('pureTime');
        const isMyChallengeSuccessedInLocal = localStorage.getItem('isMyChallengeSuccessedInLocal');
        const exitData = {
          recordAt: formatDate(new Date()),
          pureStudyTime: localSavedPureTime, // 키 이름 맞추기
          screenTime: localSavedScreenTime,   // 키 이름 맞추기
          isSuccess: isMyChallengeSuccessedInLocal
        };
        console.log("★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★ [ 수고하셨습니다! ] ☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆");
        console.log("★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★ [ 수고하셨습니다! ] ☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆");
        console.log("★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★ [ 수고하셨습니다! ] ☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆");
        console.log(localSavedPureTime);
        console.log(localSavedScreenTime);
        console.log(isMyChallengeSuccessedInLocal);
        console.log("★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★ [ 수고하셨습니다! ] ☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆");
        
        await api.post(`/challenges/${sessionName}/exit`, exitData);
        await navigate(`/video/${sessionName}/ending`);
          
        await session.disconnect();
        // navigate("/dashboard");

        setTimeout(() => {
          window.location.reload();
        }, 10);
        // 상태 초기화
        setSession(undefined);
        setSubscribers([]);
        setMainStreamManager(undefined);
        setPublisher(undefined);
        setScreenTime(0);
        setPureStudyTime(0);
        // setChallengeLogId(null);

      } catch (error) {
        console.error("세션 종료 중 오류:", error);
      }
    }
  }, [session]);




  // 타이머 관련 effect
  // useEffect(() => {
  //   let timer;
  //   if (session) {
  //     timer = setInterval(() => {
  //       setScreenTime(prev => prev + 1);
  //     }, 1000);
  //   }
  //   return () => {
  //     if (timer) {
  //       clearInterval(timer);
  //     }
  //   };
  // }, [session]);

  // AI 결과에 따른 순공시간 갱신
  // useEffect(() => {
  //   if (aiResult?.face?.attention >= 70 || aiResult?.posture?.status === "GOOD") {
  //     setPureStudyTime(prev => prev + 1);
  //   }
  // }, [aiResult]);
  

  return {
    session, // OpenVidu 세션 객체
    mainStreamManager, // // 메인 화면에 표시될 스트림
    publisher, // 게시자 초기화 (자신의 비디오 스트림 설정)
    subscribers, // 다른 스트림 유저정보들
    connectSession, // 세션 연결
    disconnectSession, // 세션 헤제
    switchCamera, // 카메라전환
    updateMainStreamManager, // 메인스트림교체
    isLoading, // 로딩
    error, // 에러
    clearError, // 에러초기화
    isScreenSharing, // 화면공유중인지
    startScreenShare, // 화면공유시작
    stopScreenShare, // 화면공유중지
    screenPublisher, // 화면공유 스트림
    screenTime,
    pureStudyTime,
    setPureStudyTime,
  };
};

export default useOpenVidu;
