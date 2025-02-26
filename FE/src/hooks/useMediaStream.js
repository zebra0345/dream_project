import { useState, useEffect, useCallback } from 'react';

const useMediaStream = (cameraOn, selectedCamera, micOn, selectedMic) => {
  // 비디오 스트림 상태 관리
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  // 마이크 스트림 가져오기 로직 추가
  const getStream = useCallback(async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const constraints = {
        video: cameraOn ? {
          deviceId: selectedCamera && selectedCamera !== 'default' 
            ? { ideal: selectedCamera } // exact 대신 ideal 사용
            : undefined
        } : false,
        audio: micOn ? {
          deviceId: selectedMic && selectedMic !== 'default'
            ? { ideal: selectedMic }
            : undefined
        } : false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError(err.message);
      setStream(null);
      // 에러 발생 시 기본 장치로 재시도
      if (err.name === 'OverconstrainedError') {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: cameraOn,
            audio: micOn
          });
          setStream(mediaStream);
          setError(null);
        } catch (retryErr) {
          console.error('기본 장치로 재시도 중 에러:', retryErr);
          setError(retryErr.message);
        }
      }
    }
  }, [cameraOn, selectedCamera, micOn, selectedMic]);

  // 사용 가능한 미디어 디바이스 가져오기
  const [devices, setDevices] = useState({
    videoDevices: [], // 카메라 장치
    audioInputDevices: [],  // 마이크 장치
    audioOutputDevices: []  // 스피커 장치
  });

  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      setDevices({
        videoDevices: devices
          .filter(device => device.kind === 'videoinput')
          .map(device => ({
            deviceId: device.deviceId,
            label: device.label || `Camera ${devices.indexOf(device) + 1}`
          })),
        audioInputDevices: devices
          .filter(device => device.kind === 'audioinput')
          .map(device => ({
            deviceId: device.deviceId,
            label: device.label || `Microphone ${devices.indexOf(device) + 1}`
          })),
        audioOutputDevices: devices
          .filter(device => device.kind === 'audiooutput')
          .map(device => ({
            deviceId: device.deviceId,
            label: device.label || `Speaker ${devices.indexOf(device) + 1}`
          }))
      });
    } catch (err) {
      console.error('Error getting media devices:', err);
      setError(err.message);
    }
  }, []);

  // 컴포넌트 마운트 시 디바이스 목록 가져오기
  useEffect(() => {
    getDevices();
    // 디바이스 변경 이벤트 리스너 등록
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    
    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
      // 스트림 정리
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [getDevices]);

  // 카메라 상태나 선택된 카메라가 변경될 때 스트림 업데이트
  useEffect(() => {
    getStream();
  }, [getStream]);

  return { stream, error, devices };
};

export default useMediaStream;