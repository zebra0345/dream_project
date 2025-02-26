import api from "./axios";


const challengeApi = {
  /**
   * 챌린지 방 생성
   * @param {Object} challengeData - 챌린지 생성 데이터
   * @param {File} thumbnail - 챌린지 썸네일 이미지
   * @returns {Promise} - 챌린지 생성 결과
   */
  createChallenge: async (challengeData, thumbnail) => {
    try {
      // FormData 생성
      const formData = new FormData();

      // challengeData를 JSON 문자열로 변환하여 추가
      const apiData = {
        ...challengeData,
        isPrivate: !challengeData.isPublic, // boolean 값 반전
      };
      delete apiData.isPublic;

      // 날짜 형식을 ISO 문자열로 변환
      if (apiData.startDate) {
        apiData.startDate = new Date(apiData.startDate).toISOString();
      }
      if (apiData.expireDate) {
        apiData.expireDate = new Date(apiData.expireDate).toISOString();
      }

      // challengeData를 Blob으로 변환하여 JSON 형식으로 추가
      const challengeDataBlob = new Blob([JSON.stringify(apiData)], {
        type: "application/json",
      });
      formData.append("challengeData", challengeDataBlob);

      // 썸네일 이미지가 있는 경우에만 추가
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
        console.log("썸네일 이미지 추가됨:", thumbnail); // 디버깅용
      }

      // POST 요청 전송
      const response = await api.post("/challenges/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 응답에 thumbnailUrl이 포함되어 있는지 확인
      console.log("챌린지 생성 응답:", response.data); // 디버깅용
      return response.data;
    } catch (error) {
      console.error("Challenge creation failed:", error);
      throw error;
    }
  },

  /**
   * 진행 중인 챌린지 목록 조회
   * @returns {Promise} - 진행 중인 챌린지 목록
   */
  getRunningChallengeList: async () => {
    const response = await api.get("/challenges/ongoing");
    return response;
  },
  /**
   * 사용자가 참여 중인 챌린지 목록 조회 (최대 7개)
   * @returns {Promise} - 참여 중인 챌린지 목록
   */
  getMyParticipatingChallenges: async () => {
    try {
      const response = await api.get("/challenges/my-challenges");
      return response.data;
    } catch (error) {
      console.error("참여 중인 챌린지 조회 실패:", error);
      throw error;
    }
  },
  // 챌린지 리스트 최상단 나의 태그기반 챌린지 8개 받아오기
  getTagChallenges: async(tags) => {
    const response = await api.get("/challenges/tag-challenges", {
      params: {
        tags: tags
      }
    });
    
    // currentParticipants가 0이 아닌 항목만 필터링
    const filteredData = response.data.filter(challenge => challenge.currentParticipants !== 0);
    
    return {
      ...response,
      data: filteredData
    };
  },

  // 챌린지 디테일 정보 불러오기 
  getChallengeDetailInfo: async(challengeId) => {
    try {
      const response = await api.get(`/challenges/${challengeId}/info`);
      return response
    } catch (e){
      console.log("챌린지디테일 못가져옴",e);
    }
  },

  // ☆★☆★☆★☆★☆★ 챌린지 신청 입장 참가 탈퇴 ☆★☆★☆★☆★☆★☆★
  // 챌린지 참가신청하기 (시작날짜 전 신청만하는상태)
  joinChallenge: async(challengeId) => {
    try {
      const response = await api.post(`/challenges/${challengeId}/join`);
      return response
    } catch (e){
      console.log("챌린지 참가하기 api 실패",e);
    }
  },
  // 챌린지 입장하기(내꺼 입장) === 참가하기(이미시작날짜지났지만 입장)
  enterChallenge: async(challengeId) => {
    try {
      console.log("세션id체크", challengeId);
      
      // 현재 날짜를 YYYY-MM-DD 형식으로 포맷팅
      const today = new Date().toISOString().split('T')[0];
      
      const response = await api.post(
        `/challenges/${challengeId}/enter`,
        {
          recordAt: today
        }
      );
      return response;
    } catch (e) {
      console.log("챌린지 입장하기 api 실패", e);
    }
  },
  // 챌린지 탈퇴하기
  leaveChallengeNamgiver: async(challengeId) => {
    try {
      const response = await api.delete(`/challenges/${challengeId}/leave`);
      return response
    } catch (e){
      console.log("챌린지 입장하기 api 실패",e);
    }
  },
  /**
   * 챌린지 탈퇴
   * @param {number} challengeId - 탈퇴할 챌린지 ID
   * @returns {Promise} - 챌린지 탈퇴 결과
   */
  // leaveChallenge: async (challengeId) => {
  //   try {
  //     const response = await api.delete(`/challenges/${challengeId}/leave`);
  //     return response.data;
  //   } catch (error) {
  //     console.error("챌린지 탈퇴 실패:", error);
  //     throw error;
  //   }
  // },
  /**
   * 챌린지 탈퇴
   * @param {number} challengeId - 탈퇴할 챌린지 ID
   * @returns {Promise} - 챌린지 탈퇴 결과
   */
  leaveChallenge: async (challengeId) => {
    try {
      if (!challengeId && challengeId !== 0) {
        throw new Error("유효하지 않은 챌린지 ID입니다.");
      }

      // challengeId를 URL에 직접 포함시키고 별도의 요청 본문 없이 전송
      const response = await api.delete(`/challenges/${challengeId}/leave`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204 || response.status === 200) {
        return { success: true };
      }

      return response.data;
    } catch (error) {
      console.error("챌린지 탈퇴 실패:", {
        challengeId,
        errorMessage: error.response?.data?.message || error.message,
        errorStatus: error.response?.status,
        errorDetails: error.response?.data,
      });

      // 사용자에게 더 명확한 에러 메시지 제공
      const errorMessage =
        error.response?.status === 500
          ? "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
          : error.response?.data?.message || "챌린지 탈퇴에 실패했습니다.";

      throw new Error(errorMessage);
    }
  },
  // 챌린지 리스트 검색+태그+초기랜더링 데이터 가져오기
  getSearchedChallenges: async(keyword,tags) => {
    const params = {};  // 빈 객체 생성
  
    // 값이 있을 때만 params 객체에 추가
    if (keyword) params.keyword = keyword;
    if (tags) params.tags = tags;
    console.log("태그확인",tags);
    

    const response = await api.get("/challenges/search", { params });
    console.log("챌린지 검색 결과 :",response.data);
    
    
    // 각 카테고리별 필터링
    const popularChallenges = response.data.popularChallenges.filter(
      challenge => challenge.currentParticipants !== 0
    );
    
    const runningChallenges = response.data.runningChallenges.filter(
      challenge => challenge.currentParticipants !== 0
    );
    
    const recruitingChallenges = response.data.recruitingChallenges.filter(
      challenge => challenge.currentParticipants !== 0
    );
    
    return {
      ...response,
      data: {
        popularChallenges,
        runningChallenges,
        recruitingChallenges
      }
    };
  },
  // 챌린지 리스트 검색+태그+초기랜더링 데이터 가져오기
  getMoreSearchedChallenges: async (keyword, tags, page) => {
    console.log("너가찾는페이지",page);
    
    const cacheKey = `${keyword || ''}-${tags?.join(',') || ''}-${page}`;
    
    // sessionStorage에서 캐시된 데이터 확인
    const cachedData = sessionStorage.getItem('challengeSearchCache');
    const cache = cachedData ? JSON.parse(cachedData) : {};
    
    // 캐시에 데이터가 있으면 반환
    if (cache[cacheKey]) {
      console.log("캐시된 데이터 사용:", cacheKey);
      return cache[cacheKey];
    }

    // API 요청 파라미터 설정
    const params = {};
    // if (keyword) params.keyword = keyword;
    // if (tags) params.tags = tags;
    if (page !== undefined) params.page = page;

    try {
      // API 요청
      const response = await api.get("/challenges/all-challenges", { params });
      const responseData = response.data;

      // 응답 데이터 캐싱
      cache[cacheKey] = responseData;
      sessionStorage.setItem('challengeSearchCache', JSON.stringify(cache));

      console.log("새로운 챌린지 검색 결과:", responseData);
      return responseData;
    } catch (error) {
      console.error("챌린지 검색 중 오류 발생:", error);
      throw error;
    }
  },
};

export default challengeApi;