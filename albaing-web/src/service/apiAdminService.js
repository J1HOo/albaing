import axios from 'axios';

const API_URL = '/api/admin';

const apiAdminService = {
    // 대시보드 통계 가져오기
    getDashboardStats: () => {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/dashboard/stats`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    // 회원 관리 APIs
    getAllUsers: (filters) => {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/users`, { params: filters })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    getUserById: (userId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/users/${userId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    deleteUser: (userId) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/users/${userId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    // 기업 관리 APIs
    getAllCompanies: (filters) => {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/companies`, { params: filters })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    getCompanyById: (companyId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/companies/${companyId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    deleteCompany: (companyId) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/companies/${companyId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    // 기업 승인 상태 변경
    updateCompanyApprovalStatus: (companyId, status) => {
        return new Promise((resolve, reject) => {
            axios.patch(`${API_URL}/companies/${companyId}/approval`, { status })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    // 공고 관리 APIs
    getAllJobPosts: (filters) => {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/job-posts`, { params: filters })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    getJobPostById: (jobPostId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/job-posts/${jobPostId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    deleteJobPost: (jobPostId) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/job-posts/${jobPostId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    // 리뷰 관리 APIs
    getAllReviews: () => {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/reviews`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    getReviewById: (reviewId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/reviews/${reviewId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    deleteReview: (reviewId) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/reviews/${reviewId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    // 공지사항 관리 APIs
    getAllNotices: () => {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/notices`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    getNoticeById: (noticeId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/notices/${noticeId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    createNotice: (noticeData) => {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/notices`, noticeData)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    updateNotice: (noticeId, noticeData) => {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/notices/${noticeId}`, noticeData)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    deleteNotice: (noticeId) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/notices/${noticeId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
};

export default apiAdminService;