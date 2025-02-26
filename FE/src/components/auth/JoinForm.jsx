import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../services/api/authApi";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateNickname,
} from "../../utils/validation";
import AuthInput from "./AuthInput.jsx";
import LoadingModal from "../common/modal/LoadingModal";
import Swal from "sweetalert2";
import { AnimatePresence } from "framer-motion";
import { useSetRecoilState } from "recoil";
import { successModalState } from '/src/recoil/atoms/modalState';

const JoinForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    password: "",
    confirmpassword: "",
    name: "",
    nickname: "",
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailButtonDisabled, setIsEmailButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [wasNicknameChanged, setWasNicknameChanged] = useState(false); // 닉네임이 한번이라도 인증되었는지 추적
  const setSuccessModalState = useSetRecoilState(successModalState);
  
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
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 이메일이 인증되었다면 수정 불가
    if (name === "email" && isEmailVerified) {
      return;
    }

    // 닉네임이 변경되면 인증 상태 초기화
    if (name === "nickname") {
      if (isNicknameVerified) {
        setIsNicknameVerified(false);
        setWasNicknameChanged(true);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

  const handleFocus = (e) => {
    setFocusedField(e.target.name);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };
  const validateField = (name, value) => {
    let errorMessage = "";
    switch (name) {
      case "email":
        errorMessage = !validateEmail(value)
          ? "유효한 이메일 주소를 입력해주세요"
          : "";
        break;
      case "password":
        errorMessage = validatePassword(value, formData.email);

        if (formData.confirmpassword && value !== formData.confirmpassword) {
          setErrors((prev) => ({
            ...prev,
            confirmpassword: "비밀번호가 일치하지 않습니다",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            confirmpassword: "",
          }));
        }
        break;
      case "confirmpassword":
        errorMessage =
          value !== formData.password ? "비밀번호가 일치하지 않습니다" : "";
        break;
      case "name":
        errorMessage = validateName(value);
        break;
      case "nickname":
        errorMessage = validateNickname(value);
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  // 이메일 인증번호 받기
  const handleGetVerification = async () => {
    setIsLoading(true);
    try {
      // 이메일 중복 확인
      const response = await authApi.checkEmail(formData.email);
      const isAvailable = response.available;

      if (!isAvailable) {
        setIsLoading(false);
        const result = await Swal.fire({
          icon: "warning",
          text: "이미 사용 중인 이메일입니다.",
          showCancelButton: true,
          confirmButtonText: "로그인 페이지로 이동",
          cancelButtonText: "취소",
          confirmButtonColor: "#88A9D5",
          cancelButtonColor: "#B9CFDA",
        });

        if (result.isConfirmed) {
          navigate("/login");
        }
        return;
      }

      // 인증번호 발송
      await authApi.sendVerificationCode(formData.email);
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
      handleSuccess("인증메일 발송 중 오류가 발생했습니다.")
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    try {
      await authApi.verifyEmailCode(formData.email, formData.verificationCode);

      // Swal.fire({
      //   icon: "success",
      //   text: "인증번호가 일치합니다.",
      // });
      handleSuccess("인증번호가 일치합니다.")

      setIsEmailVerified(true);
    } catch (error) {
      // Swal.fire({
      //   icon: "error",
      //   text: "인증번호가 일치하지 않습니다.",
      // });
      handleSuccess("인증번호가 일치하지 않습니다. 다시 입력해 주세요.")
    }
  };

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    try {
      const isAvailable = await authApi.checkNickname(formData.nickname);

      if (isAvailable) {
        // Swal.fire({
        //   icon: "success",
        //   text: "사용 가능한 닉네임입니다.",
        // });
        handleSuccess("사용 가능한 닉네임입니다.")
        setIsNicknameVerified(true);
        setWasNicknameChanged(false);
      } else {
        // Swal.fire({
        //   icon: "error",
        //   text: "이미 사용 중인 닉네임입니다.",
        // });
        handleSuccess("이미 사용 중인 닉네임입니다.")
        setIsNicknameVerified(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.message,
      });
    }
  };

  useEffect(() => {
    const isValid =
      formData.email.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.confirmpassword.trim() !== "" &&
      formData.name.trim() !== "" &&
      formData.nickname.trim() !== "" &&
      isEmailVerified &&
      isNicknameVerified &&
      !errors.email &&
      !errors.password &&
      !errors.confirmpassword &&
      !errors.name &&
      !errors.nickname;

    setIsFormValid(isValid);
  }, [formData, errors, isEmailVerified, isNicknameVerified]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      const { email, password, name, nickname } = formData;
      await authApi.join(email, password, name, nickname, isEmailVerified);

      await Swal.fire({
        icon: "success",
        title: "회원가입 완료",
        confirmButtonColor : "#003458", // ######################################## 추가Z
        text: "회원가입이 정상적으로 완료되었습니다.",
        confirmButtonText: "로그인 페이지로 이동",
      });
      navigate("/login");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "회원가입 처리 중 오류가 발생했습니다.",
      }));

      Swal.fire({
        icon: "error",
        title: "오류",
        text: error.message || "회원가입 처리 중 오류가 발생했습니다.",
        confirmButtonText: "확인",
      });
    }
  };

  return (
    <>
    <AnimatePresence>
      {isLoading && <LoadingModal />}
    </AnimatePresence>
    
      <form onSubmit={handleSubmit} className="space-y-0">
        <div className="space-y-0">
          {/* 이메일 입력 칸 */}
          <div className="flex items-center space-x-2 mb-0">
            <div className="flex-1">
              <AuthInput
                label="이메일"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={errors.email}
                placeholder="example@email.com"
                disabled={isEmailVerified}
                className={`
            ${
              isEmailVerified
                ? "bg-gray-200 text-my-blue cursor-not-allowed"
                : ""
            }
            ${focusedField === "email" ? "bg-my-blue-5 text-black" : "bg-white"}
          `}
              />
            </div>
            <button
              type="button"
              onClick={handleGetVerification}
              disabled={!validateEmail(formData.email) || isEmailButtonDisabled}
              className={`h-10 px-4 rounded focus:outline-none mt-11 ${
                validateEmail(formData.email) && !isEmailButtonDisabled
                  ? "bg-my-blue-1 hover:bg-hmy-blue-1 text-white"
                  : "bg-gray-300 text-gray-50 cursor-not-allowed"
              }`}
            >
              인증번호 받기
            </button>
          </div>

          {/* 인증번호 입력 칸 */}
          {isCodeSent && (
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <AuthInput
                  name="verificationCode"
                  type="text"
                  value={formData.verificationCode}
                  onChange={handleChange}
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
                disabled={!formData.verificationCode || isEmailVerified}
                className={`h-10 px-4 rounded focus:outline-none mt-4 ${
                  formData.verificationCode && !isEmailVerified
                    ? "bg-my-blue-1 hover:bg-hmy-blue-1 text-white"
                    : "bg-gray-300 text-gray-50 cursor-not-allowed"
                }`}
              >
                인증번호 확인
              </button>
            </div>
          )}
        </div>

        <AuthInput
          label="비밀번호"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          error={errors.password}
          placeholder="8~16자로 입력해주세요"
          className={
            focusedField === "password" ? "bg-my-blue-5 text-black" : "bg-white"
          }
        />
        <AuthInput
          label="비밀번호 확인"
          name="confirmpassword"
          type="password"
          value={formData.confirmpassword}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          error={errors.confirmpassword}
          placeholder="비밀번호를 다시 입력해주세요"
          className={
            focusedField === "confirmpassword"
              ? "bg-my-blue-5 text-black"
              : "bg-white"
          }
        />
        <AuthInput
          label="이름"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          error={errors.name}
          placeholder="이름을 입력해주세요"
          className={
            focusedField === "name" ? "bg-my-blue-5 text-black" : "bg-white"
          }
        />
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <AuthInput
              label="닉네임"
              name="nickname"
              type="text"
              value={formData.nickname}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              error={errors.nickname}
              placeholder="닉네임을 입력해주세요"
              className={
                focusedField === "nickname"
                  ? "bg-my-blue-5 text-black"
                  : "bg-white"
              }
            />
          </div>
          <button
            type="button"
            onClick={handleCheckNickname}
            disabled={
              !formData.nickname ||
              errors.nickname ||
              (isNicknameVerified && !wasNicknameChanged)
            }
            className={`h-10 w-32 px-4 rounded focus:outline-none mt-11 ${
              formData.nickname &&
              !errors.nickname &&
              (!isNicknameVerified || wasNicknameChanged)
                ? "bg-my-blue-1 hover:bg-hmy-blue-1 text-white"
                : "bg-gray-300 text-gray-50 cursor-not-allowed"
            }`}
          >
            중복 확인
          </button>
        </div>

        {errors.submit && (
          <div className="text-red-500 text-sm text-center">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={!isFormValid}
          className={`!mt-5 w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isFormValid
              ? "bg-my-blue-1 hover:bg-hmy-blue-1 text-white"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          회원가입
        </button>
      </form>
    </>
  );
};

export default JoinForm;
