import { atom } from 'recoil';

export const searchForChallengeInputState = atom({
  key: 'searchForChallengeInputState', // 유니크한 키 값
  default: '', // 기본값
});

export const searchForChallengeTagState = atom({
  key: 'searchForChallengeTagState', // 유니크한 키 값
  default: null, // 기본값
});

export const popularChallengesState = atom({
  key: 'popularChallengesState',
  default: []
});

export const runningChallengesState = atom({
  key: 'runningChallengesState',
  default: []
});

export const recruitingChallengesState = atom({
  key: 'recruitingChallengesState',
  default: []
});

export const searchedChallengesState = atom({
  key: 'searchedChallengesState',
  default: {
    content: [],
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    lastPage: false
  }
});