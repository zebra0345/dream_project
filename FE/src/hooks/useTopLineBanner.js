import { useState } from 'react';

export const useTopLineBanner = () => {
  const [showBanner, setShowBanner] = useState(() => {
    const stored = localStorage.getItem('topLineBanner'); // 버튼누른 시간 가져오기
    if (!stored) return true; // 버튼 누른적없음 true리턴
    
    const { timestamp } = JSON.parse(stored); // X버튼 누른시간
    const now = new Date().getTime(); // 현재시간 
    const oneDay = 24 * 60 * 60 * 1000; // 24시간 
    
    return now - timestamp > oneDay; // 현재시간 기준 하루가 지났으면 true리턴
  });

  const hideBanner = () => {
    const bannerData = {
      timestamp: new Date().getTime(), // X버튼 누른시간 기록
      hidden: true
    };
    localStorage.setItem('topLineBanner', JSON.stringify(bannerData)); // 버튼누른시간 기록록
    setShowBanner(false); // 버튼누른 순간부터 false값 리턴
  };

  return { showBanner, hideBanner };
};