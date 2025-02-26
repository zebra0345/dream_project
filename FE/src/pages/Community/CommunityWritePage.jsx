import CommunityForm from "../../components/community/CommunityForm";

export default function CommunityWritePage({ boardCategory }) {
  return (
    <div className="bg-my-blue-1 flex flex-col min-h-screen w-full">
      <div className="flex-grow w-[800px] max-w-screen-lg mx-auto p-6 bg-gray-300 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">새 글 작성</h1>
        <CommunityForm mode="create" boardCategory={boardCategory} />
      </div>
    </div>
  );
}
