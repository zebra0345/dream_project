import api from "./axios";

const dashboardApi = {
    // 각오 조회: GET /dashboard/determination
  getDetermination: async () => {
    try {
      const response = await api.get("/dashboard/determination");
      return response.data;
    } catch (error) {
      console.error("각오 조회 실패:", error);
      throw error;
    }
  },

  // 각오 수정/작성: PUT /dashboard/determination
  updateDetermination: async (determination) => {
    try {
      const response = await api.put("/dashboard/determination", { determination });
      return response.data;
    } catch (error) {
      console.error("각오 업데이트 실패:", error);
      throw error;
    }
  },

  // 일별 공부시간 조회
  getDailyStudyTime: async (year, month) => {
    // year: number, month: number
    try {
      const response = await api.get("/dashboard/daily-study", {
        params: { year, month },
      });
      return response.data; // [{ recordAt, totalStudyTime }, ...]
    } catch (error) {
      console.error("일별 공부 시간 조회 실패:", error);
      throw error;
    }
  },

  // 일별 챌린지 상위 4개 조회: GET /dashboard/top-challenges-for-day?year=...&month=...&day=...
  getTopChallengesForDay: async (year, month, day) => {
    try {
      const response = await api.get("/dashboard/top-challenges-for-day", {
        params: { year, month, day },
      });
      return response.data; // 예: [{ challengeId, title, thumbnailUrl, totalScreenTime, totalPureStudyTime }, ...]
    } catch (error) {
      console.error("챌린지 데이터 조회 실패:", error);
      throw error;
    }
  },

  // 전체 공부시간 조회
  getOverallStats: async () => {
    try {
      const response = await api.get("/dashboard/overall-stats");
      // 예: { challengeId: null, challengeTitle: null, totalPureStudyTime: 20000, totalScreenTime: 14400 }
      return response.data;
    } catch (error) {
      console.error("전체 공부시간 조회 실패:", error);
      throw error;
    }
  },

  // 챌린지별 모드: 월간 챌린지 히스토리 조회
  getMonthlyChallengeHistory: async (year, month) => {
    try {
      const response = await api.get("/dashboard/history", {
        params: { year, month },
      });
      // 예: [{ challengeId, title, thumbnailUrl, totalScreenTime, totalPureStudyTime }, ...]
      console.log("이게 챌?" , response.data);
      
      return response.data;
    } catch (error) {
      console.error("챌린지 히스토리 조회 실패:", error);
      throw error;
    }
  },

  // 챌린지별 모드: 월간 챌린지 통계 조회
  getMonthlyTotalStatsForChallenge: async (challengeId, year, month) => {
    try {
      const response = await api.get(`/dashboard/challenge/${challengeId}/monthly-total-stats`, {
        params: { year, month },
      });
      console.log("나의챌린지들 " , response.data);
      
      return response.data; // { challengeId, challengeTitle, startDate, expireDate, totalPureStudyTime, totalScreenTime }
    } catch (error) {
      console.error("챌린지별 월간 통계 조회 실패:", error);
      throw error;
    }
  },

  getMyChallenges: async () => {
    try {
      const response = await api.get("/challenges/my-challenges");
      return response.data;
    } catch (error) {
      console.error("내 챌린지 조회 실패:", error);
      throw error;
    }
  },

  // 챌린지별: 날짜별 success 여부 목록
  getMonthlyDetailsForChallenge: async (challengeId, year, month) => {
    try {
      const response = await api.get(`/dashboard/${challengeId}/monthly-details`, {
        params: { year, month },
      });
      // 예: [ { recordAt: "2025-02-16", screenTime: 7200, success: true }, ... ]
      return response.data;
    } catch (error) {
      console.error("챌린지 날짜별 성공/실패 조회 실패:", error);
      throw error;
    }
  },

  // 선택한 챌린지의 오늘 공부, 화면 사용 조회
  getTodayStatsForChallenge: async (challengeId) => {
    try {
      const response = await api.get(`/dashboard/challenge/${challengeId}/today-stats`);
      return response.data; // { challengeId, challengeTitle, totalPureStudyTime, totalScreenTime }
    } catch (error) {
      console.error("챌린지 오늘 통계 조회 실패:", error);
      throw error;
    }
  },

  // 챌린지별 모드: 한 달 평균 통계 조회: GET /dashboard/challenge/{challengeId}/monthly-stats?year=...&month=...
  getMonthlyAverageStatsForChallenge: async (challengeId, year, month) => {
    try {
      const response = await api.get(`/dashboard/challenge/${challengeId}/monthly-stats`, {
        params: { year, month },
      });
      return response.data; // { challengeId, challengeTitle, averagePureStudyTime, averageScreenTime }
    } catch (error) {
      console.error("챌린지별 월간 평균 통계 조회 실패:", error);
      throw error;
    }
  },


};

export default dashboardApi;