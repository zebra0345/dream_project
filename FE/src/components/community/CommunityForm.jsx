import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import communityApi from "../../services/api/communityApi";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/atoms/authState";
import "react-quill/dist/quill.snow.css";
import "../../components/community/CommunityForm.css";
import ReactQuill from "react-quill";
import { modules, formats } from "../../components/community/quillModules";
import PostTags from "./PostTags";

export default function CommunityForm({
  boardCategory,
  initialData,
  mode = "create",
}) {
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userState);

  console.log("현재 로그인된 사용자 정보:", currentUser);

  const [formData, setFormData] = useState(() => ({
    category: initialData?.category || boardCategory || "",
    title: initialData?.title || "",
    content: initialData?.content || "",
    tags: initialData?.tags || [], //기존 태그 유지
  }));

  const [tags, setTags] = useState([]); //태그 리스트 상태 추가

  useEffect(() => {
    if (mode === "edit" && initialData) {
      console.log(
        "🔄 CommunityForm useEffect - initialData 업데이트됨:",
        initialData
      );
      setFormData({
        category: initialData.category || "",
        title: initialData.title || "",
        content: initialData.content || "",
        tags: initialData.tags || [], //기존 태그 유지
      });
    }
  }, [mode, initialData]);

  console.log("📌 현재 formData:", formData);
  console.log("🏷 현재 태그 목록:", tags);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      console.log("🚀 전송할 데이터:", formData); // formData 확인 로그

      await (mode === "create"
        ? communityApi.create(formData) // 태그 포함하여 저장
        : communityApi.update(initialData.postId, formData));

      if (mode === "edit") {
        navigate(`/community/detail/${initialData.postId}`);
      } else {
        const redirectUrl =
          formData.category === "자유" ? "/community/free" : "/community/qna";
        navigate(redirectUrl);
      }
    } catch (error) {
      console.error("게시글 작성/수정 실패:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>카테고리: {formData.category}</div>

      <div className="relative">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 100) {
              setFormData({ ...formData, title: value });
            }
          }}
          className="w-full p-2 border rounded"
          placeholder="제목"
        />
        <p
          className={`text-sm mt-1 ${
            formData.title.length > 90 ? "text-red-500" : "text-gray-500"
          }`}
        >
          {formData.title.length}/100자
        </p>
      </div>

      {/* Quill 에디터 */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-md">
        <ReactQuill
          value={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
          modules={modules}
          formats={formats}
          placeholder="내용을 입력하세요"
          className="custom-quill-editor font-user-input"
          style={{ height: "400px" }}
        />
      </div>

      {/* 태그 입력 컴포넌트 추가 */}
      <PostTags
        tags={formData.tags}
        setTags={(newTags) => setFormData({ ...formData, tags: newTags })}
        className="w-full"
      />

      <button
        type="submit"
        className="px-4 py-2 bg-my-blue-1 text-white rounded"
      >
        {mode === "create" ? "작성하기" : "수정하기"}
      </button>
    </form>
  );
}
