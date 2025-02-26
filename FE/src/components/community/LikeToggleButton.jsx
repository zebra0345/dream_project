import { useState, useEffect } from "react";
import likeApi from "../../services/api/likeApi";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/atoms/authState";

export default function LikeToggleButton({ postId, initialLikes = 0 }) {
  const currentUser = useRecoilValue(userState);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  // ✅ 페이지 처음 들어왔을 때 사용자가 이미 좋아요 눌렀는지 체크
  useEffect(() => {
    if (!currentUser) return;

    likeApi
      .checkIfLiked(postId)
      .then((res) => setIsLiked(res.data)) // 서버에서 true/false 응답
      .catch((err) => console.error("좋아요 상태 확인 실패:", err));

      // 게시글의 최신 좋아요 수 가져오기
  likeApi
  .getLikeCount(postId)
  .then((res) => setLikeCount(res.data))
  .catch((err) => console.error("좋아요 개수 조회 실패:", err));
  }, [postId, currentUser]);

  const handleToggleLike = async () => {
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      if (isLiked) {
        await likeApi.removeLike(postId);
      } else {
        await likeApi.addLike(postId);
      }

      // ✅ 좋아요 상태 토글 및 최신 카운트 조회
      setIsLiked(!isLiked);
      const { data } = await likeApi.getLikeCount(postId);
      setLikeCount(data);
    } catch (err) {
      console.error("좋아요/취소 에러:", err);
    }
  };

  return (
    <span
      className="flex items-center gap-1 cursor-pointer"
      onClick={handleToggleLike}
    >
      {isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
      {likeCount} 좋아요
    </span>
  );
}
