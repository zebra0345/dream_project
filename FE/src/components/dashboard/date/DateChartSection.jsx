// src/components/dashboard/date/DateChartSection.jsx
import { useRef, useEffect, useState } from "react";
import { Chart } from "primereact/chart";

/**
 * @param {Object[]} dailyStudyList - [{ recordAt: "2025-02-01", totalStudyTime: 7200 }, ...]
 * @param {Date} selectedDate - 사용자가 선택한 날짜 (예: 2월 15일)
 */
export default function ChartSection({ dailyStudyList = [], selectedDate }) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({});
  
  useEffect(() => {
    if (!selectedDate) return;

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const dayNum = selectedDate.getDate();

    // x축 라벨: 1일부터 dayNum까지
    const labels = Array.from({ length: dayNum }, (_, i) => i + 1);

    // dailyStudyList → 공부시간(hrs) 데이터 매핑
    const lineData = labels.map((day) => {
      const item = dailyStudyList.find((d) => {
        const dateObj = new Date(d.recordAt);
        return (
          dateObj.getFullYear() === year &&
          dateObj.getMonth() + 1 === month &&
          dateObj.getDate() === day
        );
      });
      return item ? item.totalStudyTime / 3600 : 0;
    });

    // 데이터셋의 backgroundColor를 함수로 지정하여 매번 동적으로 그라데이션 생성
    const newChartData = {
      labels,
      datasets: [
        {
          label: `${year}.${month < 10 ? "0" + month : month}`,
          data: lineData,
          fill: true,
          backgroundColor: (context) => {
            const chart = context.chart;
            // chartArea가 아직 계산되지 않았다면 기본 배경색 반환
            if (!chart.chartArea) {
              return "rgba(66,165,245,0.2)";
            }
            const { top, bottom } = chart.chartArea;
            const ctx = chart.ctx;
            const gradient = ctx.createLinearGradient(0, top, 0, bottom);
            gradient.addColorStop(0, "rgba(66,165,245,0.5)");
            gradient.addColorStop(1, "rgba(66,165,245,0)");
            return gradient;
          },
          borderColor: "#42A5F5",
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: "#fff",
          tension: 0.4,
        },
      ],
    };

    setChartData(newChartData);
  }, [dailyStudyList, selectedDate]);

  const globalFontFamily = "KoreanFont, EnglishFont, sans-serif";

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top", // 기본 위치 유지
        align: "end",
        labels: {
          font: {
            family: globalFontFamily,
            size: 16,
            weight: "bolder",
          },
          color: "#333",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "일(Day)",
          font: {
            family: globalFontFamily,
            size: 18,
            weight: "bolder",
          },
          color: "#333",
        },
        ticks: {
          font: {
            family: globalFontFamily,
            size: 16,
            weight: "bolder",
          },
          color: "#333",
        },
      },
      y: {
        grid: {
          display: false,
        },
        beginAtZero: true,
        title: {
          display: true,
          text: "공부 시간 (hrs)",
          font: {
            family: globalFontFamily,
            size: 18,
            weight: "bolder",
          },
          color: "#333",
        },
        ticks: {
          font: {
            family: globalFontFamily,
            size: 16,
            weight: "bolder",
          },
          color: "#333",
        },
      },
    },
  };

  return (
    <div className="w-full h-[350px] p-4">
      <Chart
        ref={chartRef}
        type="line"
        data={chartData}
        options={options}
        className="w-full h-full"
      />
    </div>
  );
}
