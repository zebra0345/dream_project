import api from "./axios";

export const homeApi = {
  // 유저 태그 조회
  homeCommunityItemsGetItMyBagBitch: async () => {
    const response = await api.get("/user-tag");
    return response.data.map((tag) => tag.tagName);
  },

  // 유저 태그 추가
  updateUserTags: async (tagNames) => {
    return await api.post("/user-tag", { tagNames });
  },

  // 임박 챌린지 조회
  getEndingSoonChallenges: async () => {
    const response = await api.get("/ending-soon");
    return response.data;
  },

  // 전체 유저 총 공부시간
  getTotalScreenTime: async () => {
    try {
      const response = await api.get("/total-screen-time");
      return response.data.totalScreenTime;
    } catch (error) {
      console.error("Failed to fetch total screen time:", error);
      return 150000; // 에러 발생 시 기본값 반환
    }
  },
  // 임박 챌린지 조회
  getRandomCommunity: async () => {
    const response = await api.get("/top-viewed");
    return response.data;
  },
};