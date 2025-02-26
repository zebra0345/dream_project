import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/atoms/authState";
import dashboardApi from "../../services/api/dashboardApi";

export default function TitleSection() {
  const userInfo = useRecoilValue(userState);
  // userInfo가 { nickname: "...", ... } 형태라고 가정 (백엔드/로컬에 따라 다를 수 있음)
  const nickname = userInfo?.nickname || "naem";

  const [totalHour, setTotalHour] = useState(0);

  // 전체 공부시간(초 단위) → 시간(시) 단위로 변환
  useEffect(() => {
    const fetchOverallTime = async () => {
      try {
        const result = await dashboardApi.getOverallStats();
        // 예: { totalPureStudyTime: 20000, ... }
        const totalSec = result?.totalPureStudyTime || 0;
        const hour = Math.floor(totalSec / 3600);
        setTotalHour(hour);
      } catch (error) {
        console.error("전체 공부시간 조회 실패:", error);
      }
    };

    fetchOverallTime();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center ">
      {/* 중앙 텍스트: "nickname has been dreaming for XX hour" */}
      <div className=" leading-none font-bold gap-2 flex items-center">
        <span className="text-[4rem] text-hmy-blue-1 ">
        {nickname}
        </span >
        <span className="text-[2rem] text-hmy-blue-4 ">
          has been dreaming for 
        </span>
        <span className="text-[4rem] text-hmy-blue-1 ">{totalHour} </span>
        <span className="text-[2rem] text-hmy-blue-4 ">hour</span>
      </div>
    </div>
  );
}
