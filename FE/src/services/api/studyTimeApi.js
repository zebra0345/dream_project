import api from './axios';

// export const getTotalStudyTime = async () => {
//   try {
//     const response = await api.get('/api/study-time');
//     return response.data.totalStudyTime;  // 분 단위
//   } catch (error) {
//     console.error('Failed to fetch total study time:', error);
//     return 0;
//   }
// };

/**
 * 챌린지 방 입장 시 호출
 * @param {number} challengeId - 챌린지 ID
 * @param {string} recordAt - 기록 날짜 (YYYY-MM-DD 형식)
 * @returns {Promise<{
 *   token: string,
 *   challengeLogId: number,
 *   recordAt: string,
 *   pureStudyTime: number,
 *   screenTime: number,
 *   isSuccess: boolean
 * }>}
 */
export const enterChallenge = async (challengeId, recordAt) => {
  try {
    const response = await api.post(`/challenges/${challengeId}/enter`, {
      recordAt,
    });
    return response.data;
  } catch (error) {
    console.error('챌린지 입장 실패:', error);
    throw error;
  }
};

/**
 * 챌린지 방 퇴장 시 호출
 * @param {number} challengeId - 챌린지 ID
 * @param {Object} studyRecord - 학습 기록 데이터
 * @param {string} studyRecord.recordAt - 기록 날짜 (YYYY-MM-DD 형식)
 * @param {number} studyRecord.pureStudyTime - 순수 공부 시간(밀리초)
 * @param {number} studyRecord.screenTime - 총 스크린 타임(밀리초)
 * @param {boolean} studyRecord.isSuccess - 챌린지 성공 여부
 * @returns {Promise<{ message: string }>}
 */
export const exitChallenge = async (challengeId, studyRecord) => {
  try {
    const response = await api.post(`/challenges/${challengeId}/exit`, studyRecord);
    return response.data;
  } catch (error) {
    console.error('챌린지 퇴장 실패:', error);
    throw error;
  }
};

// 날짜 포맷팅 유틸리티 함수
export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};