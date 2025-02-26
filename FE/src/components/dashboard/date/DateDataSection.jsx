import React from "react";
import DataLabel from "../common/DataLabel";

// "0시간 " 접두어를 제거하는 함수 (예: "0시간 0분" → "0분", "0시간 45분" → "45분")
function removeZeroHour(timeStr) {
  if (typeof timeStr !== "string") return timeStr;
  return timeStr.replace(/^0시간\s*/, "");
}

export default function DateDataSection({ studyItems = [], challengeItems = [] }) {
  const totalCells = 6;
  // 지정된 인덱스
  const challengeIndices = [1, 2, 4, 5]; // 챌린지 데이터 표시할 셀
  const studyIndices = [0, 3]; // 공부시간 데이터 표시할 셀

  const bgClasses = [
    "bg-white", // 셀 0 (공부시간)
    "bg-white", // 셀 1 (챌린지)
    "bg-white", // 셀 2 (챌린지)
    "bg-white", // 셀 3 (공부시간)
    "bg-white", // 셀 4 (챌린지)
    "bg-white", // 셀 5 (챌린지)
  ];

  // 챌린지 데이터가 전혀 없는 경우
  const noChallenge = challengeItems.length === 0;

  return (
    <div className="w-full h-full border-t-2 border-b-2 border-gray-300 p-4">
      {noChallenge ? (
        // 챌린지 데이터가 없으면 안내문 영역으로 표시
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* 셀 0: 오늘 공부 시간 */}
          <div
            className={`w-full h-full p-4 flex flex-col items-center justify-center ${bgClasses[0]} rounded-lg overflow-hidden border-2`}
          >
            {studyItems[0] ? (
              <>
                <DataLabel label={studyItems[0].label} />
                <div className="mt-2 text-2xl font-normal">
                  <p>{removeZeroHour(studyItems[0].value)}</p>
                </div>
              </>
            ) : (
              <div className="invisible">Placeholder</div>
            )}
          </div>

          {/* 셀 1,2,4,5: 챌린지 없음 안내문 (col-span-2, row-span-2 적용은 해제하고 자동배치) */}
          <div
            className={`w-full h-full p-4 flex flex-col items-center justify-center ${bgClasses[1]} rounded-lg border-2 md:col-span-2 md:row-span-2`}
          >
            <p className="text-xl font-bold">참여중인 챌린지가 없습니다</p>
          </div>

          {/* 셀 3: 월 평균 공부 시간 */}
          <div
            className={`w-full h-full p-4 flex flex-col items-center justify-center ${bgClasses[3]} rounded-lg border-2`}
          >
            {studyItems[1] ? (
              <>
                <DataLabel label={studyItems[1].label} />
                <div className="mt-2 text-2xl font-normal">
                  <p>{removeZeroHour(studyItems[1].value)}</p>
                </div>
              </>
            ) : (
              <div className="invisible">Placeholder</div>
            )}
          </div>
        </div>
      ) : (
        // 챌린지 데이터가 있는 경우 (기본적으로 6개 셀)
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: totalCells }).map((_, index) => {
            // 챌린지 데이터 셀 (인덱스 1,2,4,5)
            if (challengeIndices.includes(index)) {
              const challengeIndex = challengeIndices.indexOf(index); // 1→0, 2→1, 4→2, 5→3
              const item = challengeItems[challengeIndex];
              return (
                <div
                  key={index}
                  className={`w-full h-full p-4 flex flex-col items-center justify-center ${bgClasses[index]} rounded-lg border-2`}
                >
                  {item ? (
                    <>
                      <div className={`flex gap-6 items-center`}>
                        <div className="w-16 h-16 overflow-hidden rounded-full  hover:scale-105 duration-200 transition ease-in border-2 border-gray-300 hover:border-rose-300">
                          <img 
                            src={item.url} 
                            alt="" 
                            className="w-full h-full object-cover "
                          />
                        </div>
                        <div className="flex flex-col items-center ">
                          <DataLabel label={item.label} />
                          <div className="mt-2 text-2xl font-normal select-none">
                            <p>{removeZeroHour(item.value)}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="invisible">Placeholder</div>
                  )}
                </div>
              );
            }
            // 공부시간 데이터 셀 (인덱스 0,3)
            else if (studyIndices.includes(index)) {
              // index 0 → studyItems[0], index 3 → studyItems[1]
              const studyIndex = index === 0 ? 0 : 1;
              const item = studyItems[studyIndex];
              return (
                <div
                  key={index}
                  className={`w-full h-full p-4 flex flex-col items-center justify-center ${bgClasses[index]} rounded-lg border-2`}
                >
                  {item ? (
                    <>
                      <DataLabel label={item.label} />
                      <div className="mt-2 text-2xl font-normal">
                        <p>{removeZeroHour(item.value)}</p>
                      </div>
                    </>
                  ) : (
                    <div className="invisible">Placeholder</div>
                  )}
                </div>
              );
            }
            // 기타 예외(빈 셀)
            return (
              <div
                key={index}
                className={`w-full h-full p-4 ${bgClasses[index]} rounded-lg border-2`}
              >
                <div className="invisible">Placeholder</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

}
