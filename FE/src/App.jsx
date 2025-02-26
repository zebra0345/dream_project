import "./App.css";
import { RecoilRoot } from "recoil";
import { Suspense, useEffect  } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes";
import Loading from "./components/common/Loading";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SideNavbar from "./components/common/SideNavbar";
import SuccessModal from '/src/components/common/modal/SuccessModal';

// OpenVidu 관련 상수
// const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production' ? '' : 'https://demos.openvidu.io/';

export default function App() {
  const location = useLocation();
  const hideFooterPaths = ["/join","/findpw","/findid", "/login","/documents","/challenge/create", "/video","/challenge/list"];
  const hideSideNavbarPaths = ["/join","/findpw","/findid", "/login","/documents", "/video"];
  const hideHeaderPaths = ["/login","/findpw","/findid", "/documents", "/video"];

  // 페이지 전환 시 스크롤 초기화
  useEffect(() => {
    window.scrollTo(0, 0); // (x, y) 좌표로 스크롤 이동. (0, 0)은 페이지 최상단
  }, [location.pathname]); // location.pathname이 변경될 때마다 실행

  const shouldHideFooter = hideFooterPaths.includes(location.pathname) || location.pathname.startsWith('/video/');
  const shouldHideSideNavbar = hideSideNavbarPaths.includes(location.pathname) || location.pathname.startsWith('/video/');
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname) || location.pathname.startsWith('/video/');
  return (
    <RecoilRoot>
      <div className="h-screen w-full bg-gray-100 dark:bg-gray-800 relative ">  
        {!shouldHideHeader && <Header />}
        {!shouldHideSideNavbar && <SideNavbar />}
        {!shouldHideHeader && <main className=" bg-gray-100"> 
          {/* 모든 페이지에서 pt-16 (Header.jsx에서 헤더높이를 h-16으로 해둠) + bg-gray-100는 로그인페이지 배경색색 */}
        </main>}
          <Suspense fallback={<Loading />}>
            <AppRoutes />
          </Suspense>
          <SuccessModal/>
        {!shouldHideFooter && <Footer />}
      </div>
    </RecoilRoot>
  );
}