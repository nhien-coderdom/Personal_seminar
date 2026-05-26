import apiClient from "./apiClient";

export const postApi = {
  getPosts: () => apiClient.get("/posts"),

  getPost: (postId) => apiClient.get(`/posts/${postId}`),

  createPost: (content, username) =>
    apiClient.post("/posts", { username, content }),

  updatePost: (postId, content, username) =>
    apiClient.patch(`/posts/${postId}`, { username, content }),

  deletePost: (postId) =>
    apiClient.delete(`/posts/${postId}`),

  likePost: (postId, username) =>
    apiClient.post(`/posts/${postId}/likes`, { username }),

  unlikePost: (postId) =>
    apiClient.delete(`/posts/${postId}/likes`),
};

export const commentApi = {

  getComments: (postId) =>
    apiClient.get(`/posts/${postId}/comments`),

  createComment: (postId, content, username) =>
    apiClient.post(`/posts/${postId}/comments`, { username, content }),

  getComment: (postId, commentId) =>
    apiClient.get(`/posts/${postId}/comments/${commentId}`),

  updateComment: (postId, commentId, content, username) =>
    apiClient.patch(`/posts/${postId}/comments/${commentId}`, { username, content }),

  deleteComment: (postId, commentId) =>
    apiClient.delete(`/posts/${postId}/comments/${commentId}`),
};
