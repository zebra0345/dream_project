import JoinForm from "../../components/auth/JoinForm";

const JoinPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            서비스를 이용하기 위해 회원가입을 해주세요
          </p>
        </div>
        <JoinForm />
      </div>
    </div>
  );
};

export default JoinPage;
