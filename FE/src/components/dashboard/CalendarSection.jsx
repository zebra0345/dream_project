// src/components/dashboard/CalendarSection.jsx
import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarSection({
  value,
  onChange,
  mode,
  details = [],
}) {
  // 날짜별 성공 여부 매핑
  const successMap = {};
  details.forEach((item) => {
    let dateKey = item.recordAt;
    if (dateKey.includes("T")) {
      dateKey = dateKey.split("T")[0];
    }
    successMap[dateKey] = item.success;
  });

  // challenge 모드: 타일 하단에 O/X 표시 (CSS로 위치 조정)
  const tileContent = ({ date, view }) => {
    if (view === "month" && mode === "challenge") {
      const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
          date.getDate()
        ).padStart(2, "0")}`;
      const successValue = successMap[iso];
      if (successValue === true) {
        return (
          <div className="tile-indicator" style={{ color: "darkblue" }}>
            👍
          </div>
        );
      } else if (successValue === false) {
        return (
          <div className="tile-indicator" style={{ color: "red" }}>
            👎
          </div>
        );
      }
    }
    return null;
  };

  // 모드에 따라 날짜 클릭 비활성화 조건 지정
  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      if (mode === "challenge") {
        return true; // '챌린지별' 모드: 모든 날짜 클릭 차단
      } else if (mode === "date") {
        return date > new Date(); // '날짜별' 모드: 오늘 이후 날짜 클릭 차단
      }
    }
    return false;
  };

  return (
    <div
      className="calendar-parent-container"
      style={{
        backgroundColor: mode === "challenge" ? "#ffffff" : "inherit", // 챌린지 모드 배경 흰색 적용
        border: "1px solid #ccc",
        borderRadius: "8px", // 모서리를 둥글게
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)", // 그림자 효과
        width: "100%",
        maxWidth: "480px",
        height: "100%",
        maxHeight: "100%", // 부모 컨테이너의 높이를 넘지 않도록 제한
        margin: "0 auto",
        padding: 0,
        overflowY: "auto", // 내용이 넘칠 경우 스크롤 생성
        boxSizing: "border-box",
      }}
    >
      {/* 제목 추가 */}
      <h2 className="text-lg font-bold mb-2 ml-2 mt-2">
        {mode === "date" ? "📅 달력" : "🏆 챌린지 달력"}
      </h2>

      <Calendar
        locale="en-US"
        formatDay={(locale, date) => date.getDate()}
        formatShortWeekday={(locale, date) =>
          date.toLocaleDateString("en-US", { weekday: "short" })
        }
        formatMonthYear={(locale, date) =>
          date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
        }
        onChange={onChange}
        value={value}
        tileContent={tileContent}
        tileDisabled={tileDisabled}
        className="custom-calendar"
      />

      <style>
        {`
        .calendar-parent-container.custom-calendar {
            background-color: ${mode === "challenge" ? "#ffffff" : "inherit"} !important;
          }
          .react-calendar {
            background-color: ${mode === "challenge" ? "#ffffff" : "inherit"} !important;
          }
          .custom-calendar .react-calendar__tile--disabled {
            pointer-events: none !important;
            opacity: 1 !important;
            color: inherit !important;
          }
          /* 전체 레이아웃 및 react-calendar 기본 여백 제거, Flex+Grid 레이아웃 */
          .calendar-parent-container .custom-calendar {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            border: none !important;
            display: flex;
            flex-direction: column;
            border-radius: inherit; /* 부모의 둥근 모서리 상속 */
            overflow: hidden; /* 내부 컨텐츠가 둥근 모서리를 벗어나지 않도록 */
          }
          .calendar-parent-container .custom-calendar .react-calendar__navigation {
            flex: 0 0 auto;
          }
          .calendar-parent-container .custom-calendar .react-calendar__viewContainer {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          .calendar-parent-container .custom-calendar .react-calendar__month-view {
            flex: 1;
            display: flex;
            flex-direction: column;
            margin: 0;
          }
          /* 요일 헤더 (예: Sun, Mon, Tue ...) - 밑줄 제거 */
          .calendar-parent-container .custom-calendar .react-calendar__month-view__weekdays {
            flex: 0 0 auto;
            margin: 0;
            border-bottom: none;
          }
          /* 요일 영역 내부의 abbr 태그의 점선 밑줄 제거 */
          .calendar-parent-container .custom-calendar .react-calendar__month-view__weekdays abbr {
            text-decoration: none !important;
          }
          /* 날짜 그리드: 7열 x 6행 고정 - 각 행의 높이를 80px로 지정 */
          .calendar-parent-container .custom-calendar .react-calendar__month-view__days {
            flex: 1;
            display: grid !important;
            grid-template-columns: repeat(7, 1fr);
            grid-template-rows: repeat(6, 80px);
            margin: 0;
          }
          /* 각 날짜 타일: 기본 날짜 숫자와 추가 컨텐츠(O/X)를 함께 보여주기 위해 relative position 설정 */
          .calendar-parent-container .custom-calendar .react-calendar__tile {
            margin: 0 !important;
            position: relative;
            padding-bottom: 20px; /* 하단에 O/X 표시 공간 확보 */
            display: flex;
            align-items: center;
            justify-content: center;
          }
          /* 날짜 숫자 (일자) 크기 및 두께 */
          .calendar-parent-container .custom-calendar .react-calendar__tile abbr {
            font-size: 1.2rem;
            font-weight: 400;
          }
          /* 요일 헤더 크기 및 두께 */
          .calendar-parent-container .custom-calendar .react-calendar__month-view__weekdays__weekday {
            font-size: 1.1rem;
            font-weight: 400;
          }
          /* 상단 Navigation (월/년, 화살표) 크기 및 두께 */
          .calendar-parent-container .custom-calendar .react-calendar__navigation__label,
          .calendar-parent-container .custom-calendar .react-calendar__navigation__arrow {
            font-size: 1.2rem;
            font-weight: 400;
          }
          /* O/X 표시 크기를 키우고 두께를 얇게 설정 */
          .tile-indicator {
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 1.8rem;
            font-weight: 200;
          }
        `}
      </style>
    </div>
  );
}
