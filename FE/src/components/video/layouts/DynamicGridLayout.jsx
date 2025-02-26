import UserVideo from "../UserVideo";

const DynamicGridLayout = ({
  mainStreamManager,
  publisher,
  subscribers,
  onStreamClick,
}) => {
  const allStreams = publisher ? [publisher, ...subscribers] : subscribers;
  
  const getGridLayout = (count) => {
    if (count === 1) return { cols: 1, rows: 1 };
    if (count === 2) return { cols: 2, rows: 1 };
    if (count === 3) return { cols: 3, rows: 1 };
    if (count === 4) return { cols: 2, rows: 2 };
    if (count <= 6) return { cols: 3, rows: 2 };
    if (count <= 9) return { cols: 3, rows: 3 };
    return { cols: 4, rows: 3 }; // 10-12 participants
  };

  const { cols, rows } = getGridLayout(allStreams.length);

  const getGridItemHeight = (rows) => {
    if (rows === 1 && allStreams.length === 1) return 'h-[70vh]';
    if (rows === 1 && allStreams.length === 2) return 'h-[70vh]';
    if (rows === 1 && allStreams.length === 3) return 'h-[45vh]';
    if (rows === 2) return 'h-[36vh]';
    if (rows === 3) return 'h-[24vh]';
    return 'h-[22vh]';
  };

  const getGridColsClass = (cols) => {
    const gridCols = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4'
    };
    return gridCols[cols];
  };

  return (
    <div className="h-full p-4 overflow-hidden">
      <div 
        className={`grid gap-4 h-full ${getGridColsClass(cols)} items-center`}
      >
        {allStreams.map((stream) => (
          <div
            key={stream.stream?.connection?.connectionId || 'publisher'}
            onClick={() => onStreamClick(stream)}
            className={`
              ${getGridItemHeight(rows)}
              bg-gray-800 
              rounded-lg 
              overflow-hidden 
              cursor-pointer 
              hover:ring-2 
              hover:ring-my-blue-2 
              transition-all
              relative
            `}
          >
            <UserVideo streamManager={stream} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicGridLayout;