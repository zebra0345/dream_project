import { atom } from 'recoil';

// 스피커 관련 atoms
export const speakerOnState = atom({
  key: 'speakerOnState',
  default: true
});

export const selectedSpeakerState = atom({
  key: 'selectedSpeakerState',
  default: '기본값 - 스피커'
});

export const speakerVolumeState = atom({
  key: 'speakerVolumeState',
  default: 1.0
});

// 마이크 관련 atoms
export const micOnState = atom({
  key: 'micOnState',
  default: true
});

export const selectedMicState = atom({
  key: 'selectedMicState',
  default: '기본값 - 마이크'
});

export const micVolumeState = atom({
  key: 'micVolumeState',
  default: 1.0
});

// 카메라 관련 atoms
export const cameraOnState = atom({
  key: 'cameraOnState',
  default: false
});

export const selectedCameraState = atom({
  key: 'selectedCameraState',
  default: '720p HD camera'
});