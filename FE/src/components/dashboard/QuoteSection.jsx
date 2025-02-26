import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/atoms/authState";
import dashboardApi from "../../services/api/dashboardApi";

export default function QuoteSection() {

  //현재 로그인한 사용자 정보(Recoil의 userState에서 가져옴)
  const user = useRecoilValue(userState);

  //백엔드에서 가져온 각오 내용
  const [determination, setDetermination] = useState("");
  //수정 모드 여부
  const [editing, setEditing] = useState(false);
  //textarea에 임시로 입력되는 내용 저장
  const [tempText, setTempText] = useState("");

  //컴포넌트 mount 시, 사용자가 로그인되어 있으면 각오 내용을 조회
  useEffect(() => {
    if(user) {
      dashboardApi.getDetermination()
      .then((data) => {
        if(data && data.determination){
          setDetermination(data.determination);
        }
      })
      .catch((error) => {
        console.error("각오 조회 중 에러 발생:", error);
      })
    }
  }, [user]);

  // 클릭 시 수정 모드로 전환
  const handleSectionClick = () => {
    // 혹시 로그인하지 않은 경우 보호 처리
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    setTempText(determination);
    setEditing(true);
  };

  // 저장 버튼 클릭 시 PUT API 호출
  const handleSave = () => {
    dashboardApi.updateDetermination(tempText)
      .then((data) => {
        setDetermination(tempText);
        setEditing(false);
      })
      .catch((error) => {
        console.error("각오 업데이트 중 에러 발생:", error);
      });
  };

  // 취소 버튼 클릭 시 수정 모드 종료
  const handleCancel = () => {
    setEditing(false);
  };

  return (
    <div className="bg-yellow-100 p-4 shadow-md rounded-lg w-full min-w-[450px] min-h-[100px]"> {/* ✅ 달력과 동일한 min-w 값 적용 */}
      <h2 className="text-lg font-bold mb-3">✨ 나의 다짐</h2>
      {editing ? (
        // 수정 모드: textarea와 저장/취소 버튼
        <div className="flex flex-col">
          <textarea
            className="w-full p-2 border border-gray-300 rounded resize-none"
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            rows="4"
            placeholder="각오를 작성해주세요"
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded duration-300 transition ease-in "
              onClick={handleCancel}
            >
              취소
            </button>
            <button
              className="px-3 py-1 bg-my-blue-4 hover:bg-hmy-blue-4 text-white rounded duration-300 transition ease-in "
              onClick={handleSave}
            >
              저장
            </button>
          </div>
        </div>
      ) : (
        // 읽기 모드: 내용 또는 placeholder를 보여주고 클릭 시 수정 모드로 전환
        <div className="cursor-pointer" onClick={handleSectionClick}>
          {determination ? (
            <p className="text-xl">{determination}</p>
          ) : (
            <p className="text-gray-500">각오를 작성해주세요</p>
          )}
        </div>
      )}
    </div>
  );
}
