const TestLoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-2 text-white">연결 중...</span>
    </div>
  );
};

export default TestLoadingSpinner;