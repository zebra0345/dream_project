import { atom } from 'recoil';

export const authState = atom({
  key: 'authState',
  default: {
    isAuthenticated: false,
    accessToken: null,
  }
});

// localStorage에서 초기 유저 정보를 가져오는 함수
const getInitialUserState = () => {
  const savedUser = localStorage.getItem('userInfo');
  console.log("로컬 스토리지에 저장된 userInfo:", savedUser); // ✅ 로컬 스토리지 원본 데이터 확인

  return savedUser ? JSON.parse(savedUser) : null;
};

// 유저 정보를 저장하는 atom
export const userState = atom({
  key: 'userState',
  default: getInitialUserState(),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        if (newValue === null) {
          localStorage.removeItem('userInfo');
        } else {
          localStorage.setItem('userInfo', JSON.stringify(newValue));
        }
      });
    },
  ],
});

