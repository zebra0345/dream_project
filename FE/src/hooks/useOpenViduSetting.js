import { useState, useCallback } from 'react';

const useOpenViduSetting = (publisher, subscribers) => {
  // 마이크와 스피커 볼륨 상태 관리 (0~1 사이 값)
  const [micVolume, setMicVolume] = useState(1.0);
  const [speakerVolume, setSpeakerVolume] = useState(1.0);
  // 마이크 음소거 상태 관리
  const [isMicMuted, setIsMicMuted] = useState(false);
  // 카메라 상태 관리 추가
  const [isCameraOff, setIsCameraOff] = useState(false);

  // 마이크 볼륨 조절 함수
  const adjustMicVolume = useCallback((value) => {
    if (!publisher) return;

    try {
      // 0~1 사이의 값으로 정규화
      const normalizedValue = Math.max(0, Math.min(1, value));
      
      // Publisher의 오디오 트랙 가져오기
      const audioTrack = publisher.stream.getMediaStream()
        .getAudioTracks()[0];

      // 오디오 제약조건 설정
      const constraints = {
        advanced: [{
          volume: normalizedValue
        }]
      };

      // 새로운 볼륨 값 적용
      audioTrack.applyConstraints(constraints);
      
      // 상태 업데이트
      setMicVolume(normalizedValue);
    } catch (error) {
      console.error('마이크 볼륨 조절 실패:', error);
    }
  }, [publisher]);

  // 스피커 볼륨 조절 함수
  const adjustSpeakerVolume = useCallback((value) => {
    if (!subscribers.length) return;

    try {
      // 0~1 사이의 값으로 정규화
      const normalizedValue = Math.max(0, Math.min(1, value));
      
      // 모든 구독자(다른 참가자)의 비디오 엘리먼트 볼륨 조절
      subscribers.forEach(subscriber => {
        const videoElement = subscriber.videos[0].video;
        if (videoElement) {
          videoElement.volume = normalizedValue;
        }
      });

      // 상태 업데이트
      setSpeakerVolume(normalizedValue);
    } catch (error) {
      console.error('스피커 볼륨 조절 실패:', error);
    }
  }, [subscribers]);

  // 마이크 음소거 토글 함수
  const toggleMicMute = useCallback(() => {
    if (!publisher) return;

    try {
      // 현재 상태의 반대값으로 설정
      const newMuteState = !isMicMuted;
      
      // Publisher의 오디오 상태 변경
      publisher.publishAudio(!newMuteState);
      
      // 상태 업데이트
      setIsMicMuted(newMuteState);
    } catch (error) {
      console.error('마이크 음소거 토글 실패:', error);
    }
  }, [publisher, isMicMuted]);

  // 카메라 on/off 토글 함수
  const toggleCamera = useCallback(() => {
    if (!publisher) return;

    try {
      // 현재 상태의 반대값으로 설정
      const newCameraState = !isCameraOff;
      
      // Publisher의 비디오 상태 변경
      publisher.publishVideo(!newCameraState);
      
      // 상태 업데이트
      setIsCameraOff(newCameraState);
    } catch (error) {
      console.error('카메라 토글 실패:', error);
    }
  }, [publisher, isCameraOff]);

  return {
    micVolume,
    speakerVolume,
    isMicMuted,
    adjustMicVolume,
    adjustSpeakerVolume,
    toggleMicMute,
    isCameraOff,
    toggleCamera
  };
};

export default useOpenViduSetting;