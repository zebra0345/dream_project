import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import defaultImage from "/logo/dreammoa-bg.png";


import {
  speakerOnState,
  selectedSpeakerState,
  speakerVolumeState,
  micOnState,
  selectedMicState,
  micVolumeState,
  cameraOnState,
  selectedCameraState
} from '../../recoil/atoms/challenge/video/deviceSettings';

import useMediaStream  from '../../hooks/useMediaStream';
import useAudioTest from '../../hooks/useAudioTest';

import { IoVideocam } from "react-icons/io5";
import { IoVideocamOff } from "react-icons/io5";

export default function VideoSettingForm({ onJoin, isLoading }) {
  // Recoil states
  const [speakerOn, setSpeakerOn] = useRecoilState(speakerOnState);
  const [selectedSpeaker, setSelectedSpeaker] = useRecoilState(selectedSpeakerState);
  const [speakerVolume, setSpeakerVolume] = useRecoilState(speakerVolumeState);
  const [micOn, setMicOn] = useRecoilState(micOnState);
  const [selectedMic, setSelectedMic] = useRecoilState(selectedMicState);
  const [micVolume, setMicVolume] = useRecoilState(micVolumeState);
  const [cameraOn, setCameraOn] = useRecoilState(cameraOnState);
  const [selectedCamera, setSelectedCamera] = useRecoilState(selectedCameraState);
  const navigate = useNavigate();

  // useMediaStream 훅 사용
  const { stream, error, devices } = useMediaStream(cameraOn, selectedCamera, micOn, selectedMic);
  // 컴포넌트가 언마운트될 때 스트림 정리
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);
  
  const { playTestSound } = useAudioTest(
    speakerOn, 
    selectedSpeaker, 
    speakerVolume
  );

  // 더미 디바이스 리스트
  // const dummyDevices = {
  //   speakers: ['기본값 - 스피커', 'USB 스피커', 'Bluetooth 스피커'],
  //   mics: ['기본값 - 마이크', 'USB 마이크', 'Bluetooth 마이크'],
  //   cameras: ['720p HD camera', '1080p FHD camera', 'USB 웹캠']
  // };
  // // 더미 디바이스 리스트를 실제 디바이스로 교체
  // const devicesList = {
  //   // 스피커와 마이크는 기존 더미 데이터 유지
  //   speakers: dummyDevices.speakers,
  //   mics: dummyDevices.mics,
  //   // 카메라는 실제 디바이스 사용
  //   cameras: devices.videoDevices
  // };
  

  // 핸들러 함수들
  const handleJoinRoom = () => {
    console.log('방 입장하기');
    onJoin();
  };

  const handleExit = () => {
    console.log('나가기');
    navigate('/challenge/list');
  };
  // 폼 제출 핸들러
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   onJoin();
  // };  

  return (
    <div className="flex justify-center items-center h-full bg-gray-900 w-full ">
      <div className="w-full max-w-4xl p-8 ">
        <div className="flex gap-8">
          {/* 비디오 화면 */}
          <div className="flex-1 aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-blue-300">
            {cameraOn && stream ? (
              <video
                ref={(video) => {
                  if (video) {
                    video.srcObject = stream;
                  }
                }}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={defaultImage}
                  alt="Preview" 
                  className="rounded-full w-32 h-32 object-cover object-center" 
                />
              </div>
            )}
            {error && (
              <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
                카메라 접근 오류: {error}
              </div>
            )}
          </div>
          {/* 컨트롤 패널 */}
          <div className="w-80 space-y-6 bg-gray-800 p-6 rounded-lg">
            {/* 스피커 설정 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-white" style={{fontFamily:"mbc"}}>스피커</h3>
                <button
                  style={{fontFamily:"mbc"}}
                  onClick={() => setSpeakerOn(!speakerOn)}
                  className={`p-2 rounded ${speakerOn ? 'bg-my-blue-1' : 'bg-my-red'}  text-white  font-medium transform hover:scale-105 transition-transform duration-300 shadow-lg`}
                >
                  {speakerOn ? '켜짐' : '꺼짐'}
                </button>
              </div>
              <select
                value={selectedSpeaker}
                onChange={(e) => setSelectedSpeaker(e.target.value)}
                style={{fontFamily:"mbc"}}
                className="w-full p-2 rounded bg-gray-700 text-white"
              >
                {devices.audioOutputDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </select>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={speakerVolume}
                onChange={(e) => setSpeakerVolume(Number(e.target.value))}
                className="w-full "
                disabled={isLoading}
              />
              <button
                onClick={playTestSound}
                style={{fontFamily:"mbc"}}
                className="w-full p-2 bg-my-blue-1 text-white  font-medium transform hover:opacity-80 transition-transform duration-300 shadow-lg rounded"
                disabled={!speakerOn}
              >
                테스트 사운드 재생
              </button>
            </div>

            {/* 마이크 설정 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-white" style={{fontFamily:"mbc"}}>마이크</h3>
                <button
                  onClick={() => setMicOn(!micOn)}
                  className={`p-2 rounded ${micOn ? 'bg-my-blue-1' : 'bg-my-red'}`}
                >
                  {micOn ? '켜짐' : '꺼짐'}
                </button>
              </div>
              <select
                value={selectedMic}
                style={{fontFamily:"mbc"}}
                onChange={(e) => setSelectedMic(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
              >
                {devices.audioInputDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-3 ">
                <span className="w-3 ">
                {micVolume}
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={micVolume}
                  onChange={(e) => setMicVolume(Number(e.target.value))}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* 카메라 설정 - 스피커와 유사한 구조 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-white" style={{fontFamily:"mbc"}}>카메라</h3>
                <button
                
                  onClick={() => setCameraOn(!cameraOn)}
                  className={`p-2 rounded ${cameraOn ? 'bg-my-blue' : 'bg-my-red'}`}
                >
                  {cameraOn ? (<IoVideocam />) : (<IoVideocamOff />)}
                </button>
              </div>
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  style={{fontFamily:"mbc"}}
                >
                  {devices.videoDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </option>
                  ))}
                </select>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center gap-4 mt-6">
          <button
          style={{fontFamily:"mbc"}}
            onClick={handleJoinRoom}
            className="px-6 py-2 bg-my-blue-1 text-white  font-medium transform hover:bg-hmy-blue-1 transition-transform duration-300 shadow-lg rounded-lg"
          >
            {isLoading ? '연결 중...' : '챌린지 입장하기'}
          </button>
          <button
          style={{fontFamily:"mbc"}}
            onClick={handleExit}
            className="p-2 rounded-lg bg-my-red text-white  font-medium transform hover:bg-hmy-red transition-transform duration-300 shadow-lg"
          >
            나가기
          </button>
        </div>
      </div>
    </div>
  );
};
