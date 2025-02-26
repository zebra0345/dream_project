import TitleSection from "../../components/dashboard/TitleSection";
import ComponentButton from "../../components/dashboard/ComponentButton";
import DateChartSection from "../../components/dashboard/date/DateChartSection";
import QuoteSection from "../../components/dashboard/QuoteSection";
import CalendarSection from "../../components/dashboard/CalendarSection";
import ChallengeDataSection from "../../components/dashboard/challenge/ChallengeDataSection";
import DateDataSection from "../../components/dashboard/date/DateDataSection";
import ChallengeChartSection from "../../components/dashboard/challenge/ChallengeChartSection";
import useDailyStudyTime from "../../hooks/useDailyStudyTime";
import dashboardApi from "../../services/api/dashboardApi";
import { formatTime } from "../../utils/formatTime";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [date, setDate] = useState(new Date());
  const [dashboardType, setDashboardType] = useState("date");

  // 날짜별 모드 관련 데이터
  const { dailyStudyList, todayStudyTimeSec, averageStudyTimeSec } =
    useDailyStudyTime(date, dashboardType);

  // 날짜별 챌린지 데이터
  const [topChallenges, setTopChallenges] = useState([]);
  const fetchTopChallenges = async (year, month, day) => {
    try {
      const data = await dashboardApi.getTopChallengesForDay(year, month, day);
      setTopChallenges(data);
    } catch (error) {
      console.error("챌린지 데이터 조회 실패:", error);
      setTopChallenges([]);
    }
  };

  useEffect(() => {
    if (dashboardType === "date") {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      fetchTopChallenges(year, month, day);
    }
  }, [dashboardType, date]);

  // 챌린지별 모드 관련 데이터
  const [monthlyChallenges, setMonthlyChallenges] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);

  const fetchMonthlyChallenges = async (year, month) => {
    try {
      const data = await dashboardApi.getMonthlyChallengeHistory(year, month);
      setMonthlyChallenges(data);
    } catch (error) {
      console.error("챌린지 히스토리 조회 실패:", error);
      setMonthlyChallenges([]);
    }
  };

  const fetchMyChallenges = async () => {
    try {
      const data = await dashboardApi.getMyChallenges();
      setMyChallenges(data);
    } catch (error) {
      console.error("내 챌린지 조회 실패:", error);
      setMyChallenges([]);
    }
  };

  useEffect(() => {
    if (dashboardType === "challenge") {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      fetchMonthlyChallenges(year, month);
      fetchMyChallenges();
    }
  }, [dashboardType, date]);

  // 날짜별 모드: 챌린지 셀 데이터
  const challengeItems =
    topChallenges.length > 0
      ? topChallenges.slice(0, 4).map((ch) => ({
          label: ch.title,
          value: formatTime(ch.totalPureStudyTime),
          url : ch.thumbnailUrl,
        }))
      : [];

  // 날짜별 모드: 날짜 셀 데이터
  const dateStudyItems = [
    {
      label: "오늘 공부 시간",
      value: formatTime(todayStudyTimeSec),
    },
    {
      label: "월 평균 공부시간",
      value: formatTime(averageStudyTimeSec),
    },
  ];

  // 달력 표시용 (챌린지별 모드)
  const [selectedChallengeDetails, setSelectedChallengeDetails] = useState([]);
  const [selectedChallengeInfo, setSelectedChallengeInfo] = useState(null);

  const handleSelectChallengeForCalendar = async (challengeId) => {
    console.log(
      "[DashboardPage] handleSelectChallengeForCalendar() called:",
      challengeId
    );
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const details = await dashboardApi.getMonthlyDetailsForChallenge(
        challengeId,
        year,
        month
      );
      console.log("[DashboardPage] getMonthlyDetailsForChallenge =>", details);
      setSelectedChallengeDetails(details || []);

      // myChallenges에서 정보 찾기
      const info = myChallenges.find((ch) => ch.challengeId === challengeId);
      setSelectedChallengeInfo(info || null);
    } catch (error) {
      console.error("챌린지 날짜별 상세 조회 실패:", error);
      setSelectedChallengeDetails([]);
      setSelectedChallengeInfo(null);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 flex flex-col bg-white items-center overflow-hidden">
      {/* Title 영역 */}
      <div className="w-full h-24 max-w-[1800px]">
        <TitleSection />
      </div>

      {/* 기존 데스크탑 구조는 그대로 두고, 모바일일 때만 flex-col 및 순서(order)를 변경 */}
      <div className="w-full mt-4 ml-32 flex flex-col lg:flex-row items-stretch justify-center gap-8 max-w-[1800px]">
        {/* Section 1: 데이터/차트 영역 (데스크탑: 왼쪽 - 60%) */}
        {/* 모바일에서는 아래쪽에 표시 */}
        <div className="order-2 lg:order-1 w-full lg:w-3/5 flex flex-col border-2 border-gray-300 rounded-xl p-4 mt-4 md:mt-0 ">
          {/* 상단 버튼 영역 */}
          <div className="w-full">
            <div className="flex items-center justify-center relative text-lg">
              {/* 왼쪽: 날짜 표시 버튼 */}
              <ComponentButton
                isDate
                date={date}
                mode={dashboardType}
                challengeName={
                  dashboardType === "challenge" && selectedChallengeInfo
                    ? selectedChallengeInfo.title
                    : undefined
                }
              />
              {/* 오른쪽: 모드 전환 버튼 */}
              
              <div className="ml-auto flex space-x-4 p-2 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setDashboardType("date")}
                  className={` rounded-md transition-colors duration-300 ease-in px-6 py-3  rounded-md text-center min-w-[150px] text-xl ${
                    dashboardType === "date"
                      ? "bg-my-blue-4 text-white"
                      : "bg-gray-300 text-white hover:bg-my-blue-4"
                  }`}
                >
                  📅 날짜별 보기
                </button>
                <button
                  onClick={() => setDashboardType("challenge")}
                  className={` rounded-md transition-colors duration-300 ease-in px-6 py-3  rounded-md text-center min-w-[150px] text-xl ${
                    dashboardType === "challenge"
                      ? "bg-my-blue-4 text-white"
                      : "bg-gray-300 text-white hover:bg-my-blue-4"
                  }`}
                >
                  🎯 챌린지별 보기
                </button>
              </div>
            </div>
          </div>

          {/* Data + Chart 영역 */}
          <div className="w-full flex flex-col mt-4">
            {dashboardType === "date" ? (
              <>
                {/* 공부시간 / 챌린지 데이터 */}
                <div className="w-full flex-none">
                  <DateDataSection
                    studyItems={dateStudyItems}
                    challengeItems={challengeItems}
                  />
                </div>
                {/* 차트 영역: 높이를 늘리고 싶다면 h-80, h-96 등 지정 */}
                <div className="w-full flex-auto flex items-center justify-center text-lg h-96 mt-4">
                  <DateChartSection
                    dailyStudyList={dailyStudyList}
                    selectedDate={date}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="w-full flex-none">
                  <ChallengeDataSection
                    monthlyChallenges={monthlyChallenges}
                    myChallenges={myChallenges}
                    year={date.getFullYear()}
                    month={date.getMonth() + 1}
                    onChallengeSelectedDetails={handleSelectChallengeForCalendar}
                  />
                </div>
                <div className="w-full flex-auto flex items-center justify-center text-lg h-96">
                  <ChallengeChartSection
                    details={selectedChallengeDetails}
                    challengePeriod={
                      selectedChallengeInfo && {
                        startDate: selectedChallengeInfo.startDate,
                        expireDate: selectedChallengeInfo.expireDate,
                      }
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 2: 인용구/달력 영역 (데스크탑: 오른쪽 - 40%) */}
        {/* 모바일에서는 상단에 표시 */}
        <div className="order-1 lg:order-2 w-full lg:w-2/5 flex flex-col -ml-12">
          <div className="w-full flex items-start justify-center text-lg">
            <div>
              <div className="w-full flex items-center justify-center text-lg mt-10">
                <QuoteSection />
              </div>
              <div className="w-full flex items-end justify-center text-lg mt-6">
                {dashboardType === "date" ? (
                  <CalendarSection
                    value={date}
                    onChange={(selectedDate) => {
                      console.log("선택한 날짜:", selectedDate);
                      setDate(selectedDate);
                    }}
                    mode={dashboardType}
                    details={[]} // 날짜 모드: success/fail 데이터 없음
                  />
                ) : (
                  <CalendarSection
                    value={date}
                    onChange={(selectedDate) => setDate(selectedDate)}
                    mode={dashboardType}
                    details={selectedChallengeDetails}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}