import { Link, useNavigate } from "react-router-dom";
import testlogo from "/logo/dreammoa.png";

import { useEffect, useState } from "react";
import authChangeApi from "../../services/api/authChangeApi.js";

export default function FindidPage() {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hereYouR, setHereYouR] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      navigate('/login');
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setError('');
  };
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setIsLoading(true);
      const response = await authChangeApi.checkUserEmail(name, nickname);
      console.log('찾은 이메일:', response);
      if (response) {
        setHereYouR(response)
        setCountdown(10);
      } else {
        setError('아이디를 찾을 수 없습니다.');
      }
    } catch (error) {
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.log("아이디찾기 에러: ",error);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 p-4 flex justify-start">
        <Link to="/">
          <img src={testlogo} alt="로고" className="h-10 w-auto" />
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full relative bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              DreamMoa
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 tracking-wider">
              아이디를 찾기 위해 이름과 닉네임을 입력해주세요.
            </p>
          </div>

          <div className="mb-1">
            <label htmlFor="text" className="sr-only">이름</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              className={`appearance-none relative block w-full 
                px-5 py-3 border placeholder-gray-500 text-gray-900 
                border-2 rounded-md text-sm 
                focus:outline-none focus:ring-indigo-500 focus:border-my-blue-4 focus:z-10 
                ${!error ? 'border-gray-300' : 'border-my-red'}`}
              placeholder="이름을 입력해주세요"
              disabled={isLoading}
            />
          </div>
          <div className="mb-1">
            <label htmlFor="text" className="sr-only">닉네임</label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              required
              value={nickname}
              onChange={handleNicknameChange}
              className={`appearance-none relative block w-full 
                px-5 py-3 border placeholder-gray-500 text-gray-900 
                border-2 rounded-md text-sm 
                focus:outline-none focus:ring-indigo-500 focus:border-my-blue-4 focus:z-10 
                ${!error ? 'border-gray-300' : 'border-my-red'}`}
              placeholder="닉네임을 입력해주세요"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="mb-3 text-my-red text-sm text-center">
              {error}
            </div>
          )}
          {hereYouR && (
            <div>
              <p>찾은 이메일: {hereYouR}</p>
              {countdown && (
                <p>{countdown}초 후 로그인 페이지로 이동합니다.</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent 
              text-sm font-medium rounded-md text-white bg-my-blue-1 mb-6
              hover:bg-hmy-blue-1 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            {isLoading ? '확인중...' : 'Continue'}
          </button>

          <div className="flex justify-center space-x-3 items-center">
            <Link to="/findid" className="text-sm text-my-blue-4 hover:text-hmy-blue-4">
            계정이 필요하신가요?
            </Link>
            <Link to="/findid" className="text-sm text-my-blue-1 hover:text-hmy-blue-2">
            회원가입
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}