import axios from 'axios';
import { ErrorHandler } from '../components/ErrorHandler';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// 응답 인터셉터 설정
api.interceptors.response.use(
    response => response,
    error => {
        // 에러 처리 로직
        console.error('API 오류:', ErrorHandler(error));
        return Promise.reject(error);
    }
);

// 어드민 API 서비스
const apiAdminService = {
    // 대시보드 통계 데이터 가져오기
    getDashboardStats() {
        return api.get('/admin/stats')
            .then(response => response.data)
            .catch(error => {
                console.error('대시보드 통계 로드 실패:', error);
                return Promise.reject(error);
            });
    },

    // 회원 관리 API
    getUsers(params = {}) {
        return api.get('/admin/users', { params })
            .then(response => response.data)
            .catch(error => {
                console.error('회원 목록 로드 실패:', error);
                return Promise.reject(error);
            });
    },

    getUserDetail(userId) {
        return api.get(`/admin/users/${userId}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`회원 상세정보(ID: ${userId}) 로드 실패:`, error);
                return Promise.reject(error);
            });
    },

    updateUser(userId, userData) {
        return api.put(`/admin/users/${userId}`, userData)
            .then(response => response.data)
            .catch(error => {
                console.error(`회원 정보(ID: ${userId}) 업데이트 실패:`, error);
                return Promise.reject(error);
            });
    },

    deleteUser(userId) {
        // 관련 데이터 먼저 삭제 후 사용자 삭제 (Promise 체인 활용)
        return api.delete(`/admin/users/${userId}/related-data`)
            .then(() => api.delete(`/admin/users/${userId}`))
            .then(response => response.data)
            .catch(error => {
                console.error(`회원(ID: ${userId}) 삭제 실패:`, error);
                return Promise.reject(error);
            });
    },

    // 기업 관리 API
    getCompanies(params = {}) {
        return api.get('/admin/companies', { params })
            .then(response => response.data)
            .catch(error => {
                console.error('기업 목록 로드 실패:', error);
                return Promise.reject(error);
            });
    },

    getPendingCompanies() {
        return api.get('/admin/companies/pending')
            .then(response => response.data)
            .catch(error => {
                console.error('승인 대기 기업 목록 로드 실패:', error);
                return Promise.reject(error);
            });
    },

    getCompanyDetail(companyId) {
        return api.get(`/admin/companies/${companyId}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`기업 상세정보(ID: ${companyId}) 로드 실패:`, error);
                return Promise.reject(error);
            });
    },

    updateCompanyStatus(companyId, status) {
        return api.patch(`/admin/companies/${companyId}/status`, { companyApprovalStatus: status })
            .then(response => response.data)
            .catch(error => {
                console.error(`기업 상태(ID: ${companyId}) 업데이트 실패:`, error);
                return Promise.reject(error);
            });
    },

    deleteCompany(companyId) {
        return api.delete(`/admin/companies/${companyId}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`기업(ID: ${companyId}) 삭제 실패:`, error);
                return Promise.reject(error);
            });
    },

    // 공고 관리 API
    getJobPosts(params = {}) {
        return api.get('/admin/job-posts', { params })
            .then(response => response.data)
            .catch(error => {
                console.error('공고 목록 로드 실패:', error);
                return Promise.reject(error);
            });
    },

    getJobPostDetail(jobPostId) {
        return api.get(`/admin/job-posts/${jobPostId}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`공고 상세정보(ID: ${jobPostId}) 로드 실패:`, error);
                return Promise.reject(error);
            });
    },

    updateJobPostStatus(jobPostId, status) {
        return api.patch(`/admin/job-posts/${jobPostId}/status`, { status })
            .then(response => response.data)
            .catch(error => {
                console.error(`공고 상태(ID: ${jobPostId}) 업데이트 실패:`, error);
                return Promise.reject(error);
            });
    },

    deleteJobPost(jobPostId) {
        // 관련 지원내역 먼저 삭제 후 공고 삭제
        return api.delete(`/admin/job-posts/${jobPostId}/applications`)
            .then(() => api.delete(`/admin/job-posts/${jobPostId}`))
            .then(response => response.data)
            .catch(error => {
                console.error(`공고(ID: ${jobPostId}) 삭제 실패:`, error);
                return Promise.reject(error);
            });
    },

    // 지원내역 관리 API
    getApplications(params = {}) {
        return api.get('/admin/applications', { params })
            .then(response => response.data)
            .catch(error => {
                console.error('지원내역 로드 실패:', error);
                return Promise.reject(error);
            });
    },

    getFilteredApplications(userId, jobPostId) {
        const params = {};
        if (userId) params.userId = userId;
        if (jobPostId) params.jobPostId = jobPostId;

        return api.get('/admin/job-applications', { params })
            .then(response => response.data)
            .catch(error => {
                console.error('필터링된 지원내역 로드 실패:', error);
                return Promise.reject(error);
            });
    },

    updateApplicationStatus(applicationId, status) {
        return api.put(`/admin/applications/${applicationId}/status`, { approveStatus: status })
            .then(response => response.data)
            .catch(error => {
                console.error(`지원내역 상태(ID: ${applicationId}) 업데이트 실패:`, error);
                return Promise.reject(error);
            });
    },

    // 리뷰 관리 API
    getAllReviews() {
        return api.get('/admin/reviews')
            .then(response => response.data)
            .catch(error => {
                console.error('리뷰 목록 로드 실패:', error);
                return Promise.reject(error);
            });
    },

    getReviewDetail(reviewId) {
        return api.get(`/admin/reviews/${reviewId}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`리뷰 상세정보(ID: ${reviewId}) 로드 실패:`, error);
                return Promise.reject(error);
            });
    },

    updateReview(reviewId, reviewData) {
        return api.put(`/admin/reviews/${reviewId}`, reviewData)
            .then(response => response.data)
            .catch(error => {
                console.error(`리뷰 업데이트(ID: ${reviewId}) 실패:`, error);
                return Promise.reject(error);
            });
    },

    deleteReview(reviewId) {
        return api.delete(`/admin/reviews/${reviewId}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`리뷰 삭제(ID: ${reviewId}) 실패:`, error);
                return Promise.reject(error);
            });
    },

    deleteComment(commentId) {
        return api.delete(`/admin/reviews/comments/${commentId}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`댓글 삭제(ID: ${commentId}) 실패:`, error);
                return Promise.reject(error);
            });
    },

    // 공지사항 관리 API
    getAllNotices() {
        return api.get('/admin/notices')
            .then(response => response.data)
            .catch(error => {
                console.error('공지사항 목록 로드 실패:', error);
                return Promise.reject(error);
            });
    },

    getNoticeById(noticeId) {
        return api.get(`/admin/notices/${noticeId}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`공지사항 상세정보(ID: ${noticeId}) 로드 실패:`, error);
                return Promise.reject(error);
            });
    },

    createNotice(noticeData) {
        return api.post('/admin/notices', noticeData)
            .then(response => response.data)
            .catch(error => {
                console.error('공지사항 생성 실패:', error);
                return Promise.reject(error);
            });
    },

    updateNotice(noticeId, noticeData) {
        return api.put(`/admin/notices/${noticeId}`, noticeData)
            .then(response => response.data)
            .catch(error => {
                console.error(`공지사항 업데이트(ID: ${noticeId}) 실패:`, error);
                return Promise.reject(error);
            });
    },

    deleteNotice(noticeId) {
        return api.delete(`/admin/notices/${noticeId}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`공지사항 삭제(ID: ${noticeId}) 실패:`, error);
                return Promise.reject(error);
            });
    }
};

export default apiAdminService;