import React, { useEffect, useState } from "react";
import dashboardApi from "../../../services/api/dashboardApi";
import DataLabel from "../common/DataLabel";
import { formatTime } from "../../../utils/formatTime";



// 날짜 형식 변환 (YYYY.M.D)
function formatLocalDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}.${m}.${day}`;
}

// 공부 시간을 원하는 형식으로 변환하는 함수
// 두 번째 인자(zeroText)는 seconds가 0일 때 표시할 텍스트, 기본값은 "데이터가 없습니다"
function customFormatTime(seconds, zeroText = "0분") {
  if (seconds === 0) return zeroText;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours < 1) {
    return `${minutes}분`;
  }
  return `${hours}시간 ${minutes}분`;
 }

export default function ChallengeDataSection({
  monthlyChallenges = [],
  myChallenges = [],
  year,
  month,
  onChallengeSelectedDetails,
}) {
  const [selectedStats, setSelectedStats] = useState(null);
  const [selectedTodayStats, setSelectedTodayStats] = useState(null);
  const [selectedAverageStats, setSelectedAverageStats] = useState(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);
  const [selectedChallengeInfo, setSelectedChallengeInfo] = useState(null);
  const [numOfChallenges, setNumOfChallenges] = useState(null);


  // 2. ChallengeDataSection 컴포넌트 내 useEffect 추가 (import React 부분에 useEffect 추가 필요)
  useEffect(() => {
    if (monthlyChallenges.length > 0) {
      handleThumbnailClick(monthlyChallenges[0].challengeId);
    }
    setNumOfChallenges(monthlyChallenges.length)
  }, [monthlyChallenges]); // monthlyChallenges가 변경될 때마다 실행


  const handleThumbnailClick = async (challengeId) => {
    console.log("[handleThumbnailClick] challengeId:", challengeId);
    try {
      // 1) 월간 통계
      const result = await dashboardApi.getMonthlyTotalStatsForChallenge(challengeId, year, month);
      console.log("[handleThumbnailClick] getMonthlyTotalStatsForChallenge result:", result);
      setSelectedStats(result);
      setSelectedChallengeId(challengeId);

      // 2) 내 챌린지에서 기간 정보 조회
      const info = myChallenges.find((ch) => ch.challengeId === challengeId);
      setSelectedChallengeInfo(info || null);

      const todayResult = await dashboardApi.getTodayStatsForChallenge(challengeId);
      console.log("[handleThumbnailClick] getTodayStatsForChallenge result:", todayResult);
      setSelectedTodayStats(todayResult);

      const avgResult = await dashboardApi.getMonthlyAverageStatsForChallenge(challengeId, year, month);
      console.log("[handleThumbnailClick] 월간 평균 통계:", avgResult);
      setSelectedAverageStats(avgResult);

      if (onChallengeSelectedDetails) {
        console.log("[handleThumbnailClick] calling onChallengeSelectedDetails...");
        await onChallengeSelectedDetails(challengeId);
      }
    } catch (error) {
      console.error("챌린지 월간 통계 조회 실패:", error);
    }
  };

  // 썸네일이 클릭되었는지에 따라 0초일 때 출력할 텍스트 결정
  const zeroText = selectedChallengeId ? "0분" : "";

  const todayValue = selectedTodayStats
    ? customFormatTime(selectedTodayStats.totalScreenTime, zeroText)
    : zeroText;

  const displayedValue = selectedStats
    ? customFormatTime(selectedStats.totalPureStudyTime, zeroText)
    : zeroText;

  const totalStudyValue = selectedAverageStats
    ? customFormatTime(selectedAverageStats.averageScreenTime, zeroText)
    : zeroText;

  let dataLabelText = "월별 챌린지 공부 시간";
  if (selectedStats && selectedChallengeInfo) {
    const start = formatLocalDate(selectedChallengeInfo.startDate);
    const end = formatLocalDate(selectedChallengeInfo.expireDate);
    dataLabelText = `${selectedStats.challengeTitle} ( ${start} ~ ${end} )`;
  }

  return (
    <div className="w-full h-full border-t-2 border-b-2 p-4">
      <div className="flex flex-col gap-4">
        {/* 1행 */}
        <div className="flex gap-4">
          {/* 오늘 공부 시간 */}
          <div className="w-2/5 border-2 p-4 flex flex-col items-center justify-center rounded-xl">
            <DataLabel label="오늘 공부 시간" />
            <div className="mt-2 text-2xl font-normal">
              <p>{todayValue}</p>
            </div>
          </div>
          {/* 한 달 평균 공부 시간 */}
          <div className="w-3/5 border-2 p-4 flex flex-col items-center justify-center rounded-xl">
            <DataLabel label={dataLabelText} />
            <div className="mt-2 text-2xl font-normal">
              <p>{displayedValue}</p>
            </div>
          </div>
        </div>
        {/* 2행 */}
        <div className="flex gap-4 items-center h-full">
          {/* 총 공부 시간 */}
          <div className="w-2/5 border-2 p-4 flex flex-col items-center justify-center rounded-xl ">
            <DataLabel label="평균 공부 시간" />
            <div className="mt-2 text-2xl font-normal">
              <p>{totalStudyValue}</p>
            </div>
          </div>
          {/* 추가 데이터 (썸네일 영역) */}
          <div className="w-3/5 border-2 p-4 flex flex-col items-center justify-center h-full rounded-xl relative">
            <div className="flex gap-4 mt-0 w-full justify-center ">
              <div className="flex gap-1 items-center justify-center absolute top-0 left-3 select-none text-gray-300 hover:text-gray-400">
                <div>Top</div>
                <div className="text-xl">
                {numOfChallenges !== 0 ? `${numOfChallenges}` : ''}
                </div>
              </div>
              {monthlyChallenges.length === 0 ? (
                <p>챌린지에 참여하세요!</p>
                ) : (
                monthlyChallenges.map((ch) => (
                  <ThumbnailItem
                    key={ch.challengeId}
                    challenge={ch}
                    onThumbnailClick={handleThumbnailClick}
                    isSelected={ch.challengeId === selectedChallengeId}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 썸네일 */
function ThumbnailItem({ challenge, onThumbnailClick, isSelected }) {
  const handleClick = () => {
    onThumbnailClick(challenge.challengeId);
  };

  return (
    <img
      src={challenge.thumbnailUrl}
      alt={challenge.title}
      title={challenge.title}
      onClick={handleClick}
      className={`w-16 h-16 rounded-full object-cover cursor-pointer 
        ring-2 ${isSelected ? "ring-blue-500" : "ring-transparent"} 
        hover:ring-red-300`}
    />
  );
}
