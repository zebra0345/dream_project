import { atom } from 'recoil';

export const authLoadingState = atom({
  key: 'authLoadingState',
  default: true  // 초기값은 loading 상태
});