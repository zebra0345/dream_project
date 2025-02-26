import { useState, useEffect } from 'react';
import api from '../../services/api/axios';

export default function AdminPage() {
  // 신고들
  const [reports, setReports] = useState([]);
  // 필터링 상태
  const [selectedType, setSelectedType] = useState('ALL');
  // 승인 완료된 신고보관
  const [processedReports, setProcessedReports] = useState(new Set());

  const reportTypes = ['ALL', 'POST', 'USER', 'COMMENT', 'CHALLENGE'];

  // 렌더링할때마다 신고 조회
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/admin/reports');  // API 엔드포인트는 실제 환경에 맞게 수정 필요
        console.log('API Response:', response.data);
        setReports(response.data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      }
    };
    
    fetchReports();
  }, []);

  // 초기 필터링 all이면 전부다. 필터링 선택했으면, reportType에 맞는것들만 filter
  const filteredReports = selectedType === 'ALL' 
    ? reports 
    : reports.filter(report => report.reportType === selectedType);

  // 승인하기
  const handleApprove = async (report) => {
    try {
      const response = await api.post(`/admin/reports/${report.reportId}/confirm`);  // API 엔드포인트는 실제 환경에 맞게 수정 필요
      console.log("신고 접수완료", response);
      setProcessedReports(prev => new Set(prev).add(report.reportId));
    } catch (error) {
      console.error('접수실패:', error);
    }
  };

  // 반려하기
  const handleReject = async (report) => {
    try {
      const response = await api.delete(`/admin/reports/${report.reportId}/cancel`);  // API 엔드포인트는 실제 환경에 맞게 수정 필요
      console.log("신고 반려완료", response);
      setReports(reports.filter(r => r.reportId !== report.reportId));

    } catch (error) {
      console.error('반려실패:', error);
    }
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gray-200 gap-10 ">
        <div className="p-6 max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">신고 관리</h1>
          
          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6">
            {reportTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded ${
                  selectedType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Reports Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">유형</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">신고된 사용자</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">신고자</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">신고 일시</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">사유</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">처리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.reportId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{report.reportId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.reportType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.reportedUser}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.reporter}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(report.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">{report.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                      {processedReports.has(report.reportId) ? (
                          <span className="text-green-600 font-medium">처리 완료</span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleApprove(report)}
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              승인
                            </button>
                            <button
                              onClick={() => handleReject(report)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              반려
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}