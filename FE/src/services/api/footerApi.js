import api from './axios';

// 별들의 기준 위치
const BASE_POSITIONS = [
  { x: 0, y: 25 },   // 첫 번째 별
  { x: 70, y: 35 },  // 두 번째 별
  { x: 20, y: 50 },  // 세 번째 별
  { x: 60, y: 72 }   // 네 번째 별
];

// 기본 결심 데이터
const DEFAULT_DETERMINATIONS = [
  { id: 1, text: "오늘의 나는 어제의 나와 싸운다" },
  { id: 2, text: "영어 시험 900점!" },
  { id: 3, text: "프로그래머 되기" },
  { id: 4, text: "매일 6시에 기상하기" }
];

// 각오 가져오기
export const getTopViewedDeterminations = async () => {
  try {
    const response = await api.get('/random-determinations');
    
    // 응답 데이터가 없는 경우 모든 기본 데이터 사용
    if (!response.data || response.data.length === 0) {
      return DEFAULT_DETERMINATIONS.map((item, index) => ({
        ...item,
        ...getSlightlyRandomPosition(index)
      }));
    }

    // 응답 데이터와 기본 데이터를 조합
    const combinedData = [];
    
    // 응답 데이터 먼저 추가
    response.data.slice(0, 4).forEach((text, index) => {
      combinedData.push({
        id: index + 1,
        text,
        ...getSlightlyRandomPosition(index)
      });
    });

    // 남은 자리는 기본 데이터로 채우기
    const remainingCount = 4 - combinedData.length;
    for (let i = 0; i < remainingCount; i++) {
      combinedData.push({
        ...DEFAULT_DETERMINATIONS[combinedData.length],
        ...getSlightlyRandomPosition(combinedData.length)
      });
    }

    return combinedData;
    
  } catch (error) {
    console.error('Failed to fetch top viewed determinations:', error);
    throw error;
  }
};

// 기준 위치에서 약간만 벗어나는 랜덤 위치 생성
const getSlightlyRandomPosition = (index) => {
  const basePosition = BASE_POSITIONS[index];
  const variance = 5; // 기준 위치에서 ±5% 범위 내에서만 변동

  return {
    x: basePosition.x + (Math.random() - 0.5) * variance * 2,
    y: basePosition.y + (Math.random() - 0.5) * variance * 2
  };
};