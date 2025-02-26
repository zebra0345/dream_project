import { atom } from 'recoil';

export const aiFocusState = atom({
  key: 'aiFocusState',
  default: 1
});
export const currentScreenTimeState = atom({
  key: 'currentScreenTimeState',
  default: 0
});
export const currentPureTimeState = atom({
  key: 'currentPureTimeState',
  default: 0
});
export const isMyChallengeSuccessedState = atom({
  key: 'isMyChallengeSuccessedState',
  default: true
});
