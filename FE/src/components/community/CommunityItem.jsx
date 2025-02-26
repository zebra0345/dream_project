import { Link, useLocation } from "react-router-dom";
import { FaRegThumbsUp, FaRegComment } from "react-icons/fa";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import communityApi from "../../services/api/communityApi";
import likeApi from "../../services/api/likeApi";

export default function CommunityItem({ post }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentPage = queryParams.get("page") || "1";
  const currentSort = queryParams.get("sort") || "최신순"; // 현재 정렬 옵션 가져오기

  const [likeCount, setLikeCount] = useState(0); // 좋아요 수 상태
  const [commentCount, setCommentCount] = useState(0); // 댓글 수 상태

  // ✅ postId가 undefined가 아닌지 체크
  const postId = post.postId || post.id;

  // createdAt을 YYYY/MM/DD HH:mm 형식으로 변환
  const formattedDate = post.createdAt
    ? format(new Date(post.createdAt), "yyyy/MM/dd HH:mm")
    : "날짜 없음"; // 만약 createdAt이 없으면 기본값 처리

  // ✅ 좋아요 수 & 댓글 수 불러오기
  useEffect(() => {
    console.log("📌 CommunityItem 렌더링됨 - post:", post); // ✅ post 데이터 전체 확인
    console.log("📌 postId 값 확인:", postId); // ✅ postId 값 확인

    if (!postId) {
      console.error("❌ postId가 없습니다! API 요청을 하지 않음");
      return; // postId가 없으면 API 요청을 하지 않음
    }

    async function fetchCounts() {
      try {
        const likeData = await communityApi.getLikeCount(postId);
        const commentData = await communityApi.getCommentCount(postId);

        console.log("✅ 좋아요 API 응답 데이터:", likeData);
        console.log("✅ 댓글 API 응답 데이터:", commentData);

        setLikeCount(likeData); // ✅ API 응답의 `data`를 사용
        setCommentCount(commentData);
      } catch (error) {
        console.error("좋아요/댓글 수 불러오기 실패:", error);
      }
    }

    fetchCounts();
  }, [post]); // ✅ post가 변경될 때만 실행

  console.log(
    "📌 CommunityItem 렌더링됨 - 현재 페이지:",
    currentPage,
    "정렬 기준:",
    currentSort
  ); // ✅ 디버깅 로그 추가
  console.log("📌 CommunityItem - postId:", postId);
  console.log("📌 CommunityItem - postId:", postId, " id:", post.id);
  return (
    <Link
      to={`/community/detail/${post.postId || post.id}`}
      state={{
        from: "list", // 목록에서 왔음을 표시
        page: Number(currentPage),
        sortOption: currentSort,
        category: post.category,
      }}
      className="block"
    >
      <div className="p-4 border-b border-gray-300 hover:bg-gray-50 transition">
        {/* 사용자 닉네임 및 카테고리
        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
          <span className="font-semibold">{post.userNickname}</span>
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">{post.category}</span>
        </div> */}

        {/* 게시글 제목 */}
        <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>

        {/* 본문 내용 일부 (100자까지만 표시) */}
        <div
          className="mt-2 text-gray-600 text-sm line-clamp-2 not-italic font-normal"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              (post.content.length > 100
                ? post.content.substring(0, 100) + "..."
                : post.content
              ).replace(/<i>|<\/i>|<em>|<\/em>/g, "")
            ),
          }}
        ></div>

        {/* 태그 (나중에 추가 가능) */}
        <div className="flex gap-2 mt-2">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 좋아요 & 댓글 수 */}
        <div className="flex justify-between items-center mt-3 text-gray-500 text-sm">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1">
              <FaRegThumbsUp /> {likeCount}
            </span>
            <span className="flex items-center gap-1">
              <FaRegComment /> {commentCount}
            </span>
          </div>
          <span className="text-xs">{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
}
