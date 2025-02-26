// components/video/VideoGrid.jsx
import GridMatrixLayout from "./layouts/GridMatrixLayout";
import SpotlightLayout from "./layouts/SpotlightLayout";
import DynamicGridLayout from "./layouts/DynamicGridLayout";
import MosaicLayout from "./layouts/MosaicLayout";

const VideoGrid = ({
  mainStreamManager, // 메인
  publisher, // 자신
  subscribers, // 다른 참가자들
  screenPublisher, // 화면 공유
  onStreamClick, // 스트림 클릭 핸들러 (메인 화면 전환용)
  currentLayout, // 현재 선택된 레이아웃
}) => {
  const renderLayout = () => {
    // 모든 스트림 포함하는 배열
    // screenPublisher가 있으면 맨 앞에 추가하고, 이후 다른 참가자들의 스트림 추가
    const allStreams = [
      ...(screenPublisher ? [screenPublisher] : []), // 화면 공유 중이면 가장 먼저 추가
      ...subscribers, // 다른 참가자들의 스트림 추가
    ];
    // console.log("통합된 스트림 목록:", allStreams);

    switch (currentLayout) {
      case "default":
        return (
          <GridMatrixLayout // 2분할 그리드 레이아웃
            mainStreamManager={mainStreamManager}
            publisher={publisher}
            subscribers={allStreams}
            onStreamClick={onStreamClick}
          />
        );
      case "Dynamic":
        return (
          <DynamicGridLayout
            mainStreamManager={mainStreamManager}
            publisher={publisher}
            subscribers={allStreams}
            onStreamClick={onStreamClick}
          />
        );

      // 스포트라이트 (메인 엄청 큼)
      case "spotlight":
        return (
          <SpotlightLayout
            mainStreamManager={mainStreamManager}
            publisher={publisher}
            subscribers={allStreams}
            onStreamClick={onStreamClick}
          />
        );
      // teaching 레이아웃은 화면 공유 기능 구현 후 추가 예정
      
      // 모자이크(다양한 크기, 동적임)
      case "mosaic":
        return (
          <MosaicLayout
            mainStreamManager={mainStreamManager}
            publisher={publisher}
            subscribers={allStreams}
            onStreamClick={onStreamClick}
          />
        );

      default:
        return (
          <DynamicGridLayout
            mainStreamManager={mainStreamManager}
            publisher={publisher}
            subscribers={allStreams}
            onStreamClick={onStreamClick}
          />
        );
    }
  };

  // return <div className="w-full h-[calc(100%-80px)]">{renderLayout()}</div>;  // 부모 요소의 높이
  // return <div className="w-full h-[calc(100vh-200px]">{renderLayout()}</div>;  // viewport 높이 기준으로
  return <>{renderLayout()}</>; // 이렇게 하니까 비디오 밑부분 안 짤리고 스크롤은 되어버림(흰부분 보임)
};

export default VideoGrid;
