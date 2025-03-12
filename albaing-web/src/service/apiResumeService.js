import axios from 'axios';

const apiResumeService = {

    // getResumeIdByUser: function (userId,resumeId) {
    //     axios
    //         .get(`api/resume/user/${userId}`)
    //         .then((res) => resumeId(res.data))
    //         .catch((err) => {
    //             console.error("resumeId 가져오기 실패:", err);
    //             return null;
    //         });
    // },

    getResume: function (resumeId) {
        axios.get(`/api/resume/${resumeId}`)
            .then(response => {
                console.log('이력서 조회 성공:', response.data);
                return response.data;
            })
            .catch(error => {
                console.error('이력서 조회 오류:', error);
                throw error;
            });
    },


    getResumeByUserId: function (userId) {
        axios.get(`/api/resume/user/${userId}`)
            .then(response => {
                console.log('사용자 ID로 이력서 조회 성공:', response.data);
                return response.data;
            })
            .catch(error => {
                console.error('사용자 ID로 이력서 조회 오류:', error);
                throw error;
            });
    },

    updateResume: function (resumeId, resumeUpdateRequest) {
         axios.put(`/api/resume/update/${resumeId}`, resumeUpdateRequest)
            .then(response => {
                console.log('이력서 수정 성공:', response.data);
                return response.data;
            })
            .catch(error => {
                console.error('이력서 수정 오류:', error);
                throw error;
            });
    },

    createResume: function (resumeCreateRequest) {
        axios.post('/api/resume/create', resumeCreateRequest)
            .then(response => {
                console.log('이력서 생성 성공:', response.data);
                return response.data;
            })
            .catch(error => {
                console.error('이력서 생성 오류:', error);
                throw error;
            });
    },
};

export default apiResumeService;