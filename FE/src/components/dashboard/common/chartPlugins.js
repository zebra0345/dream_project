// src/common/chartPlugins.js
export const gradientPlugin = {
    id: "gradientPlugin",
    beforeDraw: (chart) => {
      console.log("gradientPlugin beforeDraw 실행");
      const ctx = chart.ctx;
      const { top, bottom } = chart.chartArea;
      console.log("chartArea:", { top, bottom });
      const gradient = ctx.createLinearGradient(0, top, 0, bottom);
      gradient.addColorStop(0, "rgba(66,165,245,0.8)"); // 상단: 불투명도를 높임
      gradient.addColorStop(0.5, "rgba(66,165,245,0.4)"); // 중간
      gradient.addColorStop(1, "rgba(66,165,245,0)");     // 하단
      if (chart.data.datasets && chart.data.datasets.length > 0) {
        chart.data.datasets[0].backgroundColor = gradient;
        console.log("그라데이션 적용됨");
      }
    },
  };
  