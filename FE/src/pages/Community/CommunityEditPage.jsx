import { useEffect } from "react";
import { useParams } from "react-router-dom";
import CommunityForm from "../../components/community/CommunityForm";
import communityApi from "../../services/api/communityApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

console.log("CommunityEditPage 렌더링");

export default function CommunityEditPage() {
  console.log("CommunityEditPage 렌더링");

  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const data = await communityApi.getDetail(postId);
      console.log("CommunityEditPage - Fetched post:", data); // 응답 전체 로그 찍기
      setPost(data);
    };
    fetchPost();
  }, [postId]);

  if (!post) return null;

  return (
    <div className="bg-my-blue-1 flex flex-col min-h-screen w-full">
      <div className="flex-grow w-[800px] max-w-screen-lg mx-auto p-6 bg-gray-300 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">글 수정</h1>
        <CommunityForm key={post.postId} initialData={post} mode="edit" />
      </div>
    </div>
  );
}
