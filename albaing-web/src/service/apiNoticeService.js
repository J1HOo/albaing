import axios from 'axios';

const apiNoticeService = {
    // 모든 공지사항 가져오기
    getAllNotices: () => {
        return new Promise((resolve, reject) => {
            axios.get('/api/notices')
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    // 공지사항 상세 정보 가져오기
    getNoticeById: (noticeId) => {
        return new Promise((resolve, reject) => {
            axios.get(`/api/notices/${noticeId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
};

export default apiNoticeService;