import Filter from "badwords-ko";
import defaultUserUrl from "/logo/dreammoa-bg.png";

  // ☆★☆★☆★ 채팅 단 하나 ☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★

export default function ChatMessage({ message }) {
  const { nickname, email, profilePictureUrl, text } = message;
  const filter = new Filter({ placeHolder: "😂" }); // 채팅 받을때 필터링

  return (
    <div className="flex items-center gap-3 p-2 hover:bg-gray-50">
      {/* 프로필 이미지 */}
      <div className="flex-shrink-0">
        <img 
          src={profilePictureUrl || defaultUserUrl} // 프로필 이미지가 없을 경우 기본 이미지
          alt={`${nickname}'s profile`}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>

      {/* 사용자 정보와 메시지 */}
      <div className="flex-1 min-w-0">
        {/* 사용자 정보 */}
        <p className="text-sm text-gray-900">
          {nickname}
          <span className="text-gray-500 text-xs ml-1">
            ({email})
          </span>
        </p>
        
        {/* 메시지 내용 */}
        <p className="text-sm text-gray-700 break-words">
          {filter.clean(text)}
        </p>
      </div>
    </div>
  );
};