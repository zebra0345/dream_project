import { useNavigate, useLocation } from "react-router-dom";

export default function Button({
  type,
  postId,
  onDelete,
  category,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    switch (type) {
      case "edit":
        navigate(`/community/edit/${postId}`);
        break;
      case "delete":
        onDelete();
        break;
      case "back":
        // 전달된 state가 있고, from 값이 "list"인 경우에는 history.back()
        if (location.state && location.state.from === "list") {
          window.history.back();
        } else {
          let listUrl = "/community";
          if (category === "자유") listUrl = "/community/free";
          if (category === "질문") listUrl = "/community/qna";
          navigate(listUrl);
        }
        break;
      default:
        console.warn("Button type이 잘못 설정됨:", type);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 text-white rounded ${
        type === "edit" ? "bg-my-blue-1" : type === "delete" ? "bg-my-blue-1" : "bg-my-blue-1"
      }`}
    >
      {type === "edit" ? "수정" : type === "delete" ? "삭제" : "목록보기"}
    </button>
  );
}
