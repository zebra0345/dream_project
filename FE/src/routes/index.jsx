import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// 컴포넌트 import
import HomePage from "../pages/HomePage";
import Notfound from "../pages/Notfound";
import Loading from "../components/common/Loading";
import PrivateRoute from "../components/common/PrivateRoute";

import LoginPage from "../pages/User/LoginPage";
import JoinPage from "../pages/User/JoinPage";
import FindidPage from "../pages/User/FindidPage";
import FindpwPage from "../pages/User/FindpwPage";
import DocumentsPage from "../pages/User/DocumentsPage";
import CommunityForm from "../components/community/CommunityForm";

import VideoRoom from '../pages/Video/VideoRoom';
import EndMiddlePage from '../pages/Video/EndMiddlePage';
// import OAuth2RedirectHandler from "../pages/User/OAuth2RedirectHandler";


const ChallengeListPage = lazy(() =>
  import("../pages/Challenge/ChallengeListPage")
);
const ChallengeDetailPage = lazy(() =>
  import("../pages/Challenge/ChallengeDetailPage")
);
const ChallengeCreatePage = lazy(() =>
  import("../pages/Challenge/ChallengeCreatePage")
);
const ChallengeMeetPage = lazy(() =>
  import("../pages/Challenge/ChallengeMeetPage")
);

const CommunityQnAListPage = lazy(() =>
  import("../pages/Community/QnA/CommunityQnAListPage")
);
const CommunityFreeListPage = lazy(() =>
  import("../pages/Community/Free/CommunityFreeListPage")
);

// const CommunityListPage = lazy(() => import("../pages/Community/CommunityListPage"));
const CommunityDetailPage = lazy(() =>
  import("../pages/Community/CommunityDetailPage")
);
const CommunityWritePage = lazy(() =>
  import("../pages/Community/CommunityWritePage")
);
const CommunityEditPage = lazy(() =>
  import("../pages/Community/CommunityEditPage")
);
const AdminPage = lazy(() => import("../pages/Admin/AdminPage"));

const MyPage = lazy(() => import("../pages/User/MyPage"));
const DashBoardPage = lazy(() => import("../pages/User/DashBoardPage"));

export default function AppRoutes() {
  return (
    <Routes>
      {/* 메인 페이지 */}
      <Route path="/" element={<HomePage />} />
      {/* 메인 페이지 하이라이트 경로 */}
      {/* <Route
        path="/Challenge/ChallengeListPage"
        element={<ChallengeListPage />}
      /> */}
      <Route path="/User/DashBoardPage" element={<DashBoardPage />} />
      {/* <Route path="/Community/CommunityListPage" element={<CommunityListPage />} /> */}
      {/* 회원 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/join" element={<JoinPage />} />
      <Route
        path="/mypage"
        element={
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        }
      />{" "}
      {/* 소셜로그인 리다이렉션 요청용페이지 0208테스트 실패  */}
      {/* <Route path="/login/oauth2/code/:provider" element={<OAuth2RedirectHandler />} /> */}
      {/* /user-Info */}
      <Route path="/findid" element={<FindidPage />} /> {/* 아이디 찾기 */}
      <Route path="/findpw" element={<FindpwPage />} /> {/* 비밀번호 찾기 */}
      <Route path="/dashboard" element={<DashBoardPage />} /> {/*대시보드 */}
      <Route path="/documents" element={<DocumentsPage />} /> {/*나의 문서 */}
      {/* 게시판 */}
      <Route
        path="/community/detail/:postId"
        element={<CommunityDetailPage />}
      />
      <Route path="/community/edit/:postId" element={<CommunityEditPage />} />
      {/* 자유게시판과 QnA 게시판을 각각 다른 URL로 설정 */}
      <Route
        path="/community/free"
        element={<CommunityFreeListPage category="자유" />}
      />
      <Route
        path="/community/qna"
        element={<CommunityQnAListPage category="질문" />}
      />
      {/* // 자유게시판 글쓰기 페이지 */}
      <Route
        path="/community/free/write"
        element={<CommunityWritePage boardCategory="자유" />}
      />
      {/* // 질문게시판 글쓰기 페이지 */}
      <Route
        path="/community/qna/write"
        element={<CommunityWritePage boardCategory="질문" />}
      />
      {/* 챌린지 */}
      <Route path="/challenge/list" element={<ChallengeListPage />} />
      <Route path="/challenge/detail/:id" element={<ChallengeDetailPage />} />
      <Route path="/challenge/create" element={<ChallengeCreatePage />} />{" "}
      {/* 챌린지 만들기 */}
      <Route path="/challenge/meet" element={<ChallengeMeetPage />} />{" "}
      {/* 챌린지 미팅 */}
      <Route
        path="/loadingtest"
        element={
          <PrivateRoute>
            <Loading />
          </PrivateRoute>
        }
      />
      <Route path="/video/:roomId" element={<VideoRoom />} />
      <Route path="/video/:roomId/ending" element={<EndMiddlePage />} />
      <Route path="/admin" element={<AdminPage />} />

      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}
