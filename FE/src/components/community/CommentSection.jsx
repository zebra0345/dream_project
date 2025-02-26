import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/atoms/authState";
import communityApi from "../../services/api/communityApi";
import CommentItem from "./CommentItem";

export default function CommentSection({ postId }) {
  const currentUser = useRecoilValue(userState);

  // 서버에서 가져온 전체 댓글(계층형 구조)
  const [comments, setComments] = useState([]);

  // 새로 작성할 '최상위 댓글' 입력값
  const [newComment, setNewComment] = useState("");
  
   // `fetchComments`를 useEffect 바깥에서 정의
   const fetchComments = async () => {
    try {
      const response = await communityApi.getCommentsHierarchy(postId);
      console.log("백엔드에서 가져온 댓글 목록:", response.data); // ✅ 중복 여부 확인
      setComments(response.data);
    } catch (error) {
      console.error("댓글을 가져오는 중 오류 발생:", error);
    }
  };

  // 컴포넌트가 마운트되면 댓글 목록 요청
  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [postId]);

  // 최상위 댓글 작성
  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    try {
      await communityApi.createComment(postId, {
        content: newComment,
        parentCommentId: null, // 최상위 댓글이므로 null
      });
      setNewComment("");  // 입력창 초기화
      fetchComments();    // 다시 불러오기
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold">댓글</h2>

      {/* 최상위 댓글 작성 폼 */}
      <div className="flex items-center mt-4 space-x-2">
        <textarea
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
          rows={2}
          placeholder="댓글을 작성하세요."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ resize: "none", height: "70px" }}
        />
        <button
          onClick={handleCreateComment}
          className="px-4 py-2 w-auto whitespace-nowrap bg-my-blue-1 text-white rounded hover:bg-my-blue-2"
          style={{ height: "70px" }}
        >
          등록
        </button>
      </div>

      {/* 댓글 리스트 (최상위) */}
      <div className="mt-6 space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            currentUser={currentUser}
            postId={postId}
            fetchComments={fetchComments}
            depth={0} // 계층 깊이를 알려주면 들여쓰기 등에 활용할 수 있음
          />
        ))}
      </div>
    </div>
  );
  
}
