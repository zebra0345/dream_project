import api from "./axios";

const COMMUNITY_URL = "/boards";

const communityApi = {
  // 글 목록 조회
  getList: () =>
    api
      .get(COMMUNITY_URL)
      .then((response) => response.data) // response.data 반환
      .catch((error) => {
        console.error("에러 발생:", error);
        throw error;
      }),


  // 최신순 정렬 + 페이지네이션 API
  // 백엔드에서는 /boards/sorted-by-newest 엔드포인트를 통해 createdAt 컬럼을 기준으로 내림차순 정렬된 Page 객체를 반환합니다.
  // (쿼리 파라미터: page(0부터 시작), size, category)
  getSortedByNewest: (page, size, category) =>
    api
      .get(`${COMMUNITY_URL}/sorted-by-newest`, {
        params: { page, size, category },
      })
      .then((response) => response.data) // response.data 반환
      .catch((error) => {
        console.error("최신순 정렬 에러:", error);
        throw error;
      }),

  // 조회순 정렬 + 페이지네이션 API
  // 백엔드에서는 /boards/sorted-by-views 엔드포인트가 Page 객체 형식으로 응답합니다.
  // (쿼리 파라미터: page(0부터 시작), size)
  getSortedByViews: (page, size) =>
    api
      .get(`${COMMUNITY_URL}/sorted-by-views`, { params: { page, size } })
      .then((response) => response.data) // response.data 반환
      .catch((error) => {
        console.error("조회순 정렬 에러:", error);
        throw error;
      }),

  // 좋아요순 정렬 + 페이지네이션 API
  // 백엔드에서는 /boards/sorted-by-likes 엔드포인트를 통해
  // 지정된 카테고리의 게시글을 likeCount 기준 내림차순 정렬 및 페이징 처리하여 반환합니다.
  getSortedByLikes: (page, size, category) =>
    api
      .get(`${COMMUNITY_URL}/sorted-by-likes`, {
        params: { page, size, category },
      })
      .then((response) => response.data) // response.data 반환
      .catch((error) => {
        console.error("좋아요순 정렬 에러:", error);
        throw error;
      }),

  // 댓글순 정렬 + 페이지네이션 API
  getSortedByComments: (page, size, category) =>
    api
      .get(`${COMMUNITY_URL}/sorted-by-comments`, {
        params: { page, size, category },
      })
      .then((response) => response.data) // response.data 반환
      .catch((error) => {
        console.error("댓글순 정렬 에러:", error);
        throw error;
      }),

  // 글 상세 조회
  getDetail: (id) =>
    api
      .get(`${COMMUNITY_URL}/${id}`)
      .then((response) => response.data) // response.data 반환
      .catch((error) => {
        console.error("에러 발생:", error);
        throw error;
      }),

  // 글 작성
  create: (data) =>
    api.post(COMMUNITY_URL, data, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }),

  // 글 수정
  update: (id, data) =>
    api
      .put(`${COMMUNITY_URL}/${id}`, data)
      .then((response) => response.data) // response.data 반환
      .catch((error) => {
        console.error("에러 발생:", error);
        throw error;
      }),

  // 글 삭제
  delete: (id) =>
    api
      .delete(`${COMMUNITY_URL}/${id}`)
      .then((response) => response.data) // response.data 반환
      .catch((error) => {
        console.error("에러 발생:", error);
        throw error;
      }),
  // 댓글 조회(계층)
  getCommentsHierarchy: (postId) => api.get(`/api/post/${postId}/hierarchy`),

  // 댓글 조회(평면)
  getComments: (postId) => api.get(`/api/post/${postId}/comments`),

  // 댓글 작성
  createComment: (postId, data) =>
    api.post(`/api/post/${postId}/comments`, data),

  // 댓글 수정
  updateComment: (postId, commentId, data) =>
    api.put(`/api/post/${postId}/${commentId}`, data),

  // 댓글 삭제
  deleteComment: (postId, commentId) =>
    api.delete(`/api/post/${postId}/${commentId}`),

  // 특정 게시글의 댓글 개수 가져오기
  getCommentCount: (postId) =>
    api
    .get(`/api/post/${postId}/comment-count`)
    .then((response) => response.data) // data만 반환
    .catch((error) => {
      console.error("댓글 개수 조회 에러:", error);
      throw error;
    }),
  // 특정 게시글의 좋아요 개수 가져오기
  getLikeCount: (postId) =>
    api
      .get(`/api/likes/${postId}/count`)
      .then((response) => response.data) // data만 반환
      .catch((error) => {
        console.error("좋아요 개수 조회 에러:", error);
        throw error;
      }),

  // 키워드 검색 API (GET /boards/search?keyword=...)
  searchPosts: (keyword, page, size) =>
    api
      .get(`${COMMUNITY_URL}/search`, {
        params: { keyword, page, size },
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("키워드 검색 에러:", error);
        throw error;
      }),

  // 🔹 의미 기반 검색 API (GET /boards/search/searchSemantic?keyword=...)
  searchSemanticPosts: (keyword, page, size, topOnly = false) =>
    api
      .get(`${COMMUNITY_URL}/search/search-semantic`, {
        params: { keyword, page, size, topOnly },
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("의미 기반 검색 에러:", error);
        return { content: [], totalPages: 1 }; // AI 검색 에러 발생 시 빈 배열 반환
      }),

  //태그 검색 api
  searchByTag: (tag, page, size) =>
    api
      .get(`${COMMUNITY_URL}/search-by-tag`, { params: { tag, page, size } })
      .then((response) => response.data)
      .catch((error) => {
        console.error("태그 검색 에러:", error);
        throw error;
      }),

};

export default communityApi;
