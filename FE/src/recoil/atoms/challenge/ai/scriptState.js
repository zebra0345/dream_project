import { atom } from "recoil";

// ✅ 서버에서 받은 모든 자막 데이터 저장 (전처리 전)
export const allSubtitlesState = atom({
  key: "allSubtitlesState",
  default: {}, // { "userId1": "원본 자막", "userId2": "원본 자막" }
});

// ✅ 필터링/가공된 자막 데이터 저장 (전처리된 형태)
export const processedSubtitlesState = atom({
  key: "processedSubtitlesState",
  default: {}, // { "userId1": "가공된 자막", "userId2": "가공된 자막" }
});

// ✅ 개별 사용자의 자막 ON/OFF 상태
export const scriptOnOffState = atom({
  key: "scriptOnOffState",
  default: {}, // { "userId1": true, "userId2": false }
});

// ✅ 개별 사용자의 자막을 볼지 말지 결정하는 상태
export const showSubtitlesState = atom({
  key: "showSubtitlesState",
  default: {}, // { "userId1": true, "userId2": false }
});

// ✅ 요약창 on off
export const showSummaryState = atom({
  key: "showSummaryState",
  default: false,
});
// ✅ 요약창 내용 및 메모 내용
export const memoListState = atom({
  key: "memoListState",
  default: [],  // [{id: 1, content: "첫번째 메모"}, {id: 2, content: "두번째 메모"}] 형태로 저장
});
