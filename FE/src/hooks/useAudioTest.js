// hooks/useAudioTest.js
import { useEffect, useRef } from 'react';
import TestAudioSampleLostFound from '/test/TestAudioSampleLostFound.mp3'

const useAudioTest = (speakerOn, selectedSpeaker, speakerVolume) => {
  const audioRef = useRef(null);

  useEffect(() => {
    // 오디오 엘리먼트 생성
    const audio = new Audio(TestAudioSampleLostFound); // 테스트용 오디오 파일
    audioRef.current = audio;

    // 볼륨 설정
    audio.volume = speakerVolume;
    console.log("tee:", speakerOn,selectedSpeaker,speakerVolume);
    
    // 스피커 설정 전에 장치 확인
    if (audio.setSinkId && selectedSpeaker && selectedSpeaker !== 'default') {
      audio.setSinkId(selectedSpeaker).catch(err => {
        console.warn('스피커 변경 중 에러:', err);
        // 기본 스피커로 폴백
        audio.setSinkId('default').catch(console.error);
      });
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [selectedSpeaker, speakerVolume]);

  const playTestSound = () => {
    if (speakerOn && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.error('Error playing test sound:', err);
      });
    }
  };

  return { playTestSound };
};

export default useAudioTest;