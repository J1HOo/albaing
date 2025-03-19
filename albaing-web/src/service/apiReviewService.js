import axios from "axios";

const API_REVIEW_URL = "http://localhost:8080/api";

const apiReviewService = {
    // 내가 쓴 리뷰 목록 불러오기
    getReviewsByUser: function (userId, setReview) {
        return axios
            .get(`${API_REVIEW_URL}/user/${userId}/reviews`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setReview(response.data);
                } else {
                    console.error("리뷰 데이터가 배열이 아닙니다:", response.data);
                }
            })
            .catch(error => console.error("작성한 리뷰를 가져오는 것을 실패했습니다. : ", error));
    },

    // 내가 쓴 댓글 목록 불러오기
    getCommentsByUser: function (userId, setComment) {
        return axios
            .get(`${API_REVIEW_URL}/user/${userId}/comments`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setComment(response.data);
                } else {
                    console.error("댓글 데이터가 배열이 아닙니다:", response.data);
                }
            })
            .catch(error => console.error("작성한 댓글을 가져오는 것을 실패했습니다. :", error));
    },

    // 리뷰 삭제
    removeReview: function (reviewId, userId) {
        return axios
            .delete(`${API_REVIEW_URL}/user/${userId}/reviews/${reviewId}`, {
                data: { userId: userId }
            })
            .catch(error => console.error("리뷰 삭제를 실패했습니다 : ", error));
    },

    // 댓글 삭제
    removeComment: function (commentId, userId) {
        return axios
            .delete(`${API_REVIEW_URL}/user/${userId}/comments/${commentId}`, {
                data: { userId: userId }
            })
            .catch(error => console.error("댓글 삭제를 실패했습니다 : ", error));
    }
};

export default apiReviewService;
