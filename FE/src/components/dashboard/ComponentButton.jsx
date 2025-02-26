export default function ComponentButton({ text, isDate, date, mode, challengeName, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="absolute bottom-0 left-0 px-6 py-3  text-my-blue-1 rounded-md text-center min-w-[150px] text-3xl"
      style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
    >
      {isDate 
        ? (mode === "date" 
              ? (date ? formatDate(date) : "날짜 선택") 
              : (challengeName ? challengeName : "my challenge")
          )
        : text}
    </button>
  );
}

// 날짜를 "YYYY.MM.DD" 형식으로 변환하는 함수
function formatDate(date) {
  if (!date) return ""; // 날짜가 없으면 빈 문자열 반환
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // 두 자리 수 유지
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}
