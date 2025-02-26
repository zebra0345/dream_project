import { useState, useEffect } from 'react';
import { badgeApi } from '../../services/api/badgeApi';

export default function BadgeIsMine() {
  // 뱃지 데이터를 저장할 상태
  const [badges, setBadges] = useState([]);

  // 뱃지 데이터 가져오기
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await badgeApi.getMyBadge();
        setBadges(response.data);
      } catch (error) {
        console.error('뱃지 정보 로딩 실패:', error);
      } 
    };
    fetchBadges();
  }, []);

  return (
    <div>
      <div className="rounded-3xl bg-white border-2 border-gray-300 py-6 duration-500
                  flex flex-wrap gap-4 justify-start items-center
                  px-1 sm:px-2 md:px-4 lg:px-6">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="relative group flex justify-center items-center"
          >
            {/* 뱃지 이미지 */}
            <div className="relative w-16 h-16 ">
            <img
  src={badge.iconUrl}
  alt={badge.name}
  className="w-full h-full object-cover rounded-full border border-white border-2
             transition-transform duration-300 group-hover:scale-110
             animate-badge-glow"  // 새로 추가한 애니메이션 적용
  onError={(e) => {
    e.target.src = '/default-badge.png';
    e.target.onerror = null;
  }}
/>
              {/* Hover 시 나타나는 이름 */}
              <div className="absolute inset-0 flex items-center justify-center rounded-full
                          bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 select-none
                          transition-opacity duration-300">
                <span className="text-white text-sm font-medium px-2 text-center">
                  {badge.name}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {badges.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            획득한 뱃지가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};
