import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { authState, userState } from "../../recoil/atoms/authState";
import dreammoaLogo from "/logo/dreammoa.png";
import useAuth from "../../hooks/useAuth";
import { RiAdminFill } from "react-icons/ri";
import { CiLogin, CiLogout } from "react-icons/ci";

// 별빛 효과
const generateStars = (count) => {
  return Array.from({ length: count }, () => ({
    width: Math.random() * 3 + 1, // 1-4px 크기의 별
    left: Math.random() * 100, // 0-100% 위치
    top: Math.random() * 100, // 0-100% 위치
    delay: Math.random() * 3, // 0-3초 딜레이
  }));
};

// 별 개수 100개
const stars = generateStars(50);

// 반짝반짝 밤하늘 컴포넌트
const StarryBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {stars.map((star, i) => (
      <div
        key={i}
        className="absolute bg-white/70 rounded-full animate-twinkle"
        style={{
          width: `${star.width}px`,
          height: `${star.width}px`,
          left: `${star.left}%`,
          top: `${star.top}%`,
          animationDelay: `${star.delay}s`,
        }}
      />
    ))}
  </div>
);

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useRecoilValue(authState);
  const { logout } = useAuth();
  const [UserInfo, setUserInfo] = useRecoilState(userState);

  // 로그아웃
  const handleLogout = async () => {
    if (isAuthenticated) {
      try {
        await logout();
        setUserInfo(null);
        navigate("/login");
      } catch (error) {
        console.error("Logout error:", error);
      }
    } else {
      navigate("/login");
    }
  };

  // Login 페이지에서는 헤더 렌더링 안 함
  // if (location.pathname === "/login") return null;

  return (
    // className="flex justify-between items-center p-4"
    // 모든 페이지에서 pt-16적용중(App.jsx) (Header.jsx에서 헤더높이를 h-16으로 해둠)
    // style={{ backgroundColor: "#003458" }}
    <header className="relative top-0 left-0 right-0 flex justify-between items-center p-4 z-[999] h-16 bg-hmy-blue-1">
      {/* 별이 빛나는 배경 추가 */}
      <StarryBackground />

      {/* 로고 영역 */}
      <div>
        <Link to="/">
          <img src={dreammoaLogo} alt="로고" className="h-10 w-auto" />
        </Link>
      </div>

      {/* 관리자 및 로그인/아웃 버튼 영역 */}
      <div className="flex items-center gap-4">
        {/* 관리자 버튼 */}
        {UserInfo && UserInfo.role === "ADMIN" && (
          <Link to="/admin">
            <RiAdminFill className="h-8 w-8 text-white hover:text-gray-200 transition-colors" />
          </Link>
        )}

        {/* 로그인/로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white px-4 py-2 rounded hover:bg-white/10 transition-colors"
        >
          {UserInfo ? (
            <>
              <CiLogout className="h-6 w-6" />
              {/* <span>로그아웃</span> */}
            </>
          ) : (
            <>
              <CiLogin className="h-6 w-6" />
              {/* <span>로그인</span> */}
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
