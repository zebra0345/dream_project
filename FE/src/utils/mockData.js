// src/utils/mockData.js
const generateMockChallenges = (count) => {
  const challenges = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + Math.floor(Math.random() * 7)); // 0~7일 후 시작

    challenges.push({
      challengeId: i + 1,
      userId: Math.floor(Math.random() * 100) + 1,
      roomName: `챌린지 ${i + 1}`,
      description: `이것은 테스트를 위한 챌린지 ${i + 1}의 설명입니다. 함께 공부해보아요!`,
      maxParticipants: 10,
      currentParticipants: Math.floor(Math.random() * 10) + 1, // 1~10명
      isPrivate: Math.random() > 0.5,
      startDate: startDate.toISOString(),
      endDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 후 종료
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      challengePicture: Math.random() > 0.5 ? null : `https://picsum.photos/400/400?random=${i}`, // 테스트용 랜덤 이미지
    });
  }

  return challenges;
};

export const mockApiResponse = (page = 1, size = 10) => {
  const totalItems = 100;
  const totalPages = Math.ceil(totalItems / size);
  const challenges = generateMockChallenges(size);

  return {
    data: challenges,
    totalPages,
    totalItems,
    currentPage: page,
    currentSize: size
  };
};