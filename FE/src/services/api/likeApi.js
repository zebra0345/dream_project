import api from "./axios"

const likeApi = {
    addLike: (postId) => api.post(`/api/likes/${postId}`),
    removeLike: (postId) => api.delete(`/api/likes/${postId}`),
    getLikeCount: (postId) => api.get(`/api/likes/${postId}/count`),
    checkIfLiked: (postId) => api.get(`/api/likes/${postId}/isLiked`), // ✅ 좋아요 여부 확인
  };
  
  export default likeApi;