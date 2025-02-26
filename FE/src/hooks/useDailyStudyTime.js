import { useState, useEffect } from "react";
import dashboardApi from "../services/api/dashboardApi";
import { formatLocalDate } from "../utils/formatLocalDate";

const useDailyStudyTime = (date, dashboardType) => {
    const [dailyStudyList, setDailyStudyList] = useState([]);
  
    const fetchDailyStudyTime = async (year, month) => {
      try {
        const data = await dashboardApi.getDailyStudyTime(year, month);
        setDailyStudyList(data);
      } catch (error) {
        console.log("일별 공부시간 조회 실패 : ", error);
      }
    };
  
    useEffect(() => {
      if (dashboardType === "date") {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        fetchDailyStudyTime(year, month);
      }
    }, [dashboardType, date]);
  
    const selectedDateString = formatLocalDate(date);
    const foundStudyItem = dailyStudyList.find(
      (item) => item.recordAt === selectedDateString
    );
    const todayStudyTimeSec = foundStudyItem?.totalStudyTime || 0;
    const totalStudyTimeSec = dailyStudyList.reduce(
      (acc, item) => acc + item.totalStudyTime,
      0
    );
    const validStudyData = dailyStudyList.filter(
      (item) => item.recordAt <= selectedDateString
    );
    const totalStudyTimeSecFiltered = validStudyData.reduce(
      (acc, item) => acc + item.totalStudyTime,
      0
    );
    const averageStudyTimeSec =
      validStudyData.length > 0
        ? totalStudyTimeSecFiltered / validStudyData.length
        : 0;
  
    return { dailyStudyList, todayStudyTimeSec, totalStudyTimeSec, averageStudyTimeSec };
  };
  
  export default useDailyStudyTime;