import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import communityApi from "../../services/api/communityApi";
import { userState } from "../../recoil/atoms/authState";
import Button from "../../components/community/Buttons";
import { useRecoilValue } from "recoil";
import PostContent from "../../components/community/PostContent";
import PostStats from "../../components/community/PostStats";
import CommentSection from "../../components/community/CommentSection";

export default function CommunityDetailPage() {
  const { postId } = useParams();
  console.log("현재 postId:", postId); // postId 확인
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [likeCount, setLikeCount] = useState(0); // 최신 좋아요 개수 저장
  const [commentCount, setCommentCount] = useState(0); // 최신 댓글 개수 저장
  const currentUser = useRecoilValue(userState);

  const isOwner = post && currentUser?.nickname === post?.userNickname;

  // `state.sortOption`이 없으면 URL에서 `?sort=` 값 가져오기
  const queryParams = new URLSearchParams(location.search);
  const urlPage = queryParams.get("page") || "1";
  const urlSort = queryParams.get("sort") || "최신순"; // 기본값 최신순
  const searchQuery =
    location.state?.searchQuery || queryParams.get("search") || ""; // 검색어 유지
  const currentPage =
    location.state?.page !== undefined ? location.state.page : Number(urlPage);
  const currentSort = location.state?.sortOption || urlSort; // sortOption 유지

  console.log(
    "📌 목록보기 버튼 클릭 시 이동할 페이지:",
    currentPage,
    "정렬 기준:",
    currentSort
  ); // 디버깅 로그 추가

  useEffect(() => {
    if (!postId) {
      console.error("❌ postId가 undefined 입니다.");
      return; // postId가 없으면 API 호출 안 함
    }

    const fetchPost = async () => {
      try {
        console.log(`Fetching post with ID: ${postId}`);
        const detailData = await communityApi.getDetail(postId);
        console.log("상세 조회 응답 데이터:", detailData); // 백엔드 응답 확인
        setPost(detailData);

        // 최신 좋아요 수 & 댓글 수 불러오기
        const likeData = await communityApi.getLikeCount(postId);
        const commentData = await communityApi.getCommentCount(postId);
        // API 응답이 숫자가 아닐 경우 기본값 0을 설정
        setLikeCount(typeof likeData === "number" ? likeData : 0);
        setCommentCount(typeof commentData === "number" ? commentData : 0);
      } catch (error) {
        console.error("게시글을 불러오는 중 오류 발생:", error);
      }
    };

    fetchPost();
  }, [postId]);

  // 삭제 처리 함수 추가
  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await communityApi.delete(postId);
        alert("게시글이 삭제되었습니다.");
        // 삭제 후 목록 페이지로 이동 (예: 자유게시판)
        navigate("/community/free?page=1&sort=최신순");
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  if (!post) {
    return <p className="text-center text-gray-500">게시글을 불러오는 중...</p>;
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl w-full p-6 bg-white shadow-md rounded mb-10">
        {/* 제목 + 목록보기 버튼 (우측 상단) */}
        <div className="grid grid-cols-[1fr_auto] items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold truncate overflow-hidden whitespace-nowrap">
            {post.title}
          </h1>
          <Button
            type="back"
            category={post.category}
            page={currentPage}
            sortOption={currentSort}
          />
        </div>

        <PostContent
          userNickname={post.userNickname}
          createdAt={post.createdAt}
          content={post.content}
        />

        <div className="mt-16"></div>

        {/* 등록된 태그만 표시 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="border-t border-gray-300 my-6"></div>

        <PostStats postId={postId} likes={likeCount} comments={commentCount} />

        {isOwner && (
          <div className="flex space-x-4 mt-6">
            <Button type="edit" postId={postId} />
            <Button type="delete" postId={postId} onDelete={handleDelete} />
          </div>
        )}

        <CommentSection postId={postId} />
      </div>
    </div>
  );
}
