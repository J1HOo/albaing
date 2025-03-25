import axios from 'axios';
import { getErrorMessage } from '../components/ErrorHandler';

// API 기본 URL 설정
const API_URL = "http://localhost:8080/api";

const apiResumeService = {
    // 이력서 ID로 조회
    getResume: function(resumeId) {
        return axios.get(`${API_URL}/resume/${resumeId}`, { withCredentials: true })
            .then(response => response.data)
            .catch(error => {
                console.error('이력서 조회 오류:', getErrorMessage(error));
                throw error;
            });
    },

    deleteCareer : function (careerId, resumeId){
        return axios
            .delete(`${API_URL}/resume/${resumeId}/careers/${careerId}`)
            .then(response => response.data)
            .catch(error => {
                console.error("경력 삭제 오류", error);
                throw error;
            })
    },


    // 사용자 ID로 이력서 조회
    getResumeByUserId: (userId) => {
        return axios.get(`${API_URL}/resume/user/${userId}`, { withCredentials: true })
            .then(response => response.data)
            .catch(error => {
                console.error('이력서 조회 오류:', getErrorMessage(error));
                throw error;
            });
    },


    // 이력서 업데이트
    updateResume: (resumeId, resumeData) => {
        return axios
            .put(`${API_URL}/resume/update/${resumeId}`, resumeData, { withCredentials: true })
            .then(response => response.data)
            .catch(error => {
                console.error('이력서 업데이트 오류:', getErrorMessage(error));
                throw error;  // 예외를 던져 호출한 곳에서 처리하도록 함
            });
    },
};

export default apiResumeService;