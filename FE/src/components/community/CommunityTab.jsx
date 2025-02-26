import { useNavigate, useLocation } from "react-router-dom";

export default function CommunityTab() {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 페이지에 따라 활성 탭 구분
  const currentPath = location.pathname;

  const tabItems = [
    { name: "자유게시판", path: "/community/free" },
    { name: "QnA 게시판", path: "/community/qna" },
  ];

  const handleTabClick = (path) => {
    navigate(`${path}?page=1&sort=최신순`); // 기본 정렬 최신순
  };

  return (
    <div className="flex space-x-4 mb-6 border-b-2 border-gray-200 ">
      {tabItems.map((tab) => (
        <button
          key={tab.name}
          onClick={() => navigate(tab.path)}
          style={{ fontFamily: "mbc" }}
          className={`w-1/2 py-3 text-center mbc-font font-family-mbc  font-semibold text-lg transition-all ${
            currentPath.includes(tab.path)
              ? "bg-my-blue-1 text-white border-b-4 border-my-blue-1"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}
