// src/components/dashboard/challenge/ChallengeChartSection.jsx
import React, { useEffect, useState, useRef } from "react";
import { Chart } from "primereact/chart";
import { Chart as ChartJS } from "chart.js";

function generateDateRange(startDate, expireDate) {
  const dates = [];
  const start = new Date(startDate);
  const end = new Date(expireDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  return dates;
}

function formatDateLabel(date) {
  return date.getDate().toString();
}

export default function ChallengeChartSection({ details = [], challengePeriod }) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const globalFontFamily = "KoreanFont, EnglishFont, sans-serif";

  // (1) 차트 데이터 생성 (backgroundColor를 함수로 정의)
  useEffect(() => {
    if (!challengePeriod) {
      setChartData(null);
      return;
    }

    const { startDate, expireDate } = challengePeriod;
    const dateRange = generateDateRange(startDate, expireDate);
    const labels = dateRange.map(formatDateLabel);

    const data = dateRange.map((date) => {
      const iso = date.toISOString().split("T")[0];
      const record = details.find((item) => {
        // recordAt에 'T00:00:00'을 추가하여 로컬 기준으로 Date 객체를 생성
        const recDate = new Date(`${item.recordAt}T00:00:00`);
        return recDate.toISOString().split("T")[0] === iso;
      });
      return record ? record.screenTime / 3600 : 0;
    });

    const newChartData = {
      labels: labels,
      datasets: [
        {
          label: "Daily Screen Time (hrs)",
          data: data,
          fill: true,
          // backgroundColor 함수를 사용해 차트가 그려질 때마다 그라데이션을 동적으로 생성
          backgroundColor: (context) => {
            const chart = context.chart;
            // chart.chartArea가 정의되지 않았다면 기본 배경색을 반환
            if (!chart.chartArea) {
              return "rgba(66,165,245,0.2)";
            }
            const { top, bottom } = chart.chartArea;
            const ctx = chart.ctx;
            const gradient = ctx.createLinearGradient(0, top, 0, bottom);
            gradient.addColorStop(0, "rgba(66,165,245,0.8)");
            gradient.addColorStop(0.5, "rgba(66,165,245,0.4)");
            gradient.addColorStop(1, "rgba(66,165,245,0)");
            return gradient;
          },
          borderColor: "#42A5F5",
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#fff",
        },
      ],
    };

    setChartData(newChartData);

    // Cleanup: 기존 차트 인스턴스 파괴하여 캔버스 재사용 오류 방지
    return () => {
      if (chartRef.current) {
        const chartInstance = chartRef.current.getChart();
        if (chartInstance) {
          chartInstance.destroy();
        }
      }
    };
  }, [details, challengePeriod]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    // animation: { duration: 0 }, // 애니메이션 비활성화하여 업데이트 시 덮어쓰지 않도록 함
    plugins: {
      legend: {
        display: true,
        position: "top",
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
        grid: { display: false },
        title: {
          display: true,
          text: "Day",
          font: { family: globalFontFamily, size: 18, weight: "bolder" },
          color: "#333",
        },
        ticks: {
          font: { family: globalFontFamily, size: 16, weight: "bolder" },
          color: "#333",
        },
      },
      y: {
        grid: { display: false },
        beginAtZero: true,
        title: {
          display: true,
          text: "Screen Time (hrs)",
          font: { family: globalFontFamily, size: 18, weight: "bolder" },
          color: "#333",
        },
        ticks: {
          font: { family: globalFontFamily, size: 16, weight: "bolder" },
          color: "#333",
        },
      },
    },
  };

  return (
    <div className="w-full h-full p-4 flex items-center justify-center">
      {chartData ? (
        <Chart
          key={chartData.labels.join("-")} // 고유 key prop으로 재마운트 유도
          ref={chartRef}
          type="line"
          data={chartData}
          options={options}
          className="w-full h-full"
        />
      ) : (
        <p className="text-xl font-bold">차트 데이터가 없습니다</p>
      )}
    </div>
  );
}
