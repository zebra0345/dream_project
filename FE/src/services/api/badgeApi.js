import api from "./axios";

export const badgeApi = {
  // 유저 태그 조회
  getMyBadge: async () => {
    const response = await api.get("/badges/my");
    return response
  },
};
