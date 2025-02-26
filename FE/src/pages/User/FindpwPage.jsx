import { Link, useNavigate } from "react-router-dom";
import testlogo from "/logo/dreammoa.png";

import { useEffect, useState } from "react";
import authChangeApi from "../../services/api/authChangeApi.js";
import { authApi } from "../../services/api/authApi.js";
import { useSetRecoilState } from "recoil";
import { successModalState } from '/src/recoil/atoms/modalState';
import { motion } from 'framer-motion';
import {
  validateEmail,
  validatePassword,
} from "/src/utils/validation";


export default function FindpwPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setSuccessModalState = useSetRecoilState(successModalState);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailButtonDisabled, setIsEmailButtonDisabled] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] =useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [firstpassword, setFirstpassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState("");
  const [finerrorMessage, setFinErrorMessage] = useState("");

  const handleFinSubmit = () => {
    const validationResult = validatePassword(confirmpassword, email);
    if (validationResult === '') {
      console.log("완료!!");
      setTimeout(() => {
        navigate('/login')
        setSuccessModalState({
          isOpen: true,
          message: "변경 완료!",
          onCancel: () => {
            // 실행 취소 시 수행할 작업
            console.log('작업 취소됨');
          },
          isCancellable: false, // 실행 취소 버튼 표시 여부
        });
      }, 2000);
    } else {
      setFinErrorMessage(validationResult);
    }
  };

  const handleChange = (e) => {
    if (isEmailVerified) {
      return;
    }
    setEmail(e.target.value);
    setError('');
  };
  const handleVerificationChange = (e) => {
    setVerificationCode(e.target.value);
    setError('');
  };
  const handleChangePassword = (e) => {
    setFirstpassword(e.target.value);
  };
  const handleChangePassword2 = (e) => {
    setConfirmpassword(e.target.value);
  };

  // 비밀번호 일치여부검사
  useEffect(() => {
    if (confirmpassword) {
      setIsPasswordCorrect(firstpassword === confirmpassword);
    } else {
      setIsPasswordCorrect(null);
    }
  }, [firstpassword, confirmpassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 이메일 형식 검증
    if (!validateEmail(email)) {
      setError('유효한 이메일 주소를 입력해주세요');
      return;
    }

    try {
      setIsLoading(true);
      // API 호출 예시
      const response = await authChangeApi.checkUserPassword(email);
      console.log('비번찾기 응답내용:', response);

      // if (!data.exists) {
      //   setError('등록되지 않은 이메일입니다.');
      //   return;
      // }
      if (response) {  // 실제 응답 구조에 맞게 수정하세요
        // 성공 시 처리
        // navigate('/documents', { state: { email } });
        // navigate('/login')
      } else {
        setError('등록되지 않은 이메일입니다.');
      }

    } catch (error) {
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.log("이메일형식검증 중 에러:", error);
      
    } finally {
      setIsLoading(false);
    }
  };

  // 인증메일을 발송했습니다. 이메일을 확인해 주세요.
  const handleSuccess = (myMessage ) => {
    // 작업 완료 후
    setSuccessModalState({
      isOpen: true,
      message: myMessage,
      onCancel: () => {
        // 실행 취소 시 수행할 작업
        console.log('작업 취소됨');
      },
      isCancellable: false, // 실행 취소 버튼 표시 여부
    });
  };
  // 이메일 인증번호 받기
  const handleGetVerification = async () => {
    setIsLoading(true);
    try {
      // 이메일 중복 확인
      const response = await authApi.checkEmail(email);
      const isAvailable = response.available;

      if (isAvailable) {
        setIsLoading(false);
        console.log("응 이메일 존재하지 않아.");
        
        navigate("/login");
        return;
      }

      // 인증번호 발송
      await authApi.sendVerificationCode(email);
      setIsLoading(false);

      // Swal.fire({
      //   icon: "success",
      //   text: "인증메일을 발송했습니다.",
      // });
      handleSuccess("인증메일을 발송했습니다. 이메일을 확인해 주세요.")


      setIsCodeSent(true);
      setIsEmailButtonDisabled(true); // 인증번호 받기 버튼 비활성화
    } catch (error) {
      // setIsLoading(false);
      // Swal.fire({
      //   icon: "error",
      //   text: "인증메일 발송 중 오류가 발생했습니다.",
      // });
      console.log("인증메일 발송에러 : ",error);
      
      handleSuccess("인증메일 발송 중 오류가 발생했습니다.")
    }
  };
  // 인증번호 확인
  const handleVerifyCode = async () => {
    try {
      await authApi.verifyEmailCode(email, verificationCode);

      handleSuccess("인증번호가 일치합니다.")
      setIsEmailVerified(true);
    } catch (error) {
      console.log("인증메일 일치에러 : ",error);
      handleSuccess("인증번호가 일치하지 않습니다. 다시 입력해 주세요.")
    }
  };
  const handleFocus = (e) => {
    setFocusedField(e.target.name);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };


  return (
    <>
    <div>
      {/* 별별 */}
      <div className="fixed top-0 left-0 right-0 z-10 p-4 flex justify-start">
        <Link to="/">
          <img src={testlogo} alt="로고" className="h-10 w-auto" />
        </Link>
      </div>
      {/* 화면 전체 */}
      <div className="min-h-screen flex bg-gray-100 flex-col 
                        items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* 가운데 상자 */}
        <div className="max-w-md w-full relative p-8 rounded-lg shadow-lg bg-gray-100">
          {/* 제목 */}
          <div className="mb-6 ">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              DreamMoa
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 tracking-wider">
              비밀번호를 찾고자하는 이메일을 입력해주세요.
            </p>
          </div>
          {/* 입력폼 */}
          <form onSubmit={handleSubmit} >
            {/* 이메일 입력 */}
            <div className="mb-1 bg-yellow-100">
              <label htmlFor="email" className="sr-only">이메일</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={handleChange}
                
                className={`appearance-none relative block w-full 
                  px-5 py-3 border placeholder-gray-500 text-gray-900 
                  border-2 rounded-md text-sm 
                  focus:outline-none focus:ring-indigo-500 focus:border-my-blue-4 focus:z-10 
                  ${!error ? 'border-gray-300' : 'border-my-red'}`}
                placeholder="이메일을 입력해주세요"
                disabled={isLoading || isEmailVerified}
              />
            </div>
            {/* 에러메세지 */}
            {error && (
              <div className="mb-3 text-my-red text-sm text-center">
                {error}
              </div>
            )}
            {/* 버튼 */}

            {/* 남희 인증버튼 배껴오기 */}
            <button
              type="button"
              onClick={handleGetVerification}
              disabled={!validateEmail(email) || isEmailButtonDisabled}
              className={`h-10 px-4 rounded focus:outline-none mt-11 ${
                validateEmail(email) && !isEmailButtonDisabled
                  ? "bg-my-blue-1 hover:bg-hmy-blue-1 text-white"
                  : "bg-gray-300 text-gray-50 cursor-not-allowed"
              }`}
            >
              인증번호 받기
            </button>
            {/* 인증번호 입력 칸 */}
            {isCodeSent && (
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <input
                    name="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={handleVerificationChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="인증번호 6자리를 입력해주세요"
                    disabled={isEmailVerified}
                    className={`
                ${
                  isEmailVerified
                    ? "bg-gray-200 text-my-blue cursor-not-allowed"
                    : ""
                }
                ${
                  focusedField === "verificationCode"
                    ? "bg-my-blue-5 text-black"
                    : "bg-white"
                }
              `}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={!verificationCode || isEmailVerified}
                  className={`h-10 px-4 rounded focus:outline-none mt-4 ${
                    verificationCode && !isEmailVerified
                      ? "bg-my-blue-1 hover:bg-hmy-blue-1 text-white"
                      : "bg-gray-300 text-gray-50 cursor-not-allowed"
                  }`}
                >
                  인증번호 확인
                </button>
              </div>
            )}
            {/* 비밀번호 입력칸 */}
            <div className="flex flex-col gap-3 mt-3">
              <div>
                <div className="flex ">
                  비밀번호 
                </div>
                <input
                  label="비밀번호"
                  name="password"
                  type="password"
                  value={firstpassword}
                  onChange={handleChangePassword}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="8~16자로 입력해주세요"
                  className={
                    focusedField === "password" ? "bg-my-blue-5 text-black" : "bg-white"
                  }
                />
              </div>
              <div>
                <input
                  label="비밀번호 확인"
                  name="confirmpassword"
                  type="password"
                  value={confirmpassword}
                  onChange={handleChangePassword2}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="비밀번호를 다시 입력해주세요"
                  className={
                    focusedField === "confirmpassword"
                      ? "bg-my-blue-5 text-black"
                      : "bg-white"
                  }
                />
              </div>
            </div>
            {confirmpassword && !finerrorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm ${isPasswordCorrect ? 'text-green-600' : 'text-red-600'}`}
              >
                {isPasswordCorrect 
                  ? '비밀번호가 일치합니다.' 
                  : '비밀번호가 일치하지 않습니다.'}
              </motion.div>
            )}
            {finerrorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600"
              >
                {finerrorMessage}
              </motion.div>
            )}
            <button
              onClick={handleFinSubmit}
              disabled={!isPasswordCorrect || !email}
              className={`w-full py-2 rounded-md ${
                isPasswordCorrect && email
                  ? 'bg-my-blue-1 text-white hover:bg-hmy-blue-1'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              SUCCESS
            </button>
            <button
              type="submit"
              
              className="w-full mt-1 flex justify-center py-1 px-4 border border-transparent 
                text-sm font-medium rounded-md text-my-blue-1 1 mb-6
                  focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-indigo-500"
              disabled={true}
            >
              {isLoading ? '확인중...' : ''}
            </button>





          </form>
        </div>
        {/* 최하단 아이디 찾기 */}
        <div className="flex justify-center space-x-3 items-center ">
          <Link to="/findid" className="text-xs text-my-blue-4 hover:text-hmy-blue-4">
            아이디가 기억나지 않나요?
          </Link>
          <Link to="/findid" className="text-sm text-my-blue-1 hover:text-hmy-blue-2">
            아이디 찾기
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}