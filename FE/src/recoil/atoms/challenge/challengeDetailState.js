import { atom } from 'recoil';

// 모달의 열림/닫힘 상태를 관리하는 atom
export const challengeModalState = atom({
  key: 'challengeModalState', // 고유한 키 값
  default: false, // 기본값은 모달이 닫힌 상태
});

// 선택된 챌린지 정보를 관리하는 atom
export const selectedChallengeState = atom({
  key: 'selectedChallengeState',
  default: {
    challengeId: null,
    title: '', // 제목
    description: '', // 설명
    currentParticipants: '', // 현재참가자 (not active) +++ 
    maxParticipants: 0, // 최대참가자
    // isPrivate: true, // 공개여부
    // createdAt: '', //생성날짜 -> 안씀
    startDate: '', // 챌린지시작날짜 "2025-02-06T00:00:00"
    expireDate: '', // 챌린지종료날짜 "2025-03-10T23:59:59"
    isActive: false, // 현재 1명이라도 있음   
    standard: 0, // 목표일수
    thumbnail: '', // 썸네일
    message: '', // 에러메세지 "참여하려면 로그인이 필요합니다."
    challengeTags: [], // 태그
    token: null, // 입장시 세션,토큰 여기서 꺼내써 "wss://dreammoa.duckdns.org?sessionId=@@@&token=@@@"
    // challengeLogId: null, // x
    // recordAt: null, // x
    // pureStudyTime: null, // x
    // screenTime: null, // x
    // isSuccess: null // x
  }
});