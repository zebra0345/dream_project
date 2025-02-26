import { IoIosSquareOutline } from "react-icons/io";
import { CiGrid41, CiGrid2H, CiGrid42 } from "react-icons/ci";
import { BsGrid1X2 } from "react-icons/bs";

const LayoutController = ({ currentLayout, onLayoutChange }) => {
  const layouts = [
    { id: 'vertical-grid', icon: BsGrid1X2, label: '기본' },
    { id: 'spotlight', icon: IoIosSquareOutline, label: '스포트라이트' },
    { id: 'grid', icon: CiGrid41, label: '그리드' },
    { id: 'teaching', icon: CiGrid2H, label: '티칭' },
    { id: 'mosaic', icon: CiGrid42, label: '모자이크' }
  ];

  return (
    <div className="absolute top-4 right-4 flex gap-2 bg-gray-800 bg-opacity-50 p-2 rounded-lg shadow-lg">
      {layouts.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onLayoutChange(id)}
          className={`p-2 rounded-lg transition-all ${
            currentLayout === id 
              ? 'bg-my-blue-2 text-white' 
              : 'text-gray-400 hover:bg-gray-700'
          }`}
          title={label}
        >
          <Icon className="w-6 h-6" />
        </button>
      ))}
    </div>
  );
};

export default LayoutController;