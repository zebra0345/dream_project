import { atom } from 'recoil';

export const communityListState = atom({
  key: 'communityListState',
  default: []
});

export const communityDetailState = atom({
  key: 'communityDetailState',
  default: null
});

export const communityLoadingState = atom({
  key: 'communityLoadingState',
  default: false
});

export const communityErrorState = atom({
  key: 'communityErrorState',
  default: null
});