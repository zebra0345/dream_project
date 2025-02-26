// src/recoil/atoms/modalAtom.js
import { atom } from 'recoil';

export const successModalState = atom({
  key: 'successModalState',
  default: {
    isOpen: false,
    message: '',
    onCancel: null,
    isCancellable: false,
  },
});

export const errorModalState = atom({
  key: 'errorModalState',
  default: {
    isOpen: false,
    message: '',
    onCancel: null,
    isCancellable: true,  // 에러 모달은 기본적으로 취소 가능
  },
});