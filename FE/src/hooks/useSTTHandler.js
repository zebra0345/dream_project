import { useRecoilState } from "recoil";
import { allSubtitlesState, processedSubtitlesState } from "../recoil/atoms/challenge/ai/scriptState";

const useSTTHandler = () => {
  const [allSubtitles, setAllSubtitles] = useRecoilState(allSubtitlesState);
  const [processedSubtitles, setProcessedSubtitles] = useRecoilState(processedSubtitlesState);

  /**
   * ✅ 자막 전처리 함수
   * - 오타 수정, 중복 제거, 불필요한 문자 제거
   */
  const processSubtitle = (rawText) => {
    if (!rawText) return "";
    return rawText
      .replace(/\[.*?\]/g, "") // 대괄호 안의 문자 제거
      .replace(/\s+/g, " ") // 공백 여러 개를 하나로 축소
      .trim(); // 앞뒤 공백 제거
  };

  /**
   * ✅ 5글자씩 끊어서 자막 업데이트
   */
  const updateSubtitles = (userId, newSubtitle) => {
    const processedText = processSubtitle(newSubtitle);
    const stringUserId = JSON.stringify(userId); // ✅ userId를 문자열로 변환

    console.log(`🔄 [useSTTHandler] ${stringUserId}의 새 자막 업데이트:`, newSubtitle);
    console.log(`🔄 [useSTTHandler] ${stringUserId}의 가공된 자막:`, processedText);

    setAllSubtitles((prev) => ({
      ...prev,
      [stringUserId]: processedText, // 원본 자막 저장
    }));

    setProcessedSubtitles((prev) => {
      const existingText = prev[stringUserId] || "";
      const updatedText = existingText + processedText;
      const limitedText = updatedText.slice(-5); // ✅ 5글자만 유지

      console.log(`✅ [useSTTHandler] 최종 저장된 자막 (5글자 제한):`, limitedText);

      return {
        ...prev,
        [stringUserId]: limitedText, // 5글자만 저장
      };
    });
  };

  return { updateSubtitles };
};

export default useSTTHandler;
