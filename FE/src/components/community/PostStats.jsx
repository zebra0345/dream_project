// 좋아요 & 댓글 개수를 표시
import { FaRegComment } from "react-icons/fa";
import LikeToggleButton from "./LikeToggleButton";

export default function PostStats({ postId, likes = 0, comments = 0 }) {
  return (
    <div className="flex items-center space-x-6 mt-6 text-gray-500">
      {/* 좋아요 부분을 LikeToggleButton으로 대체 */}
      <LikeToggleButton postId={postId} initialLikes={likes} />

      {/* 댓글 부분은 그대로 유지 */}
      <span className="flex items-center gap-1">
        <FaRegComment />
        {typeof comments === "number" ? comments : 0} 댓글
      </span>
    </div>
  );
}